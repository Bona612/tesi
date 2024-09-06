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



type NFTProps = {
    nft: NFT;
}



export default function BaseNFTBox({ nft }: NFTProps) {
    // // Definizione di variabili di stato per andare a memorizzare alcune informazioni sul token dopo aver otenuto il token URI
    // const [imageURI, setImageURI] = useState("") // Definizione della variabile di stato, del metodo per aggiornarla e del valore iniziale (stringa vuota)
    // const [tokenName, setTokenName] = useState("") // Variabile di stato in cui andremo a memorizzare il nome del token prelevato dal token URI
    // const [tokenDescription, setTokenDescription] = useState("")
    // const [tokenCreator, setTokenCreator] = useState("")
    // const [nftName, setNftName] = useState("")
    // const [nftAttributes, setNftAttributes] = useState("")
    // const [showModal, setShowModal] = useState(false)
    // const hideModal = () => setShowModal(false)

    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    // const [attestation, setAttestation] = useState<Attestation | undefined>(undefined);

    console.log(address);

    console.log("nft")
    console.log(nft)
    console.log(typeof nft)

    // QUI PROBABILMENTE FAR APPARIRE UN ALERT DIALOG O SIMILE PER  LA CONFERMA
    const handleBuyNFT = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        buyNFT(nft, isConnected, address, walletProvider);
    };

    // PROBABILMENTE QUI NON PASSARE LISTNFT, MA SEMPLICEMENTE CHIAMARE UN'ALTRA FUNZIONE CHE NON FARà ALTRO CHE CHIAMARE LISTNFT
    const handleListNFT = (listingPrice: number) => {
        listNFT(nft, listingPrice, isConnected, address, walletProvider);
    };

    const handleCancelListNFT = () => {
        cancelListNFT(nft, isConnected, address, walletProvider);
    };

    const handleRedeemNFT = (attestation: Attestation) => {
        redeemNFT(nft, attestation, isConnected, address, walletProvider);
    };

    // const handleOnScanSuccess = (attestation: Attestation) => {
    //     setAttestation(attestation);
    // }
    

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
                    address && nft.owner.id !== address ? (
                        <CardFooter className="flex justify-between">
                            {/* <AlertDialogConfirmation text={"Buy"} handleOnClick={handleBuyNFT} /> */}
                            <DialogBuy handleOnClick={handleBuyNFT} disabled={nft.owner.id === address} price={weiToEth(nft.listingPrice)} />
                            {/* <Button onClick={handleBuyNFT} variant="outline" disabled={nft.owner.id === address}>Buy {weiToEth(nft.listingPrice)} ETH</Button>
                            <Button onClick={handleBuyNFT} disabled={nft.owner.id === address}>Buy {weiToEth(nft.listingPrice)} ETH</Button> */}
                        </CardFooter>
                    ) : (
                        <CardFooter className="flex justify-between">
                            <DialogCancelList handleOnClick={handleCancelListNFT} />
                        </CardFooter>
                    )
                ) : (
                    nft.owner.id === address ? (
                        nft.toRedeem ? (
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
        </div>
    )
}



// {nft.isListed && address &&
//     <CardFooter className="flex justify-between">
//         <AlertDialogConfirmation text={"Buy"} handleOnClick={handleBuyNFT} />
//         <DialogBuy handleOnClick={handleBuyNFT} disabled={nft.owner.id === address} price={weiToEth(nft.listingPrice)} />
//         <Button onClick={handleBuyNFT} variant="outline" disabled={nft.owner.id === address}>Buy</Button>
//         <Button onClick={handleBuyNFT} disabled={nft.owner.id === address}>Buy</Button>
//     </CardFooter>
// }



// return (
//   <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
//     <input type="file" id="file" ref={inputFile} onChange={handleChange} />
//     <button disabled={uploading} onClick={uploadFile}>
//       {uploading ? "Uploading..." : "Upload"}
//     </button>
//     {cid && (
//       <img
//         src={`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
//         alt="Image from IPFS"
//       />
//     )}
//   </main>
// );