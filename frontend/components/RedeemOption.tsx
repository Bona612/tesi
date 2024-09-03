import { useState } from "react";
import QrReader from "@/components/QrReader";
import { UseFormReturn } from "react-hook-form";
import { Attestation } from "@/types";


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
            <button onClick={handleOpenQrReader}>Open QR Reader</button>
            {(isQrReaderVisible || isAttestationScanned) && <QrReader handleOnScanSuccess={handleOnScanSuccess} onScannedAttestation={handleAttestationScanned} onClose={handleCloseQrReader} />}
        </div>
    );
};

export default RedeemOption;
