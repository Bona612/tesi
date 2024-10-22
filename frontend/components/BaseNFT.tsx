'use client'

import { useState, useEffect } from "react" // useState ci servirà per memorizzare l'immagine dell'NFT. useEffect è un hook per gestire gli "effetti collaterali" di una qualche situazione

import Image from "next/image" // Import necessario per renderizzare un'immagine a partire dall'URI

import Link from "next/link";

import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'



import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AspectRatio } from "./ui/aspect-ratio";
import TagList from "./TagList";
import { Attestation, NFT } from "@/types";
import { DialogBuy } from "./BuyDialog";
import { weiToEth } from "@/utils/utils";
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

    const { toast } = useToast();

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);


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


    useEffect(() => {
    }, [address]);


    const handleBuyNFT = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setTransactionCompleted(false);
        await buyNFT(toast, nft, isConnected, address, walletProvider);
        setTransactionCompleted(true);
        resetState();
        closeDialog();
    };

    const handleListNFT = async (listingPrice: number) => {
        setTransactionCompleted(false);
        await listNFT(toast, nft, listingPrice, isConnected, address, walletProvider);
        setTransactionCompleted(true);
        resetState();
        closeDialog();
    };

    const handleCancelListNFT = async () => {
        setTransactionCompleted(false);
        await cancelListNFT(toast, nft, isConnected, address, walletProvider);
        setTransactionCompleted(true);
        resetState();
        closeDialog();
    };

    const handleRedeemNFT = async (attestation: Attestation) => {
        setTransactionCompleted(false);
        await redeemNFT(toast, nft, attestation, isConnected, address, walletProvider);
        setTransactionCompleted(true);
        resetState();
        closeDialog();
    };

    const ownerAddress = address ? address.toLowerCase() : "";

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
                {isClient && typeof window !== 'undefined' && (
                    ownerAddress ? (
                        nft.isListed ? (
                            nft.owner.id !== ownerAddress ? (
                                <CardFooter className="flex justify-between">
                                    <DialogBuy handleOnClick={handleBuyNFT} isOpen={isOpen} openDialog={openDialog} setIsOpen={setOpen} closeDialog={closeDialog} isLoading={!transactionCompleted} disabled={false} price={weiToEth(nft.listingPrice)} />
                                </CardFooter>
                            ) : (
                                <CardFooter className="flex justify-between">
                                    <DialogCancelList isOpen={isOpen} openDialog={openDialog} setIsOpen={setOpen} closeDialog={closeDialog} isLoading={!transactionCompleted} handleOnClick={handleCancelListNFT} />
                                </CardFooter>
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
                            ) : (
                                <div></div>
                            )
                        )
                    ) : (
                        <div></div>
                    )
                )}
            </Card>
        </div>
    )
}
