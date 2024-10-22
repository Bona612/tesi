import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Anchor, Attestation } from "@/types"
import { useState } from "react"
import { AttestationShower } from "./AttestationShower"
import QrReader from "./QrReader"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react";


interface AlertDialogRedeemProps {
  handleOnScanSuccess?: (attestation: Attestation) => void,
  handleRedeemNFT?: (attestation: Attestation) => void,
  isOpen: boolean;
  openDialog: () => void;
  setIsOpen: (isOpen: boolean) => void;
  closeDialog: () => void;
  isLoading: boolean,
}


export function AlertDialogRedeem({handleOnScanSuccess, handleRedeemNFT, isOpen, openDialog, setIsOpen, closeDialog, isLoading}: AlertDialogRedeemProps) {
  const [isQrReaderVisible, setIsQrReaderVisible] = useState<boolean>(false);
  const [scannedAttestation, setScannedAttestation] = useState<Attestation | undefined>(undefined);


  const handleOpenQrReader = () => {
      setIsQrReaderVisible(true);
  };

  const handleCloseQrReader = () => {
      setIsQrReaderVisible(false);
  };

  
  const handleConfirmAttestation = () => {
    if (isQrReaderVisible) {
      handleCloseQrReader();
    }

    if (handleOnScanSuccess) {
      handleOnScanSuccess(scannedAttestation as Attestation)
    }
    setScannedAttestation(undefined);
    closeDialog();
  }
  
  const handleOnClick = () => {
    if (isQrReaderVisible) {
      handleCloseQrReader();
    }
   
    if (handleRedeemNFT) {
      handleRedeemNFT(scannedAttestation as Attestation);
    }
    setScannedAttestation(undefined)
  };

  const handleNewAttestation = (attestation: Attestation) => {
    setScannedAttestation(attestation)
  }
  const resetScannedAttestation = () => {
    if (isQrReaderVisible) {
      handleCloseQrReader();
    }
    setScannedAttestation(undefined)
    closeDialog();
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button className="font-bold py-2 px-4 rounded mt-4" onClick={openDialog}>Redeem</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Scan QRcode</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-4 py-1 sm:py-4">
          {scannedAttestation &&
            <AttestationShower attestation={scannedAttestation as Anchor} />
          }
          <QrReader isQrReaderVisible={isQrReaderVisible} handleOnScanSuccess={handleNewAttestation} handleOpenQrReader={handleOpenQrReader} handleCloseQrReader={handleCloseQrReader} isLoading={isLoading} />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel 
          className={cn(
            "w-3/4 sm:w-full mx-auto"
          )}
          onClick={resetScannedAttestation} disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              "w-3/4 sm:w-full mx-auto"
            )}
            asChild>
            {handleRedeemNFT ? (
              <Button onClick={handleOnClick} disabled={isLoading || !scannedAttestation}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Redeem"
                )}
              </Button>
            ) : (
              <Button onClick={handleConfirmAttestation} disabled={isLoading || !scannedAttestation}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Confirm attestation"
                )}
              </Button>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>  
      </AlertDialogContent>
    </AlertDialog>
    
  )
}