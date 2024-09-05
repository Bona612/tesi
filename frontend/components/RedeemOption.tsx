"use client";

import { useState } from "react";
import QrReader from "@/components/QrReader";
import { UseFormReturn } from "react-hook-form";
import { Attestation } from "@/types";
import QrReader_original from "./QrReader_original";


interface RedeemOptionProps {
    handleOnScanSuccess: (attestation: Attestation) => void,
}


const RedeemOption = ({handleOnScanSuccess}: RedeemOptionProps) => {
    const [isQrReaderVisible, setIsQrReaderVisible] = useState<boolean>(false);
    const [isAttestationScanned, setIsAttestationScanned] = useState<boolean>(false);

    const handleOpenQrReader = () => {
        setIsQrReaderVisible(true);
    };

    const handleCloseQrReader = () => {
        setIsQrReaderVisible(false);
    };

    const handleAttestationScanned = () => {
        setIsAttestationScanned(true)
    }

    return (
        <div>
            {/* {isQrReaderVisible ? (
                <button onClick={handleCloseQrReader}>Close QR Reader</button>
            ) : (
                <button onClick={handleOpenQrReader}>Open QR Reader</button>
            )} */}
            {/* {(isQrReaderVisible || isAttestationScanned) && <QrReader handleOnScanSuccess={handleOnScanSuccess} onScannedAttestation={handleAttestationScanned} onClose={handleCloseQrReader} />} */}
            {/* {(isQrReaderVisible || isAttestationScanned) && <QrReader_original isQrReaderVisible={isQrReaderVisible} />} */}
            <QrReader_original handleOnScanSuccess={handleOnScanSuccess}/>
        </div>
    );
};

export default RedeemOption;
