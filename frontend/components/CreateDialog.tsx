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
  

type CreateDialogProps = {
    text: string;
    handleOnClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    disabled?: boolean,
}

  
export function CreateDialog({ text, handleOnClick, disabled = false }: CreateDialogProps) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <Button onClick={handleOnClick} variant="outline" disabled={disabled}>Buy {price} ETH</Button> */}
        <Button onClick={handleOnClick} disabled={disabled}>Create NFT</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create NFT</DialogTitle>
          <DialogDescription>
            Are you sure you want to create this NFT?
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
                <Button type="button" variant="secondary">
                    Cancel
                </Button>
            </DialogClose>
            <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
  // return (
  //   <AlertDialog>
  //     <AlertDialogTrigger asChild>
  //       <Button className="font-bold py-2 px-4 rounded mt-4">{text}</Button>
  //     </AlertDialogTrigger>
  //     <AlertDialogContent>
  //       <AlertDialogHeader>
  //         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
  //         <AlertDialogDescription>
  //           This action cannot be undone. This will permanently delete your
  //           account and remove your data from our servers.
  //         </AlertDialogDescription>
  //       </AlertDialogHeader>
  //       <AlertDialogFooter>
  //         <AlertDialogCancel>Cancel</AlertDialogCancel>
  //         <AlertDialogAction asChild>
  //           <Button onClick={handleOnClick} type="button">Confirm</Button>
  //         </AlertDialogAction>
  //       </AlertDialogFooter>
  //     </AlertDialogContent>
  //   </AlertDialog>
  // )
}