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
import RedeemOption from "./RedeemOption"
import { Attestation } from "@/types"
import { useState } from "react"
import { AttestationShower } from "./AttestationShower"


interface AlertDialogRedeemProps {
  attestation: Attestation | undefined,
  handleOnScanSuccess: (attestation: Attestation) => void,
  handleRedeemNFT?: (attestation: Attestation) => void,
}


export function AlertDialogRedeem({attestation, handleOnScanSuccess, handleRedeemNFT}: AlertDialogRedeemProps) {

  // const [scannedAttestation, setScannedAttestation] = useState<Attestation | undefined>(undefined);


  const handleOnClick = () => {
    if (handleRedeemNFT) {
      handleRedeemNFT(attestation as Attestation);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="font-bold py-2 px-4 rounded mt-4">Redeem</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          {attestation &&
            <AttestationShower attestation={attestation as Attestation} />
          }
          <AttestationShower attestation={attestation as Attestation} />
          <RedeemOption handleOnScanSuccess={handleOnScanSuccess} />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="submit" form="nft-form">Redeem</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
        {/* {handleRedeemNFT ? (
          <Button type="button" onClick={handleOnClick}>Redeem</Button>
        ) : (
          <Button type="submit" form="nft-form">Redeem</Button>
        )} */}
      </AlertDialogContent>
    </AlertDialog>
    
  )
}