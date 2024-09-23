'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import TagList from '@/components/TagList';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AspectRatio } from './ui/aspect-ratio';
import { Tag, Owner, NFT, Metadata, NFTtokenVariables, NFT_Owner, Transaction, Attestation, token_NFT }from "@/types/index";

import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { BrowserProvider, Contract, Eip1193Provider, ethers, formatUnits } from 'ethers'
import { getIPFSContent } from "@/utils/ipfs-pinata";

import ERC6956Full_address from "@/contractsData/ERC6956Full_address.json";
import { setLengthLeft } from 'ethereumjs-util';
import { QueryRef, useReadQuery } from '@apollo/client';
import NFTHistory from './NFTHistory';

import NFTMarketplace_address from "../contractsData/NFTMarketplace_address.json";
import NFTMarketplace from "../contractsData/NFTMarketplace.json";
import { ERC6956Full__factory } from '@/typechain/factories/contracts/ERC6956Full__factory';
import { ERC6956Full } from '@/typechain/contracts/ERC6956Full';
import { NFTMarketplace as NFTM } from '@/typechain/contracts/NFTMarketplace';
import { CreateDialog } from './CreateDialog';
import { bigint } from 'zod';
import { ethToWei, weiToEth } from '@/utils/utils';
import { DialogBuy } from './BuyDialog';
import { DialogList } from './ListDialog';
import { DialogCancelList } from './CancelListDialog';
import { buyNFT, cancelListNFT, listNFT, redeemNFT } from '@/utils/contracts';
import { AlertDialogRedeem } from './AlertDialogRedeem';
import { useWallet } from '@/context/WalletContext';
import { useToast } from "@/components/ui/use-toast";



// QUI, QUELLO CHE DOBBIAMO FARE, è DARE LA POSSIBILITà DI LISTARE
// QUINDI PROBABILMENTE ANDRà CREATO UN BOTTONE O ALTRO
// DA CUI INSERIREMO IL PREZZO E CONFERMEREMO LA TRANSAZIONE



type TokenPageProps = {
    queryRef: QueryRef<token_NFT, NFTtokenVariables>
    tokenId?: string,
    nft?: NFT,
    // isConnected: boolean,
    // address: `0x${string}` | undefined,
    // walletProvider: Eip1193Provider | undefined,
};


const NFTInfo: React.FC<TokenPageProps> = ({ queryRef, tokenId }) => {
    // const [nft, setNft] = useState<NFT>({} as NFT);
    // const [nftMetadata, setNftMetadata] = useState<Metadata>({} as Metadata);


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

    // if (!queryRef) {
    //     return (<div>undefined</div>);
    // }

    const { data, error } = useReadQuery(queryRef);
    const nft = data.token;
    console.log(data);

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
    //     return (<div>Loading...</div>);
    // }
    const ownerAddress = address ? address.toLowerCase() : "";

    // if (error) {
    //     return (<div>undefined</div>);
    // }

    return (
        <div className="flex items-center justify-center pt-2 pb-2">
            <Card className="w-full sm:w-1/2">
                <CardHeader>
                    <CardTitle>{nft.metadata.title}</CardTitle>
                    <CardDescription>{nft.metadata.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div>
                        <div className="w-full mt-2">
                            <AspectRatio ratio={1 / 1}>
                                <Image src={nft.metadata.imageURI} alt="Selected preview" fill className="rounded-md object-contain w-full h-full" />
                            </AspectRatio>
                        </div>
                        <div className="w-full p-2">
                            <TagList tags={nft.metadata.tags} readonly={true}></TagList>
                        </div>
                        <div className="w-full p-2">
                            <NFTHistory transactions={nft.transactions} />
                        </div>
                    </div>
                </CardContent>
                {nft.isListed ? (
                    ownerAddress && nft.owner.id !== ownerAddress ? (
                        <CardFooter className="flex justify-between">
                            {/* <AlertDialogConfirmation text={"Buy"} handleOnClick={handleBuyNFT} /> */}
                            <DialogBuy handleOnClick={handleBuyNFT} isOpen={isOpen} openDialog={openDialog} setIsOpen={setOpen} closeDialog={closeDialog} isLoading={!transactionCompleted} disabled={false} price={weiToEth(nft.listingPrice)} />
                            {/* <Button onClick={handleBuyNFT} variant="outline" disabled={nft.owner.id === address}>Buy {weiToEth(nft.listingPrice)} ETH</Button>
                            <Button onClick={handleBuyNFT} disabled={nft.owner.id === address}>Buy {weiToEth(nft.listingPrice)} ETH</Button> */}
                        </CardFooter>
                    ) : (
                        <CardFooter className="flex justify-between">
                            {/* <DialogCancelList isLoading={!transactionCompleted} handleOnClick={handleCancelListNFT} /> */}
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
                    ) : <></>
                )}
                {/* {nft.isListed ? (
                    ownerAddress && nft.owner.id !== ownerAddress ? (
                        <CardFooter className="flex justify-between">
                            <DialogBuy handleOnClick={handleBuyNFT} isLoading={!transactionCompleted} disabled={nft.owner.id === ownerAddress} price={weiToEth(nft.listingPrice)} />
                        </CardFooter>
                    ) : (
                        <CardFooter className="flex justify-between">
                            <DialogCancelList isLoading={!transactionCompleted} handleOnClick={handleCancelListNFT} />
                        </CardFooter>
                    )
                ) : (
                    nft.owner.id === ownerAddress ? (
                        nft.toRedeem ? (
                            <CardFooter className="flex justify-between">
                                <AlertDialogRedeem handleRedeemNFT={handleRedeemNFT} />
                            </CardFooter>
                        ) : (
                            <CardFooter className="flex justify-between">
                                <DialogList isLoading={!transactionCompleted} handleOnClick={handleListNFT} />
                            </CardFooter>
                        )
                    ) : <></>
                )} */}
            </Card>
        </div>
    );
}

export default NFTInfo;