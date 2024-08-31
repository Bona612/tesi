import { useState } from "react";
import QrReader from "@/components/QrReader";

const ParentComponent = () => {
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
            {(isQrReaderVisible || isAttestationScanned) && <QrReader onScannedAttestation={handleAttestationScanned} onClose={handleCloseQrReader} />}
        </div>
    );
};

export default ParentComponent;
