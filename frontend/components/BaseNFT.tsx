'use client'

import { useState, useEffect } from "react" // useState ci servirà per memorizzare l'immagine dell'NFT. useEffect è un hook per gestire gli "effetti collaterali" di una qualche situazione
// import { useWeb3Contract, useMoralis } from "react-moralis"
// import { nftAbi, marketplaceAbi, marketplaceAddresses } from "@/constants"
import Image from "next/image" // Import necessario per renderizzare un'immagine a partire dall'URI
// import { NFTCard, Card, useNotification } from "web3uikit" // Import per creare delle card cliccabili per ogni NFT (interfaccia e formattazione)

import Link from "next/link";

// import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
// import { styled } from '@mui/system';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { BrowserProvider, Contract, Eip1193Provider, ethers, formatUnits } from 'ethers'

// import ERC6956Full from "../contractsData/ERC6956Full.json";
import NFTMarketplace_address from "../contractsData/NFTMarketplace_address.json";
import ERC6956Full_address from "../contractsData/ERC6956Full_address.json";
import NFTMarketplace from "../contractsData/NFTMarketplace.json";
import { ERC6956Full__factory } from '@/typechain/factories/contracts/ERC6956Full__factory';
import { ERC6956Full } from '@/typechain/contracts/ERC6956Full';
import { NFTMarketplace as NFTM } from '@/typechain/contracts/NFTMarketplace';



import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AspectRatio } from "./ui/aspect-ratio";
import TagList from "./TagList";
import { Attestation, NFT, Tag } from "@/types";
import TokenHistory from "./NFTHistory";
import { buildQueryFromSelectionSet } from "@apollo/client/utilities";
import { CreateDialog } from "./CreateDialog";
import { DialogBuy } from "./BuyDialog";
import { ethToWei, weiToEth } from "@/utils/utils";
import { DialogList } from "./ListDialog";
import { DialogCancelList } from "./CancelListDialog";
import { AlertDialogRedeem } from "./AlertDialogRedeem";
import { buyNFT, cancelListNFT, listNFT, redeemNFT } from "@/utils/contracts";
import { useWallet } from "@/context/WalletContext";
import { useToast } from "@/components/ui/use-toast";



type NFTProps = {
    nft: NFT;
}



export default function BaseNFTBox({ nft }: NFTProps) {

    const { chainId, isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()
    const { address } = useWallet();

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [transactionCompleted, setTransactionCompleted] = useState<boolean>(true);
    // const [attestation, setAttestation] = useState<Attestation | undefined>(undefined);

    const { toast } = useToast();

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

    console.log(address);

    useEffect(() => {
        console.log("Address:", address);
    }, [address]);


    const handleBuyNFT = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setTransactionCompleted(false);
        console.log("pre timeout");
        await buyNFT(toast, nft, isConnected, address, walletProvider);
        console.log("post timeout");
        setTransactionCompleted(true);
        resetState();
        closeDialog();
    };

    const handleListNFT = async (listingPrice: number) => {
        setTransactionCompleted(false);
        console.log("pre timeout");
        await listNFT(toast, nft, listingPrice, isConnected, address, walletProvider);
        console.log("post timeout");
        setTransactionCompleted(true);
        resetState();
        closeDialog();
    };

    const handleCancelListNFT = async () => {
        setTransactionCompleted(false);
        console.log("pre timeout");
        await cancelListNFT(toast, nft, isConnected, address, walletProvider);
        console.log("post timeout");
        setTransactionCompleted(true);
        resetState();
        closeDialog();
    };

    const handleRedeemNFT = async (attestation: Attestation) => {
        setTransactionCompleted(false);
        console.log("pre timeout");
        await redeemNFT(toast, nft, attestation, isConnected, address, walletProvider);
        console.log("post timeout");
        setTransactionCompleted(true);
        resetState();
        closeDialog();
    };

    // const handleOnScanSuccess = (attestation: Attestation) => {
    //     setAttestation(attestation);
    // }
    
    // if (!address) {
    //     return <div>Loading...</div>;
    // }
    const ownerAddress = address ? address.toLowerCase() : "";

    // FORSE QUI BISOGNERà FARE LO STESSO LAVORO FATTO IN NFTInfo
    return (
        <div className="w-full p-4">
            <Card className="w-full">
                <Link href={`/nfts/${nft.id}`} key={`${nft.id}`} >
                <CardHeader>
                    <CardTitle>{nft.metadata.title}</CardTitle>
                    <CardDescription>{nft.metadata.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full">
                        <div className="w-full">
                            <AspectRatio ratio={1 / 1}>
                                <Image src={nft.metadata.imageURI} alt="Selected preview" fill className="rounded-md object-contain w-full h-full" /> 
                            </AspectRatio>
                        </div>
                        <div className="w-full pt-2">
                            <TagList tags={nft.metadata.tags} readonly={true}></TagList>
                        </div>
                    </div>
                </CardContent>
                </Link>
                {nft.isListed ? (
                    ownerAddress ? (
                        nft.owner.id !== ownerAddress ? (
                        <CardFooter className="flex justify-between">
                            <DialogBuy handleOnClick={handleBuyNFT} isOpen={isOpen} openDialog={openDialog} setIsOpen={setOpen} closeDialog={closeDialog} isLoading={!transactionCompleted} disabled={false} price={weiToEth(nft.listingPrice)} />
                        </CardFooter>
                    ) : (
                        <CardFooter className="flex justify-between">
                            <DialogCancelList isOpen={isOpen} openDialog={openDialog} setIsOpen={setOpen} closeDialog={closeDialog} isLoading={!transactionCompleted} handleOnClick={handleCancelListNFT} />
                        </CardFooter>
                    )) : (
                        <div></div>
                    )
                ) : (
                    nft.owner.id === ownerAddress ? (
                        nft.toRedeem ? (
                            <CardFooter className="flex justify-between">
                                <AlertDialogRedeem isOpen={isOpen} openDialog={openDialog} setIsOpen={setOpen} closeDialog={closeDialog} isLoading={!transactionCompleted} handleRedeemNFT={handleRedeemNFT} />
                            </CardFooter>
                        ) : (
                            <CardFooter className="flex justify-between">
                                <DialogList isOpen={isOpen} openDialog={openDialog} setIsOpen={setOpen} closeDialog={closeDialog} isLoading={!transactionCompleted} handleOnClick={handleListNFT} />
                            </CardFooter>
                        )
                    ) : <div></div>
                )}
            </Card>
        </div>
    )
}
