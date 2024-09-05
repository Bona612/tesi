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
import { Tag, Owner, NFT, Metadata, NFTtokenVariables, NFT_Owner, Transaction, Attestation }from "@/types/index";

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



// QUI, QUELLO CHE DOBBIAMO FARE, è DARE LA POSSIBILITà DI LISTARE
// QUINDI PROBABILMENTE ANDRà CREATO UN BOTTONE O ALTRO
// DA CUI INSERIREMO IL PREZZO E CONFERMEREMO LA TRANSAZIONE



type TokenPageProps = {
    queryRef: QueryRef<NFT, NFTtokenVariables>
    tokenId?: string,
    nft?: NFT,
    // isConnected: boolean,
    // address: `0x${string}` | undefined,
    // walletProvider: Eip1193Provider | undefined,
};


function getStartData(tokenId: string) {
    // va fatto il get del token da pinata IPFS
    // const tokenURI: string = await getTokenURI(tokenId);
    // const token: NFT = await getTokenMetadata(tokenURI);
  
    // // const nftMetadata: Metadata = await getNFTMetadata(token.metadataURI);
    // const nftMetadata: Metadata = token.metadataURI;
    console.log("token id: ", tokenId)
    let tag: Tag = "Tag 1";
    let n: number = 1;
    if (tokenId === '2') {
      tag = "Tag 2";
      n = 2;
    }
    else if (tokenId === '3') {
      tag = "Tag 3";
      n = 3;
    }
    const t: NFT = {
      id: tokenId,
      anchor: tokenId,
      metadata: {title: "titolo", description: "descrizione", tags: [tag], imageURI: "https://dummyimage.com/300.png/09f/fff"} as Metadata,
    //   tags: [tag],
      owner: {} as NFT_Owner,
      isListed: true,
      listingPrice: BigInt(12345678901),
      toRedeem: false,
      transactions: [] as Transaction[],
    }
  
    return t;
}


const NFTInfo: React.FC<TokenPageProps> = ({ queryRef, tokenId }) => {
    // const [nft, setNft] = useState<NFT>({} as NFT);
    // const [nftMetadata, setNftMetadata] = useState<Metadata>({} as Metadata);


    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()
    
    // const [attestation, setAttestation] = useState<Attestation | undefined>(undefined);

    
    //     async function getAll() {
    //         // va fatto il get del token da pinata IPFS
    //         const tokenURI: string = await getTokenURI(tokenId, isConnected, address, walletProvider);
    //         const token: NFT = await getTokenMetadata(tokenURI);
        
    //         // const nftMetadata: Metadata = await getNFTMetadata(token.metadataURI);
    //         const nftMetadata: Metadata = token.metadataURI;
        
    //         setNft(token);
    //         setNftMetadata(nftMetadata);

    //         return nftMetadata;
    //     }
    
    //     if (isConnected) {
    //         getAll();
    //     }
    //     else {
    //         setNft({
    //             id: "2",
    //             tokenId: 2,
    //             anchor: "2",
    //             metadataURI: {title: "titolo", description: "descrizione", imageURI: "https://dummyimage.com/300.png/09f/fff"} as Metadata,
    //             tags: ["Tag 2"]
    //         });
            
    //     }
    // }, []);

    // const { data } = useReadQuery(queryRef);
    const data = getStartData(tokenId as string);
    console.log(data.metadata.tags);
      
    const handleBuyNFT = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        buyNFT(data, isConnected, address, walletProvider);
    };

    // PROBABILMENTE QUI NON PASSARE LISTNFT, MA SEMPLICEMENTE CHIAMARE UN'ALTRA FUNZIONE CHE NON FARà ALTRO CHE CHIAMARE LISTNFT
    const handleListNFT = (listingPrice: number) => {
        listNFT(data, listingPrice, isConnected, address, walletProvider);
    };

    const handleCancelListNFT = () => {
        cancelListNFT(data, isConnected, address, walletProvider);
    };

    const handleRedeemNFT = (attestation: Attestation) => {
        redeemNFT(data, attestation, isConnected, address, walletProvider);
    };

    // const handleOnScanSuccess = (attestation: Attestation) => {
    //     setAttestation(attestation);
    // }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{data.metadata.title}</CardTitle>
                <CardDescription>{data.metadata.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    <div className="w-full mt-2">
                        {/* <p>Selected Image Preview:</p> */}
                        <AspectRatio ratio={1 / 1}>
                            <Image src={data.metadata.imageURI} alt="Selected preview" fill className="rounded-md object-cover w-full h-full" />
                        </AspectRatio>
                    </div>
                    <div>
                        <TagList tags={data.metadata.tags} readonly={true}></TagList>
                    </div>
                    <div>
                        <NFTHistory transactions={data.transactions} />
                    </div>
                </div>
            </CardContent>
            {data.isListed ? (
                address && data.owner.id === address ? (
                    <CardFooter className="flex justify-between">
                        {/* <AlertDialogConfirmation text={"Buy"} handleOnClick={handleBuyNFT} /> */}
                        <DialogBuy handleOnClick={handleBuyNFT} disabled={data.owner.id === address} price={weiToEth(data.listingPrice)} />
                        {/* <Button onClick={handleBuyNFT} variant="outline" disabled={data.owner.id === address}>Buy {weiToEth(data.listingPrice)} ETH</Button>
                        <Button onClick={handleBuyNFT} disabled={data.owner.id === address}>Buy {weiToEth(data.listingPrice)} ETH</Button> */}
                    </CardFooter>
                ) : (
                    <CardFooter className="flex justify-between">
                        <DialogCancelList handleOnClick={handleCancelListNFT} />
                    </CardFooter>
                )
            ) : (
                data.owner.id === address ? (
                    data.toRedeem ? (
                        <CardFooter className="flex justify-between">
                            <AlertDialogRedeem handleRedeemNFT={handleRedeemNFT} />
                        </CardFooter>
                    ) : (
                        <CardFooter className="flex justify-between">
                            <DialogList handleOnClick={handleListNFT} />
                        </CardFooter>
                    )
                ) : <></>
            )}
        </Card>
    );
}

// : (
//     <CardFooter className="flex justify-between">
//         <DialogList handleOnClick={handleListNFT} />
//     </CardFooter>
// )

export default NFTInfo;