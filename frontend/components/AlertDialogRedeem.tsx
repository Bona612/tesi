import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
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
  // attestation?: Attestation | undefined,
  handleOnScanSuccess?: (attestation: Attestation) => void,
  handleRedeemNFT?: (attestation: Attestation) => void,
  isOpen?: boolean;
  openDialog?: () => void;
  setIsOpen?: (isOpen: boolean) => void;
  closeDialog?: () => void;
  isLoading?: boolean,
}


export function AlertDialogRedeem({handleOnScanSuccess, handleRedeemNFT}: AlertDialogRedeemProps) {
  const [isQrReaderVisible, setIsQrReaderVisible] = useState<boolean>(false);
  const [scannedAttestation, setScannedAttestation] = useState<Attestation | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);


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
    resetScannedAttestation()
  }
  // DA CAPIRE SE SERVIRà AGGIUNGERE UNA FUNZIONE DI CHIUSURA ALERT DIALOG
  const handleOnClick = () => {
    setIsLoading(true);
    if (isQrReaderVisible) {
      handleCloseQrReader();
    }
   
    if (handleRedeemNFT) {
      handleRedeemNFT(scannedAttestation as Attestation);
    }
    resetScannedAttestation()
  };
  const handleNewAttestation = (attestation: Attestation) => {
    setScannedAttestation(attestation)
  }
  const resetScannedAttestation = () => {
    if (isQrReaderVisible) {
      handleCloseQrReader();
    }
    setScannedAttestation(undefined)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="font-bold py-2 px-4 rounded mt-4">Redeem</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Scan QRcode</AlertDialogTitle>
          {/* <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription> */}
        </AlertDialogHeader>
        <div className="grid gap-4 py-1 sm:py-4">
          {scannedAttestation &&
            <AttestationShower attestation={scannedAttestation as Anchor} />
          }
          <QrReader isQrReaderVisible={isQrReaderVisible} handleOnScanSuccess={handleNewAttestation} handleOpenQrReader={handleOpenQrReader} handleCloseQrReader={handleCloseQrReader} />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel 
          className={cn(
            "w-3/4 sm:w-full mx-auto"
          )}
          onClick={resetScannedAttestation}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              "w-3/4 sm:w-full mx-auto"
            )}
            asChild>
            {handleRedeemNFT ? (
              // <Button type="button" onClick={handleOnClick}>Redeem</Button>
              <Button onClick={handleOnClick} disabled={isLoading}>
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
              // <Button type="button" onClick={handleConfirmAttestation}>Confirm attestation</Button>
              <Button onClick={handleConfirmAttestation} disabled={isLoading}>
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