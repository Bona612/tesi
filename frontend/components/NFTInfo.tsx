'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import TagList from '@/components/TagList';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AspectRatio } from './ui/aspect-ratio';
import { NFT, NFTtokenVariables, Attestation, token_NFT }from "@/types/index";

import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { QueryRef, useReadQuery } from '@apollo/client';
import NFTHistory from './NFTHistory';

import { weiToEth } from '@/utils/utils';
import { DialogBuy } from './BuyDialog';
import { DialogList } from './ListDialog';
import { DialogCancelList } from './CancelListDialog';
import { buyNFT, cancelListNFT, listNFT, redeemNFT } from '@/utils/contracts';
import { AlertDialogRedeem } from './AlertDialogRedeem';
import { useWallet } from '@/context/WalletContext';
import { useToast } from "@/components/ui/use-toast";
import { OffChainDataShower } from './OffChainDataShower';


type TokenPageProps = {
    queryRef: QueryRef<token_NFT, NFTtokenVariables>
    tokenId?: string,
    nft?: NFT
};


const NFTInfo: React.FC<TokenPageProps> = ({ queryRef }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Ensure client-side rendering
        setIsClient(true);
    }, []);

    

    const { chainId, isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()
    const { address } = useWallet();

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [transactionCompleted, setTransactionCompleted] = useState<boolean>(true);

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


    const { data, error } = useReadQuery(queryRef);
    const nft = data?.token;

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
        <>
        {nft ? (
            <div className="flex items-center justify-center pt-2 pb-2">
                <Card className="w-full sm:w-1/2">
                    <CardHeader>
                        <CardTitle>{nft?.metadata?.title}</CardTitle>
                        <CardDescription>{nft?.metadata?.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full">
                            <div className="w-full mt-2">
                                <AspectRatio ratio={1 / 1}>
                                    <Image src={nft?.metadata?.imageURI} alt="Selected preview" fill className="rounded-md object-contain w-full h-full" />
                                </AspectRatio>
                            </div>
                            <div className="w-full p-2">
                                <TagList tags={nft?.metadata?.tags} readonly={true}></TagList>
                            </div>
                            <div>
                                <OffChainDataShower anchor={nft?.anchor} metadataURI={nft?.metadataURI} imageURI={nft?.metadata?.imageURI}></OffChainDataShower>
                            </div>
                            <div className="w-full pt-4 p-2">
                                <NFTHistory transactions={nft?.transactions} />
                            </div>
                        </div>
                    </CardContent>
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
        ) : (
            <div>Loading...</div> // Optional: display a loading state if nft isn't available
        )} 
        </>
    );
}

export default NFTInfo;