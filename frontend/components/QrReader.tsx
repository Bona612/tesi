import { useEffect, useRef, useState } from "react";

// Styles
import "./QrReader.css";

// Qr Scanner
import QrScanner from "qr-scanner";
import QrFrame from "../assets/qr-frame.svg";
import { AttestationShower } from "@/components/AttestationShower";
import { Attestation } from "@/types";
import { jsonToAttestation } from "@/utils/utils";
import { UseFormReturn } from "react-hook-form";


interface QrReaderProps {
    onClose: () => void;
    onScannedAttestation: () => void;
    handleOnScanSuccess: (attestation: Attestation) => void,
}



const QrReader = ({ onClose, onScannedAttestation, handleOnScanSuccess }: QrReaderProps) => {
    // QR States
    const scanner = useRef<QrScanner>();
    const videoEl = useRef<HTMLVideoElement>(null);
    const qrBoxEl = useRef<HTMLDivElement>(null);
    const [qrOn, setQrOn] = useState<boolean>(true);
    const [permissions, setPermissions] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    // Result
    const [scannedAttestation, setScannedAttestation] = useState<Attestation | undefined>(undefined);


    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoEl.current) {
                videoEl.current.srcObject = stream;
                videoEl.current.play();
            }
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
            onScannedAttestation();
        }
    };

    // Fail
    const onScanFail = (err: string | Error) => {
        // 🖨 Print the "err" to browser console.
        console.log("fail");
        console.log(err);
    };

    useEffect(() => {
        console.log("start permission")
        requestCameraPermission();
        console.log("end permission")
    }, []);

    useEffect(() => {
        console.log("setQrOn");
        console.log(qrOn);
    }, [qrOn]);

    useEffect(() => {
        console.log("start create qr")
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
        console.log("end create qr")

        // 🧹 Clean up on unmount.
        // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
        return () => {
            if (!videoEl?.current) {
                scanner?.current?.stop();
            }
        };
    }, []);

    // ❌ If "camera" is not allowed in browser permissions, show an alert.
    useEffect(() => {
        // if (!permissions) {
        //     alert("Camera access is required to scan QR codes. Please enable camera access in your browser settings and reload the page.");
        // }
        if (!permissions) {
            console.log("Camera access is required to scan QR codes. Please enable camera access in your browser settings and reload the page.")
        }
        console.log(permissions);
    }, [permissions]);    


    return (
        <div>
            {permissions && 
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
            }
            {/* Show Data Result if scan is success */}
            {scannedAttestation && (
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
            )}
            {!permissions && <button onClick={onRequestCameraPermission}>Close</button>}
        </div>
    );
};


export default QrReader;