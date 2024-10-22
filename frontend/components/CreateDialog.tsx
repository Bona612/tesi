"use client";


import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
  

type CreateDialogProps = {
    isOpen: boolean;
    openDialog: () => void;
    setIsOpen: (isOpen: boolean) => void;
    closeDialog: () => void;
    isLoading: boolean,
}

  
export function CreateDialog({isOpen, openDialog, setIsOpen, closeDialog, isLoading}: CreateDialogProps) {
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold py-2 px-4 rounded mt-4" onClick={openDialog}>Create NFT</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create NFT</DialogTitle>
          <DialogDescription>
            Are you sure you want to create this NFT?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary" onClick={closeDialog} disabled={isLoading}>
                    Cancel
                </Button>
            </DialogClose>
            <Button type="submit" form="nft-form" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Create"
              )}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}