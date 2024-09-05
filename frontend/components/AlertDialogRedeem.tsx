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
import { Attestation } from "@/types"
import { useState } from "react"
import { AttestationShower } from "./AttestationShower"
import QrReader from "./QrReader"


interface AlertDialogRedeemProps {
  attestation: Attestation | undefined,
  handleOnScanSuccess: (attestation: Attestation) => void,
  handleRedeemNFT?: (attestation: Attestation) => void,
}


export function AlertDialogRedeem({attestation, handleOnScanSuccess, handleRedeemNFT}: AlertDialogRedeemProps) {

  const [scannedAttestation, setScannedAttestation] = useState<Attestation | undefined>(undefined);

  
  const handleConfirmAttestation = () => {
    handleOnScanSuccess(scannedAttestation as Attestation)
  }
  const handleOnClick = () => {
    if (handleRedeemNFT) {
      handleRedeemNFT(attestation as Attestation);
    }
  };
  const handleNewAttestation = () => {
    setScannedAttestation(scannedAttestation as Attestation)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="font-bold py-2 px-4 rounded mt-4">Redeem</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Scan the QRcode as attestation</AlertDialogTitle>
          {/* <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription> */}
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          {attestation &&
            <AttestationShower attestation={scannedAttestation as Attestation} />
          }
          <QrReader handleOnScanSuccess={handleNewAttestation} />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            {handleRedeemNFT ? (
              <Button type="button" onClick={handleOnClick}>Redeem</Button>
            ) : (
              <Button type="button" onClick={handleConfirmAttestation}>Confirm attestation</Button>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
        
      </AlertDialogContent>
    </AlertDialog>
    
  )
}