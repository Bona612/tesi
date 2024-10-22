"use client";

import { useEffect, useRef, useState } from "react";

// Styles
import "./QrReader.css";

// Qr Scanner
import QrScanner from "qr-scanner";
import QrFrame from "../assets/qr-frame.svg";
import { Attestation } from "@/types";
import { jsonToAttestation } from "@/utils/utils";
import { Button } from "./ui/button";
import Image from "next/image";



interface QRReaderProps {
    isQrReaderVisible: boolean,
    handleOnScanSuccess: (attestation: Attestation) => void,
    handleOpenQrReader: () => void;
    handleCloseQrReader: () => void;
    isLoading: boolean;
}

const QrReader = ({isQrReaderVisible, handleOnScanSuccess, handleOpenQrReader, handleCloseQrReader, isLoading}: QRReaderProps) => {
  // QR States
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);


  useEffect(() => {
    const permissionGranted = sessionStorage.getItem('cameraPermissionGranted') === 'true';
    setPermissions(permissionGranted);
  }, []);

  const requestCameraPermission = async () => {
      try {
          sessionStorage.setItem('cameraPermissionGranted', 'true');
          setPermissions(true);
      } 
      catch (err) {
          setError(err);
          sessionStorage.setItem('cameraPermissionGranted', 'false');
          setPermissions(false);
      }
  };

  function onRequestCameraPermission() {
      requestCameraPermission()
  }

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
        // ✅ Handle success.
        // 😎 You can do whatever you want with the scanned result.
        const attestation: Attestation = jsonToAttestation(result?.data)
        handleOnScanSuccess(attestation);
  };

  // Fail
  const onScanFail = (err: string | Error) => {
      console.log(err);
  };


  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
      if (!permissions) {
            console.log("Camera access is required to scan QR codes. Please enable camera access in your browser settings and reload the page.")
      }
      else {
        if (videoEl?.current && !scanner.current) {
          // 👉 Instantiate the QR Scanner
          scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
              onDecodeError: onScanFail,
              // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
              preferredCamera: "environment",
              // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
              highlightScanRegion: true,
              // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
              highlightCodeOutline: true,
              // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
              overlay: qrBoxEl?.current || undefined,
          });

          // 🚀 Start QR Scanner
          scanner?.current
            ?.start()
            .then(() => setQrOn(true))
            .catch((err) => {
              if (err) setQrOn(false);
            });
        }

        // 🧹 Clean up on unmount.
        // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
        return () => {
            if (!videoEl?.current) {
                scanner?.current?.stop();
            }
        };
      }
  }, [permissions]);  

  useEffect(() => {
    if (isQrReaderVisible) {
        if (videoEl?.current) {
          // 👉 Instantiate the QR Scanner
          scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
              onDecodeError: onScanFail,
              // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
              preferredCamera: "environment",
              // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
              highlightScanRegion: true,
              // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
              highlightCodeOutline: true,
              // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
              overlay: qrBoxEl?.current || undefined,
          });

          // 🚀 Start QR Scanner
          scanner?.current
            ?.start()
            .then(() => setQrOn(true))
            .catch((err) => {
              if (err) setQrOn(false);
            });
        }
    }
    else {
        if (!videoEl?.current) {
            scanner?.current?.stop();
        }
    }
    
  }, [isQrReaderVisible])


  return (
    <div>
            <div>
                {isQrReaderVisible ? (
                    <div>
                        <Button type="button" onClick={handleCloseQrReader} disabled={isLoading}>Close QR Reader</Button>
                        <div className="qr-reader">
                            <video ref={videoEl} className="rounded-lg"></video>
                            <div ref={qrBoxEl} className="w-full">
                                <Image
                                  src={"qr-frame.svg"}
                                  alt="Qr Frame"
                                  className="qr-frame object-contain w-full h-full"
                                  fill
                                />
                          </div>
                        </div>
                    </div>
                ) : (
                    <Button type="button" onClick={handleOpenQrReader} disabled={isLoading}>Open QR Reader</Button>
                )}
            </div>
    </div>
  );
};

export default QrReader;