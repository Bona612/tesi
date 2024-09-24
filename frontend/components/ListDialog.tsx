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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eip1193Provider } from "ethers"
import { NFT } from "@/types"
import { Loader2 } from "lucide-react"


interface DialogBuyProps {
    handleOnClick: (listingPrice: number) => void,
    // PROBABILMENTE QUI NON PASSARE LISTNFT, MA SEMPLICEMENTE CHIAMARE UN'ALTRA FUNZIONE CHE NON FARà ALTRO CHE CHIAMARE LISTNFT
    // listNFT: (nft: NFT, listingPrice: number, isConnected: boolean, address: string | undefined, walletProvider: Eip1193Provider | undefined) => void,
    isOpen: boolean;
    openDialog: () => void;
    setIsOpen: (isOpen: boolean) => void;
    closeDialog: () => void;
    isLoading: boolean,
}


const formSchema = z.object({
  listingPrice: z.any().transform((val) => parseFloat(val)).refine((val) => {
    // console.log("length: ", val.toString().split('.')[1]?.length)
    return val > 0 && Number.isFinite(val) && val.toString().split('.')[1]?.length <= 4;
  }, {
    message: "The number must be a positive float greater than 0 with no more than 4 decimal places.",
  }),
})


export function DialogList({handleOnClick, isLoading, openDialog, setIsOpen, closeDialog , isOpen}: DialogBuyProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        listingPrice: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    // PROBABILMENTE QUI NON PASSARE LISTNFT, MA SEMPLICEMENTE CHIAMARE UN'ALTRA FUNZIONE CHE NON FARà ALTRO CHE CHIAMARE LISTNFT
    handleOnClick(values.listingPrice);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* <Button className="font-bold py-2 px-4 rounded mt-4" variant="outline" disabled={disabled}>List</Button> */}
        <Button className="font-bold py-2 px-4 rounded mt-4" onClick={openDialog}>List NFT</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>List NFT</DialogTitle>
          <DialogDescription>
            Recap of the listing of the NFT
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>NFT Listing</CardTitle>
                    <CardDescription>List your NFT.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form id="nft-listing-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="listingPrice"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Price" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the price of the listing for your NFT
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />                           
                        </form>
                    </Form>
                </CardContent>
            </Card>
          </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary" onClick={closeDialog} disabled={isLoading}>
                    Cancel
                </Button>
            </DialogClose>
            {/* <Button type="submit" form="nft-listing-form" className="font-bold py-2 px-4 rounded mt-4">List</Button> */}
            <Button type="submit" form="nft-listing-form" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "List"
              )}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
