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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"


interface DialogBuyProps {
    handleOnClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    isOpen: boolean;
    openDialog: () => void;
    setIsOpen: (isOpen: boolean) => void;
    closeDialog: () => void;
    isLoading: boolean,
    disabled: boolean,
    price: number
}


export function DialogBuy({handleOnClick, isLoading, openDialog, setIsOpen, closeDialog, isOpen, disabled, price}: DialogBuyProps) {

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* <Button onClick={handleOnClick} variant="outline" disabled={disabled}>Buy {price} ETH</Button> */}
        <Button className="font-bold py-2 px-4 rounded mt-4" onClick={openDialog}>Buy {price} ETH</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy NFT</DialogTitle>
          <DialogDescription>
            Are you sure you want to buy this NFT?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div> */}
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary" onClick={closeDialog} disabled={isLoading}>
                    Cancel
                </Button>
            </DialogClose>
            {/* <Button type="button" onClick={handleOnClick}>Buy</Button> */}
            <Button type="button" onClick={handleOnClick} disabled={isLoading || disabled}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                `Buy ${price} ETH`
              )}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
