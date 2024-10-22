"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { TagFilter } from "@/components/TagFilter";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AspectRatio } from "@/components/ui/aspect-ratio";

import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { Eip1193Provider, ethers } from 'ethers'
import ERC6956Full_address from "../contractsData/ERC6956Full_address.json";
import ERC6956Full from "../contractsData/ERC6956Full.json";
import { ERC6956Full as IERC6956Full } from "../typechain";
import { Attestation, Metadata, zod_TAGS } from "@/types/index";
import { AlertDialogRedeem } from "./AlertDialogRedeem";

import { useToast } from "@/components/ui/use-toast"
import TagListWithContext from "@/components/TagListWithContext";
import { useFilters } from "@/context/FilterContext";

import { CreateDialog } from "./CreateDialog";
import { AttestationShower } from "./AttestationShower";



// Custom validation function to ensure file is defined
const fileValidation = (file: File | null) => {
    return file !== undefined && file instanceof File;
};
// Define a type that can be either a File or undefined
type FileOrUndefined = File | undefined;

const TagSchema = z.enum(zod_TAGS);

const AnchorSchema = z.object({
    anchor: z.string().min(1, "anchor cannot be empty"),
});

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    image: z
        .any() // Allows any input initially
        .refine((file) => file instanceof File, {
            message: "Invalid file type. Please upload a valid image.",
        })
        .refine(fileValidation, {
            message: "Image is required and must meet specific criteria.",
        }),
    tags: z.array(TagSchema).min(1, {
        message: "At least one tag must be selected.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    attestation: AnchorSchema.required(),
})


// FUNZIONE DA CHIAMARE APPENA LA TRANSAZIONE è COMPLETATA POSITIVAMENTE
const uploadImageToIPFS = async (image: File) => {    
    try {
        const formData = new FormData();
        formData.append('image', image, image.name);
        const response = await fetch('/api/image', {
            method: 'POST',
            body: formData,
        });
    
        const result = await response.json();

        return result;
    }
    catch (error) {
        console.error('Error sending data:', error);
        return error;
    }
};

// FUNZIONE DA CHIAMARE APPENA LA TRANSAZIONE è COMPLETATA POSITIVAMENTE, DOPO LA PRECEDENTE SULL'IMMAGINE
const uploadMetadataToIPFS = async (data: Metadata) => {    
    try {
        const response = await fetch('/api/metadata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        const result = await response.json();

        return result;
    }
    catch (error) {
        console.error('Error sending data:', error);
        return error;
    }
};

const predeterminingImageCID = async (image: Blob) => { 
    try {
        const formData = new FormData();
        formData.append('image', image);

        const response = await fetch('/api/predeterminingCID', {
          method: 'POST',
          body: formData,
        });
    
        const result = await response.json();

        return result;
    }
    catch (error) {
        console.error('Error sending data:', error);
        return error;
    }
};
const predeterminingMetadataCID = async (metadata: Metadata) => { 
    try {
        const response = await fetch('/api/predeterminingCID', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metadata),
        });
    
        const result = await response.json();

        return result;
    }
    catch (error) {
        console.error('Error sending data:', error);
        return error;
    }
};

const signAttestationAPI = async (data: {attestation: Attestation}) => { 
    try {
        const response = await fetch('/api/signAttestation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        const result = await response.json();

        return result;
    }
    catch (error) {
        console.error('Error sending data:', error);
        return error;
    }
};

const deleteImageAPI = async (data: {cid: string}) => { 
    try {
        const formData = new FormData();
        formData.append('cid', data.cid);
        const response = await fetch('/api/image', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data.cid),
        });
    
        const result = await response.json();

        return await response.json();
    }
    catch (error) {
        console.error('Error sending data:', error);
        return error;
    }
};

const merkleTreeAPI = async (data: {anchor: string}) => { 
    try {
        const apiUrl = '/api/merkleTree?anchor=' + data.anchor;
        const response = await fetch(apiUrl, {
          method: 'GET',
        });
    
        const result = await response.json();

        return result;
    }
    catch (error) {
        console.error('Error sending data:', error);
        return error;
    }
};


async function createToken(toast: (arg0: { title: string; description: string; }) => void, formValues: { title: string; image: File; attestation: { anchor: string; }; tags: ("Tag 1" | "Tag 2" | "Tag 3" | "Tag 4")[]; description: string; }, isConnected: boolean, address: string | undefined, walletProvider: Eip1193Provider | undefined) {
    try {
        if (!isConnected) throw new Error('User disconnected');
        
        // Set up the ethers provider
        const ethersProvider = new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider);
        
        // Get the signer from the provider
        const signer = await ethersProvider.getSigner();
        
        // The Contract object
        const ercContract1 = new ethers.Contract(ERC6956Full_address.address, ERC6956Full.abi);
        
        const ercContract: IERC6956Full = new ethers.Contract(ERC6956Full_address.address, ERC6956Full.abi, signer) as unknown as IERC6956Full;


        // Check if the address is valid
        if (!ethers.isAddress(await signer.getAddress())) {
            throw new Error('Invalid address');
        }

        const ercContractWithSigner = ercContract.connect(signer);
        
        
        const to = await signer.getAddress()
        const attestation: Attestation = {
            to: to,
            anchor: formValues.attestation.anchor
        }

        const responseSA = await signAttestationAPI({attestation})
        const signedAttestation = responseSA.response;

        const responseMF = await merkleTreeAPI({anchor: attestation.anchor})
        const data = responseMF.response;

        

        const imageUploaded2 = await uploadImageToIPFS(formValues.image);
        

        const BASE_URI: string = process.env.NEXT_PUBLIC_GATEWAY_URL__BASE_URI || "";
        const imageURI = BASE_URI + imageUploaded2.response.IpfsHash;
        
        /// QUI TOCCHERà PASSARE IL JSON DEL METADATA, QUINDI ANCHE CON L'URI DELL'IMMAGINE
        const metadata: Metadata = {
            title: formValues.title,
            description: formValues.description,
            imageURI: imageURI,
            tags: formValues.tags,
        };
        const metadataUploaded = await uploadMetadataToIPFS(metadata);
        const metadataCID: string = metadataUploaded.response.IpfsHash;
        

        let receipt_mint: ethers.ContractTransactionReceipt | null = null;
        const tx_mint = await ercContract['createAnchor(bytes,string,bytes)'](signedAttestation, metadataCID, data)
        receipt_mint = await tx_mint.wait();

        const result = receipt_mint as ethers.ContractTransactionReceipt;


        // setTransactionResult(result);
        // setTransactionCompleted(result.status);

        if (result.status) {
            toast({
                title: "Successfull!.",
                description: "All good.",
            })
        }
        else {
            toast({
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            })
        }

        return receipt_mint;
    } 
    catch (error) {
        console.error('Error:', error);
        return null;
    }
}


export default function NFTForm() {
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    const [transactionResult, setTransactionResult] = useState<ethers.ContractTransactionReceipt | null>(null);
    const [transactionCompleted, setTransactionCompleted] = useState<boolean>(true);

    const { toast } = useToast();
    const { tags, setTags } = useFilters();

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isOpenAttestation, setIsOpenAttestation] = useState<boolean>(false)

    const openDialog = () => {
        if (transactionCompleted) {
            setIsOpen(true)
        }
    }
    const closeDialog = () => {
        if (transactionCompleted) {
            setIsOpen(false)
        }
    }
    const setOpen = (isOpen: boolean) => {
        if (transactionCompleted) {
            setIsOpen(isOpen)
        }
    }
    const resetState = () => {
        setIsOpen(false);
        setTransactionCompleted(true);
    }
    const openDialogAttestation = () => {
        if (transactionCompleted) {
            setIsOpenAttestation(true)
        }
    }
    const closeDialogAttestation = () => {
        if (transactionCompleted) {
            setIsOpenAttestation(false)
        }
    }
    const setOpenAttestation = (isOpen: boolean) => {
        if (transactionCompleted) {
            setIsOpenAttestation(isOpen)
        }
    }

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            image: undefined,
            tags: [],
            description: "",
            attestation: undefined,
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setTransactionCompleted(false);

        const result = await createToken(toast, values, isConnected, address, walletProvider);

        setTransactionResult(result);
        setTransactionCompleted(true);
        resetState();
        closeDialog();
    }

    const onError = (errors: any) => {
        closeDialog();
    };


    useEffect(() => {
        form.setValue("tags", tags);
    }, [tags]);

    

    // React.SyntheticEvent<HTMLDivElement, Event>
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = event?.target?.files?.[0];

        if (file) {
            form.setValue("image", file); // Update form's image field with URL
        }
        else {
            form.resetField("image");
        }
    };

    const handleOnScanSuccess = (attestation: Attestation) => {
        if (attestation !== undefined) {
            form.setValue("attestation", attestation);
        }
    }

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleFormReset = () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Clear the file input
        }
    };
    const handleReset = () => {
        setTags([]);
        form.reset(); // This will reset all fields managed by react-hook-form
        handleFormReset();
    };

    return (
        <div className="flex items-center justify-center pt-4 pb-4 pl-2 pr-2">
            <Card className="w-full sm:w-1/2">
                <CardHeader>
                    <CardTitle>NFT creation</CardTitle>
                    <CardDescription>Mint your new NFT.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form id="nft-form" onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the name of your NFT
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Upload Image</FormLabel>
                                        <FormControl>
                                            <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
                                        </FormControl>
                                        <FormDescription>
                                            Select an image for your NFT.
                                        </FormDescription>
                                        <FormMessage />
                                        {field.value && (
                                            <div className="w-full mt-2">
                                                <p>Selected Image Preview:</p>
                                                <AspectRatio ratio={1 / 1}>
                                                    <Image src={URL.createObjectURL(field.value)} alt="Selected preview" fill className="rounded-md object-contain w-full h-full" /> 
                                                </AspectRatio>
                                            </div>
                                        )}
                                    </FormItem>
                                )}
                            />    
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl>
                                            <div>
                                                <div className="flex m-4">
                                                    <TagFilter />
                                                </div>
                                                <div>
                                                    {field.value && <TagListWithContext></TagListWithContext>}
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Select tags for your NFT
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Description" className="resize-none" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Describe your NFT in detail.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="attestation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Attestation</FormLabel>
                                        <FormControl>
                                            <div>
                                                {field.value &&
                                                    <AttestationShower attestation={field.value} />
                                                }
                                                <AlertDialogRedeem isOpen={isOpenAttestation} openDialog={openDialogAttestation} setIsOpen={setOpenAttestation} closeDialog={closeDialogAttestation} isLoading={!transactionCompleted} handleOnScanSuccess={handleOnScanSuccess} />
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Attestation for the creation of the NFT.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="button" onClick={handleReset} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mt-4">
                        Reset
                    </Button>
                    <CreateDialog isOpen={isOpen} openDialog={openDialog} setIsOpen={setOpen} closeDialog={closeDialog} isLoading={!transactionCompleted} />
                </CardFooter>
            </Card>
        </div>
    )
}
