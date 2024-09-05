"use client";

import { useEffect, useRef, useState } from "react";

// Styles
import "./QrReader.css";

// Qr Scanner
import QrScanner from "qr-scanner";
import QrFrame from "../assets/qr-frame.svg";
import { Attestation } from "@/types";
import { jsonToAttestation } from "@/utils/utils";


interface QRReaderProps {
    handleOnScanSuccess: (attestation: Attestation) => void,
}

const QrReader_original = ({handleOnScanSuccess}: QRReaderProps) => {
  // QR States
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  // Result
  const [isQrReaderVisible, setIsQrReaderVisible] = useState<boolean>(false);
  const [scannedAttestation, setScannedAttestation] = useState<Attestation | undefined>(undefined);


  const requestCameraPermission = async () => {
      try {
        //   const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          // QUI MANCAVA LA SIMMETRIA DEL VIDEO
        //   if (videoEl.current) {
        //       videoEl.current.srcObject = stream;
        //       videoEl.current.play();
        //   }
          // setQrOn(true);
          setPermissions(true);
      } 
      catch (err) {
          setError(err);
          console.error('Error accessing media devices.', err);
          // setQrOn(false);
          setPermissions(false);
      }
  };

  function onRequestCameraPermission() {
      requestCameraPermission()
  }

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
        // 🖨 Print the "result" to browser console.
        console.log("success");
        console.log(result);
        // ✅ Handle success.
        // 😎 You can do whatever you want with the scanned result.
        const attestation: Attestation = jsonToAttestation(result?.data)
        // DA VERIFICARE
        handleOnScanSuccess(attestation);
        console.log(attestation)

        setScannedAttestation(attestation);
        if (attestation !== undefined) {
            //   onScannedAttestation();
        }

        // if (!videoEl?.current) {
        //     scanner?.current?.stop();
        // }
  };

  // Fail
  const onScanFail = (err: string | Error) => {
      // 🖨 Print the "err" to browser console.
    //   console.log("fail");
    //   console.log(err);
  };

//   useEffect(() => {
//       console.log("start permission")
//       requestCameraPermission();
//       console.log("end permission")
//   }, []);

  useEffect(() => {
      console.log("setQrOn");
      console.log(qrOn);
  }, [qrOn]);

//   useEffect(() => {
//       console.log("start create qr")
//       if (videoEl?.current && !scanner.current) {
//             console.log("dentro init");
//           // 👉 Instantiate the QR Scanner
//           scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
//               onDecodeError: onScanFail,
//               // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
//               preferredCamera: "environment",
//               // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
//               highlightScanRegion: true,
//               // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
//               highlightCodeOutline: true,
//               // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
//               overlay: qrBoxEl?.current || undefined,
//           });

//           // 🚀 Start QR Scanner
//           scanner?.current
//             ?.start()
//             .then(() => setQrOn(true))
//             .catch((err) => {
//               if (err) setQrOn(false);
//             });
//       }
//       console.log("end create qr")

//       // 🧹 Clean up on unmount.
//       // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
//       return () => {
//           if (!videoEl?.current) {
//               scanner?.current?.stop();
//           }
//       };
//   }, []);

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
      // if (!permissions) {
      //     alert("Camera access is required to scan QR codes. Please enable camera access in your browser settings and reload the page.");
      // }
      if (!permissions) {
            console.log("Camera access is required to scan QR codes. Please enable camera access in your browser settings and reload the page.")
      }
      else {
        if (videoEl?.current && !scanner.current) {
            console.log("dentro init");
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
        console.log("end create qr")

        // 🧹 Clean up on unmount.
        // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
        return () => {
            if (!videoEl?.current) {
                scanner?.current?.stop();
            }
        };
      }
      console.log(permissions);
  }, [permissions]);  

  //  DA VEDERE, O COSì O CON PROVIDER
  useEffect(() => {
    console.log("isQrReaderVisible changed: ", isQrReaderVisible)
    console.log("videoEl?.current: ", videoEl?.current)
    if (isQrReaderVisible) {
        console.log("start");
        console.log(videoEl?.current);
        console.log(!scanner.current);
        if (videoEl?.current) {
            console.log("dentro init");
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
            console.log("stop");
            scanner?.current?.stop();
        }
    }
    
  }, [isQrReaderVisible])


    const handleOpenQrReader = () => {
        setIsQrReaderVisible(true);
    };

    const handleCloseQrReader = () => {
        setIsQrReaderVisible(false);
    };


  return (
    <div>
        {permissions ? (
            <div>
                {isQrReaderVisible ? (
                    <div>
                        {/* <Button type="button" onClick={handleCloseQrReader}>Close QR Reader</Button> */}
                        {/* <Button type="button" onClick={handleOpenQrReader}>Open QR Reader</Button> */}
                        {/* <Button type="button" onClick={onRequestCameraPermission}>Concede permissions</Button> */}
                        <button onClick={handleCloseQrReader}>Close QR Reader</button>
                        <div className="qr-reader">
                            {/* <button onClick={onClose}>Close</button> */}
                            <video ref={videoEl}></video>
                            <div ref={qrBoxEl} className="qr-box">
                                <img
                                src={"qr-frame.svg"}
                                alt="Qr Frame"
                                width={256}
                                height={256}
                                className="qr-frame"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={handleOpenQrReader}>Open QR Reader</button>
                )}
            </div>
        ) : (
            <button onClick={onRequestCameraPermission}>Concede permissions</button>
        )}
        {/* Show Data Result if scan is success */}
        {/* {scannedAttestation && (
            <p
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 99999,
                color: "white",
            }}
            >
            Scanned Result: {scannedAttestation.anchor}
            </p>
        )} */}
    </div>
  );
};

export default QrReader_original;