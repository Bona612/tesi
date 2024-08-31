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
import { NFT, Tag } from "@/types";
import TokenHistory from "./NFTHistory";
import { buildQueryFromSelectionSet } from "@apollo/client/utilities";
import { AlertDialogConfirmation } from "./CreateDialog";
import { DialogBuy } from "./BuyDialog";
import { ethToWei, weiToEth } from "@/utils/utils";
import { DialogList } from "./ListDialog";
import { DialogCancelList } from "./CancelListDialog";



type NFTProps = {
    nft: NFT;
}



/// DA RIVEDERE E MIGLIORARE
async function buyNFT(nft: NFT, isConnected: boolean, address: string | undefined, walletProvider: Eip1193Provider | undefined) {
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
        const nftmcecontract1 = new ethers.Contract(NFTMarketplace_address.address, NFTMarketplace.abi);
        
        const nftmcecontract: NFTM = new ethers.Contract(NFTMarketplace_address.address, NFTMarketplace.abi, signer) as unknown as NFTM;
        // Use the factory to create the contract instance
        // const ercContract: ERC6956Full = ERC6956Full__factory.connect(ERC6956Full_address.address, signer);
        console.log("nftmcecontract");
        console.log(nftmcecontract);

        // Check if the address is valid
        if (!ethers.isAddress(await signer.getAddress())) {
            throw new Error('Invalid address');
        }

        const nftmcecontractWithSigner = nftmcecontract.connect(signer);
        const nonce = 2
        // Prepare your transaction parameters
        const txParams = {
            maxFeePerGas: 703230725 * 2,
            value: nft.listingPrice
        };

        console.log("control okay")

        // QUI DA CAMBIARE LA FUNZIONE DOPO AVERLA TESTATA, NON SARà PIù transferanchor MA createAnchor
        let receipt_mint: ethers.ContractTransactionReceipt | null = null;
        // const NULLADDR = ethers.ZeroAddress;
        
        console.log("senza data")
        // QUI da cambiare in .address
        const tx_mint = await nftmcecontractWithSigner.buyItem(nft.id, nft.tokenId, txParams);
        receipt_mint = await tx_mint.wait();
        console.log('Transaction confirmed:', receipt_mint);


        return receipt_mint;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}



/// DA RIVEDERE E MIGLIORARE
async function listNFT(nft: NFT, listingPrice: number, isConnected: boolean, address: string | undefined, walletProvider: Eip1193Provider | undefined) {
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
        const nftmcecontract1 = new ethers.Contract(NFTMarketplace_address.address, NFTMarketplace.abi);
        
        const nftmcecontract: NFTM = new ethers.Contract(NFTMarketplace_address.address, NFTMarketplace.abi, signer) as unknown as NFTM;
        // Use the factory to create the contract instance
        // const ercContract: ERC6956Full = ERC6956Full__factory.connect(ERC6956Full_address.address, signer);
        console.log("nftmcecontract");
        console.log(nftmcecontract);

        // Check if the address is valid
        if (!ethers.isAddress(await signer.getAddress())) {
            throw new Error('Invalid address');
        }

        const nftmcecontractWithSigner = nftmcecontract.connect(signer);
        const nonce = 2
        // Prepare your transaction parameters
        const txParams = {
            maxFeePerGas: 703230725 * 2
            // other parameters as needed
        };

        console.log("control okay")

        // QUI DA CAMBIARE LA FUNZIONE DOPO AVERLA TESTATA, NON SARà PIù transferanchor MA createAnchor
        let receipt_mint: ethers.ContractTransactionReceipt | null = null;
        // const NULLADDR = ethers.ZeroAddress;
        
        // QUI da cambiare in .address
        const tx_mint = await nftmcecontractWithSigner.listItem(nft.id, nft.tokenId, ethToWei(listingPrice), txParams);
        receipt_mint = await tx_mint.wait();
        console.log('Transaction confirmed:', receipt_mint);


        return receipt_mint;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}




/// DA RIVEDERE E MIGLIORARE
async function cancelListNFT(nft: NFT, isConnected: boolean, address: string | undefined, walletProvider: Eip1193Provider | undefined) {
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
        const nftmcecontract1 = new ethers.Contract(NFTMarketplace_address.address, NFTMarketplace.abi);
        
        const nftmcecontract: NFTM = new ethers.Contract(NFTMarketplace_address.address, NFTMarketplace.abi, signer) as unknown as NFTM;
        // Use the factory to create the contract instance
        // const ercContract: ERC6956Full = ERC6956Full__factory.connect(ERC6956Full_address.address, signer);
        console.log("nftmcecontract");
        console.log(nftmcecontract);

        // Check if the address is valid
        if (!ethers.isAddress(await signer.getAddress())) {
            throw new Error('Invalid address');
        }

        const nftmcecontractWithSigner = nftmcecontract.connect(signer);
        const nonce = 2
        // Prepare your transaction parameters
        const txParams = {
            maxFeePerGas: 703230725 * 2
            // other parameters as needed
        };

        console.log("control okay")

        // QUI DA CAMBIARE LA FUNZIONE DOPO AVERLA TESTATA, NON SARà PIù transferanchor MA createAnchor
        let receipt_mint: ethers.ContractTransactionReceipt | null = null;
        // const NULLADDR = ethers.ZeroAddress;
        
        // QUI da cambiare in .address
        const tx_mint = await nftmcecontractWithSigner.cancelListing(nft.id, nft.tokenId, txParams);
        receipt_mint = await tx_mint.wait();
        console.log('Transaction confirmed:', receipt_mint);


        return receipt_mint;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
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

    return (
        <div className="w-full p-4">
            <Card className="w-full">
                <Link href={`/nfts/${nft.tokenId}`} key={`${nft.tokenId}`} >
                <CardHeader>
                    <CardTitle>{nft.metadata.title}</CardTitle>
                    <CardDescription>{nft.metadata.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full">
                        <div className="w-full">
                            {/* <p>Selected Image Preview:</p> */}
                            <AspectRatio ratio={1 / 1}>
                                {/* <Image src={""} alt="Selected preview" className="rounded-md object-cover" /> */}
                                <Image src={nft.metadata.imageURI} alt="Selected preview" className="w-full h-full rounded-md object-cover" layout="fill" /> 
                            </AspectRatio>
                        </div>
                        <div>
                            <TagList tags={nft.metadata.tags} readonly={true}></TagList>
                        </div>
                        {/* <div>
                            <TokenHistory transactions={transactions} />
                        </div> */}
                    </div>
                </CardContent>
                </Link>
                {nft.isListed ? (
                    address && nft.owner.id !== address ? (
                        <CardFooter className="flex justify-between">
                            <AlertDialogConfirmation text={"Buy"} handleOnClick={handleBuyNFT} />
                            <DialogBuy handleOnClick={handleBuyNFT} disabled={nft.owner.id === address} price={weiToEth(nft.listingPrice)} />
                            <Button onClick={handleBuyNFT} variant="outline" disabled={nft.owner.id === address}>Buy {weiToEth(nft.listingPrice)} ETH</Button>
                            <Button onClick={handleBuyNFT} disabled={nft.owner.id === address}>Buy {weiToEth(nft.listingPrice)} ETH</Button>
                        </CardFooter>
                    ) : (
                        <CardFooter className="flex justify-between">
                            <DialogCancelList handleOnClick={handleCancelListNFT} />
                        </CardFooter>
                    )
                ) : (
                    nft.owner.id === address && (
                        <CardFooter className="flex justify-between">
                            <DialogList handleOnClick={handleListNFT} />
                        </CardFooter>
                    )
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