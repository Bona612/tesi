"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react";
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
import Redeem from "./Redeem";

import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { BrowserProvider, Contract, Eip1193Provider, ethers, formatUnits } from 'ethers'
import ERC6956Full_address from "../contractsData/ERC6956Full_address.json";
import ERC6956Full from "../contractsData/ERC6956Full.json";
import { ERC6956Full as IERC6956Full } from "../typechain";
import { ERC6956Full__factory } from '@/typechain/factories/contracts/ERC6956Full__factory';
// import { ERC6956Full } from '@/typechain/contracts/ERC6956Full';
import { ecsign, toRpcSig, fromRpcSig } from 'ethereumjs-util';
import { createMerkleTree, generateMerkleProof, getMerkleTreeRoot } from "../../backend/utils/merkleTreeUtilities";
import { Tag, Attestation, Metadata, TAGS, zod_TAGS } from "@/types/index";
import { AlertDialogForm } from "./AlertDialogForm";

import { useToast } from "@/components/ui/use-toast"
import TagListWithContext from "@/components/TagListWithContext";
import { useFilters } from "@/context/FilterContext";
import { Tags } from "lucide-react";

import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import { sha256 } from 'multiformats/hashes/sha2'

import { unixfs } from "@helia/unixfs"
import { BlackHoleBlockstore } from "blockstore-core/black-hole"
import { fixedSize } from "ipfs-unixfs-importer/chunker"
import { balanced } from "ipfs-unixfs-importer/layout"



// Custom validation function to ensure file is defined
const fileValidation = (file: File | null) => {
    return file !== undefined && file instanceof File;
};
// Define a type that can be either a File or undefined
type FileOrUndefined = File | undefined;

const TagSchema = z.enum(zod_TAGS);
const formSchema = z.object({
    title: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    // imageURL: z.string().min(1, {
    //     message: "Please select an image file.",
    // }),
    // image: z.instanceof(File).optional().refine(fileValidation, {
    //     message: "Please upload a valid image file.",
    // }),
    image: z.instanceof(File)
        .refine(fileValidation, {
        message: "Image is required.",
    }),
    tags: z.array(TagSchema).min(1, {
        message: "At least one tag must be selected.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    
    // attestation: AttestationSchema.required(),
})

// // extract the inferred type like this
// type Dog = z.infer<typeof Dog>;

// FUNZIONE DA CHIAMARE APPENA LA TRANSAZIONE è COMPLETATA POSITIVAMENTE
const uploadImageToIPFS = async (image: File) => {    
    console.log(image);
    try {
        const formData = new FormData();
        formData.append('image', image, image.name);
        console.log("image pre api call: ", image);
        const response = await fetch('/api/image', {
            method: 'POST',
            body: formData,
        });
    
        const result = await response.json();
        console.log('Response from API:', result);

        return result;
    }
    catch (error) {
        console.error('Error sending data:', error);
        return error;
    }
};

// FUNZIONE DA CHIAMARE APPENA LA TRANSAZIONE è COMPLETATA POSITIVAMENTE, DOPO LA PRECEDENTE SULL'IMMAGINE
const uploadMetadataToIPFS = async (data: Metadata) => {    
    console.log(data);
    try {
        const response = await fetch('/api/metadata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        const result = await response.json();
        console.log('Response from API:', result);

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
        console.log('Response from API:', result);

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
        console.log('Response from API:', result);

        return result;
    }
    catch (error) {
        console.error('Error sending data:', error);
        return error;
    }
};

const signAttestationAPI = async (data: {attestation: Attestation, signer: ethers.JsonRpcSigner}) => { 
    console.log(data);
    try {
        const response = await fetch('/api/signAttestation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        const result = await response.json();
        console.log('Response from API:', result);

        return result;
    }
    catch (error) {
        console.error('Error sending data:', error);
        return error;
    }
};

const deleteImageAPI = async (data: {cid: string}) => { 
    console.log(data);
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
        console.log('Response from API:', result);

        return await response.json();
    }
    catch (error) {
        console.error('Error sending data:', error);
        return error;
    }
};

const merkleTreeAPI = async (data: {anchor: string}) => { 
    console.log(data);
    try {
        const apiUrl = '/api/merkleTree?anchor=' + data.anchor;
        const response = await fetch(apiUrl, {
          method: 'GET',
        });
    
        const result = await response.json();
        console.log('Response from API:', result);

        return result;
    }
    catch (error) {
        console.error('Error sending data:', error);
        return error;
    }

// fetch(apiUrl)
//   .then(response => response.json())
//   .then(data => {
//     console.log('Merkle Tree:', data);
//   })
//   .catch(error => {
//     console.error('Error fetching Merkle Tree:', error);
//   });
};

async function pre(metadata2, formValues){
    try {
        // const text = JSON.stringify(metadata2);
        // const blob = new Blob([text], { type: "text/plain" });
        // const unit8array = new Uint8Array(await blob.arrayBuffer());
        // console.log(unit8array)

        // const bytes = raw.encode(unit8array)
        // console.log(bytes)

        // const hash = await sha256.digest(bytes)
        // console.log(hash)

        // const cid = CID.create(1, raw.code, hash)
        // console.log(cid.toString())
        const file = formValues.image as File;

        const form = new FormData();
        form.append('file', file);
        const pinataOptions = JSON.stringify({
            cidVersion: 1,
        });
        form.append("pinataOptions", pinataOptions);
        const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
              Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0ZmZkYTliYy01MzEyLTQxZDktOTQ3ZC00NDA0NmJhMTYyMzgiLCJlbWFpbCI6Im1hdHRlby5ib2NjYWxpLjA2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIwODY3ODJhZDgzNGY5ZjM5YjZiMCIsInNjb3BlZEtleVNlY3JldCI6IjNkNjE3ZDFmZDFhZGY1MWQzOGQ3YmExODUwYmRmMTdmM2RkNTFlY2NlZTVmNDJkNGVlOTNlMmEyNWRiYTAwZDkiLCJpYXQiOjE3MTcyNTE0OTh9.Dg4e6Dgd64H9lqg3jcmbflZhm_BuLdkGSswmJd5pjf8"
            },
            body: form,
        });
    
        const resData = await res.json();
        console.log(resData);

        const fileBlob = new Blob([file], { type: file.type });
        const unit8array2 = new Uint8Array(await fileBlob.arrayBuffer());
        console.log(unit8array2)

        const bytes2 = raw.encode(unit8array2)
        console.log(bytes2)

        const hash2 = await sha256.digest(bytes2)
        console.log(hash2)

        const cid2 = CID.create(1, raw.code, hash2)
        console.log(cid2.toString())
    } 
    catch(error) {
        console.log(error)
    }
}

async function pre2(bytes: Uint8Array) {
    const metadata: Metadata = {
        title: "titolo",
        description: "descrizione",
        imageURI: "https://gold-magnificent-stork-310.mypinata.cloud/ipfs/bafybeidh6bhadr4csigx4tbafgslniuarvxas734oqsefaywdwn32vffp4",
        tags: ["Tag 1"],
    };
    const textEncoder = new TextEncoder()
    const jsonString = JSON.stringify(metadata)
    const blob = new Blob([jsonString], { type: "text/plain" });
    const uint8Array = textEncoder.encode(jsonString)
    // const uint8Array = new Uint8Array(await blob.arrayBuffer());

    const unixFs = unixfs({
        blockstore: new BlackHoleBlockstore(),
    })
    
    const cid = await unixFs.addBytes(bytes, {
        cidVersion: 1,
        rawLeaves: false,
        leafType: "raw",
        layout: balanced({
            maxChildrenPerNode: 174,
        }),
        chunker: fixedSize({
            chunkSize: 262144,
        }),
    })
    
    console.log(cid.toString());
    // const cidv0 = cid.toV0().toString()
    const cidv1 = cid.toV1();
    console.log(cidv1);
    console.log(cidv1.toString());
}

/// DA RIVEDERE E MIGLIORARE
async function createToken(toast, formValues: { title: string; image: File; tags: Tag[]; description: string; }, attestation: Attestation, isConnected: boolean, address: string | undefined, walletProvider: Eip1193Provider | undefined) {
    console.log("isConnected: ", isConnected)
    console.log("address: ", address)

    try {
        // const [owner, maintainer, oracle, alice, bob, mallory, hacker, carl, gasProvider ] = await ethers.getSigners();
        // const oracle = "";
        // Ensure the user is connected
        if (!isConnected) throw new Error('User disconnected');
        
        // Set up the ethers provider
        const ethersProvider = new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider);
        console.log("provider");
        console.log(ethersProvider);

        // // Get the block number
        // const blockNumber = await ethersProvider.getBlockNumber();
        // console.log("Latest block number:", blockNumber);
        
        // Get the signer from the provider
        const signer = await ethersProvider.getSigner();
        console.log("signer");
        console.log(signer);

        // // Get the current nonce (transaction count)
        // const currentNonce = await ethersProvider.getTransactionCount(await signer.getAddress());
        // console.log("Latest transaction:", currentNonce);
        
        // The Contract object
        const ercContract1 = new ethers.Contract(ERC6956Full_address.address, ERC6956Full.abi);
        
        const ercContract: IERC6956Full = new ethers.Contract(ERC6956Full_address.address, ERC6956Full.abi, signer) as unknown as IERC6956Full;
        // Use the factory to create the contract instance
        // const ercContract: ERC6956Full = ERC6956Full__factory.connect(ERC6956Full_address.address, signer);
        console.log("ercContract");
        console.log(ercContract);

        // Check if the address is valid
        if (!ethers.isAddress(await signer.getAddress())) {
            throw new Error('Invalid address');
        }

        const ercContractWithSigner = ercContract.connect(signer);
        const nonce = 2
        // Prepare your transaction parameters
        const txParams = {
            maxFeePerGas: 703230725 * 2
            // other parameters as needed
        };

        console.log("control okay")
        // const oracleAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
        // // const ethAmount = "0.1"; // Amount of ETH to send
        // // const valueInWei = ethers.parseEther(ethAmount);
        // const tx_m = await ercContractWithSigner.updateMaintainer(signer.address, true, txParams); // { nonce: nonce }
        // const receipt_m = await tx_m.wait();
        // console.log('Transaction confirmed:', receipt_m);
        // console.log("mantainer updated")

        // const tx_o = await ercContractWithSigner.updateOracle(oracleAddress, true, txParams);
        // const receipt_o = await tx_o.wait();
        // console.log('Transaction confirmed:', receipt_o);
        // console.log("oracle updated")
        
        
        const to = await signer.getAddress()
        attestation.to = to
        // '0x' + createHash('sha256').update('TestAnchor123').digest('hex')
        const attestationTime = Math.floor(Date.now() / 1000.0); // Now in seconds UTC
        attestation.attestationTime = attestationTime
        const validStartTime = 0;
        attestation.validStartTime = validStartTime
        const validEndTime = attestationTime + validStartTime + 15 * 60; // 15 minutes valid from attestation
        attestation.validEndTime = validEndTime


        console.log("pre signing")
        // const oraclePrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
        // const attestationWrapper = jsonToAttestationWrapper(jsonCompatibleObject);
        const responseSA = await signAttestationAPI({attestation, signer})
        console.log("response: ", responseSA)
        const signedAttestation = responseSA.response;

        const responseMF = await merkleTreeAPI({anchor: attestation.anchor})
        console.log("response: ", responseMF)
        const data = responseMF.response;

        // const signedAttestation = await signAttestation(attestation, oraclePrivateKey, signer, dummyAnchor);
        // const data = ethers.AbiCoder.defaultAbiCoder().encode(
        //     ['bytes32[]'],
        //     [proof]);
        console.log(signedAttestation);

        // console.log("dummyAnchor", dummyAnchor);
        // const tx_a = await ercContractWithSigner.updateValidAnchors(merkleRoot, txParams);
        // const receipt_a = await tx_a.wait();
        // console.log('Transaction confirmed:', receipt_a);
        // console.log("validAnchor updated")
        


        // const metadata2: Metadata = {
        //     title: formValues.title,
        //     description: formValues.description,
        //     imageURI: "",
        //     tags: formValues.tags,
        // };
        
        // pre(metadata2, formValues);

        const imageUploaded2 = await uploadImageToIPFS(formValues.image);
        console.log("imageUploaded2 ", imageUploaded2.response.IpfsHash);
        console.log(formValues.image);
        // const metadataUploaded2 = await uploadMetadataToIPFS(metadata2);
        // console.log("metadataUploaded2 " + metadataUploaded2);
        

        /// QUI TOCCHERà PASSARE L'IMMAGINE
        const responseImageCID = await predeterminingImageCID(formValues.image);
        console.log("image CID: ", responseImageCID.cid)
        const BASE_URI: string = process.env.NEXT_PUBLIC_GATEWAY_URL__BASE_URI || "https://";
        // const imageURI = BASE_URI + responseImageCID.cid;
        const imageURI = BASE_URI + imageUploaded2.response.IpfsHash;
        /// QUI TOCCHERà PASSARE IL JSON DEL METADATA, QUINDI ANCHE CON L'URI DELL'IMMAGINE
        const metadata: Metadata = {
            title: formValues.title,
            description: formValues.description,
            imageURI: imageURI,
            tags: formValues.tags,
        };
        const responseMetadataCID = await predeterminingMetadataCID(metadata);
        console.log("metadata CID: ", responseMetadataCID)
        const metadataCID: string = responseImageCID.cid;
        // const metadataUploaded3 = await uploadMetadataToIPFS(metadata);
        // console.log("metadataUploaded3 " + metadataUploaded3);
        

        // QUI DA CAMBIARE LA FUNZIONE DOPO AVERLA TESTATA, NON SARà PIù transferanchor MA createAnchor
        let receipt_mint: ethers.ContractTransactionReceipt | null = null;
        // const NULLADDR = ethers.ZeroAddress;
        // if (data == null) {
        //     console.log("senza data")
        //     QUI createAnchor
        //     const tx_mint = await ercContract['createAnchor(bytes,string)'](signedAttestation, metadataCID, txParams)
        //     receipt_mint = await tx_mint.wait();
        //     console.log('Transaction receipt:', receipt_mint);
        // }
        // else {
        console.log("con data")
        // QUI createAnchor
        const tx_mint = await ercContract['createAnchor(bytes,string,bytes)'](signedAttestation, metadataCID, data, txParams)
        receipt_mint = await tx_mint.wait();
        console.log('Transaction receipt:', receipt_mint);

        const result = receipt_mint as ethers.ContractTransactionReceipt;

        
        // DA CAPIRE LA GUARDIA DELL'if
        if (result.status) {
            /// QUESTA PARTE ANDRà CHIAMATA SOLO QUANDO LA createAnchor SARà ANDATA A BUON FINE
            const imageUploaded = await uploadImageToIPFS(formValues.image);
            console.log("imageUploaded " + imageUploaded);
            const metadataUploaded = await uploadMetadataToIPFS(metadata);
            console.log("metadataUploaded " + metadataUploaded);
        }
        else {
            const imageDeleted = await deleteImageAPI({cid: imageUploaded2.response.IpfsHash});
            console.log("imageDeleted " + imageDeleted);
        }


        // setTransactionResult(result);
        // setTransactionCompleted(result.status);

        if (result.status) {
            const imageUploaded = await uploadImageToIPFS(formValues.image);
            console.log("imageUploaded " + imageUploaded);
            const metadataUploaded = await uploadMetadataToIPFS(metadata);
            console.log("metadataUploaded " + metadataUploaded);

            toast({
                title: "Successfull!.",
                description: "All good.",
            })

            console.log("mostrato");
        }
        else {
            const imageDeleted = await deleteImageAPI({cid: imageUploaded2.response.IpfsHash});
            console.log("imageDeleted " + imageDeleted);

            toast({
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            })
            console.log("mostrato");

        }

        return receipt_mint;
        // await expect(ercContract.connect(signer)["transferAnchor(bytes)"](att))
        // .to.emit(ercContract, "Transfer") // Standard ERC721 event
        // .withArgs(NULLADDR, signer.getAddress, 1);

        // setCIDbyToken(uint256 tokenId, string memory cid)
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
    const [transactionCompleted, setTransactionCompleted] = useState<boolean>(false);

    const { toast } = useToast();
    const { tags, setTags } = useFilters();


    // const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

    // const { register, handleSubmit, watch, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    //     resolver: zodResolver(formSchema),
    //     defaultValues: {
    //         title: "",
    //         imageURL: "",
    //         tags: [],
    //         description: "",
    //         // attestation: undefined,
    //     },
    // })
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            image: undefined,
            tags: [],
            description: "",
            // attestation: undefined,
        },
    })
    
    // vedere se usare questo
    // useEffect(() => {
    //     async function onTransactionCompleted(image, metadata, deleteCid) {
    //         if (transactionCompleted) {
    //             if (transactionResult) {
    //                 const imageUploaded = await uploadImageToIPFS(image);
    //                 console.log("imageUploaded " + imageUploaded);
    //                 const metadataUploaded = await uploadMetadataToIPFS(metadata);
    //                 console.log("metadataUploaded " + metadataUploaded);

    //                 toast({
    //                     title: "Successfull!.",
    //                     description: "All good.",
    //                 })
    //             }
    //             else {
    //                 const imageDeleted = await deleteImageAPI({cid: deleteCid});
    //                 console.log("imageDeleted " + imageDeleted);

    //                 toast({
    //                     title: "Uh oh! Something went wrong.",
    //                     description: "There was a problem with your request.",
    //                 })
    //             }
    //         }
    //         else {
    //             toast({
    //                 title: "Transaction in execution.",
    //                 description: "Execution.",
    //             })
    //         }
    //     }
        
    //     onTransactionCompleted(image, metadata, deleteCid);
        
    // }, [transactionCompleted])

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setTransactionCompleted(false);
        
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)

        const att: Attestation = {
            to: "",
            anchor: "0x3ab9a2c6e6a7a11cbf3ec33b9a44926f7b85b6f93a599be75dcb2a1b7a9f9f31",
            attestationTime: 0,
            validStartTime: 0,
            validEndTime: 0
        }

        // // DA SISTEMARE QUI, andrà aggiunta probabilmente parte async/await
        // // E DA CAPIRE SE DOVRà ESSERE MESSA LATO SERVER
        // const result = await createToken(toast, values, att, isConnected, address, walletProvider);
        // console.log("result: ", result);

        // setTransactionResult(result)
        // setTransactionCompleted(true)

        uploadImageToIPFS(values.image);
        pre2(new Uint8Array(await values.image.arrayBuffer()));
    }

    // const onError = (errors) => {
    //     console.log("Errors:", errors); // Debugging log
    // };
    

    // const updateTags = (tag: Tag) => {
    //     const newTags = tags.includes(tag)
    //         ? tags.filter((t) => t !== tag)
    //         : [...tags, tag];
        
    //     return newTags;
    // }

    // const handleOnClick = (tag: Tag) => {
    //     console.log("handleOnClick event")
    //     setTags(updateTags(tag));
    //     handleFormOnClick(tag);
    // };

    // // 3. Handle tag removal.
    // function handleFormOnClick(tag: Tag) {
    //     console.log("handleFormOnClick")
    //     const currentTags = form.getValues("tags");
    //     const tagIndex = currentTags.findIndex(t => t === tag);
        
    //     if (tagIndex > -1) {
    //         console.log("TAG presente")
    //         // Remove the tag if it exists
    //         currentTags.splice(tagIndex, 1);
    //     } else {
    //         console.log("TAG non presente")
    //         // Add the tag if it does not exist
    //         currentTags.push(tag);
    //     }

    //     console.log(currentTags)
    //     // Update the form's tags field
    //     form.setValue("tags", [...currentTags]);
    // }


    useEffect(() => {
        form.setValue("tags", tags);
    }, [tags]);

    

    // React.SyntheticEvent<HTMLDivElement, Event>
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event);
        console.log(typeof event);
        
        const file: File | undefined = event?.target?.files?.[0];
        console.log(file);

        if (file) {
            // const imageURL = URL.createObjectURL(file);
            form.setValue("image", file); // Update form's image field with URL
        }
        else {
            form.resetField("image");
        }
    };

    const handleReset = () => {
        setTags([]);
        form.reset(); // This will reset all fields managed by react-hook-form
    };

    return (
        <div className="flex items-center justify-center">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>NFT creation</CardTitle>
                    <CardDescription>Mint your new NFT.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form id="nft-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                            <Input type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
                                        </FormControl>
                                        <FormDescription>
                                            Select an image for your NFT.
                                        </FormDescription>
                                        <FormMessage />
                                        {field.value && (
                                            <div className="w-[450px] mt-2">
                                                <p>Selected Image Preview:</p>
                                                <AspectRatio ratio={1 / 1}>
                                                    <Image src={URL.createObjectURL(field.value)} alt="Selected preview" className="rounded-md object-cover" width={300} height={300} /> 
                                                    {/* <Image src={field.value} alt="Selected preview" className="rounded-md" width={300} height={300} />  */}
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
                                                {/* <div className="flex m-4">
                                                    <TagFilter tagList={field.value as Tag[]} handleOnClick={handleOnClick}/>
                                                </div>
                                                <div>
                                                    {field.value && <TagList tagList={field.value as Tag[]} handleOnClick={handleOnClick}></TagList>}
                                                </div> */}
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
                            {/* <FormField
                                control={form.control}
                                name="attestation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Attestation</FormLabel>
                                        <FormControl>
                                            <Redeem />
                                        </FormControl>
                                        <FormDescription>
                                            Attestation for the creation of the NFT.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="button" onClick={handleReset} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mt-4">
                        Reset
                    </Button>
                    {/* <Button type="submit" form="nft-form" className="font-bold py-2 px-4 rounded mt-4">Submit</Button> */}
                    <AlertDialogForm />
                </CardFooter>
            </Card>
        </div>
    )
}