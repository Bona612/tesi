import { Attestation, NFT } from "@/types";
import { Eip1193Provider, ethers } from "ethers";
import NFTMarketplace_address from "../contractsData/NFTMarketplace_address.json";
import ERC6956Full_address from "../contractsData/ERC6956Full_address.json";
import NFTMarketplace from "../contractsData/NFTMarketplace.json";
import { ERC6956Full__factory } from '@/typechain/factories/contracts/ERC6956Full__factory';
import { ERC6956Full } from '@/typechain/contracts/ERC6956Full';
import { NFTMarketplace as NFTM } from '@/typechain/contracts/NFTMarketplace';
import { ethToWei } from "./utils";
import { merkleTreeAPI, signAttestationAPI } from "./attestation";



/// DA RIVEDERE E MIGLIORARE
export async function buyNFT(nft: NFT, isConnected: boolean, address: string | undefined, walletProvider: Eip1193Provider | undefined) {
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
        const tx_mint = await nftmcecontractWithSigner.buyItem(ERC6956Full_address.address, nft.id, txParams);
        receipt_mint = await tx_mint.wait();
        console.log('Transaction confirmed:', receipt_mint);


        return receipt_mint;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}



/// DA RIVEDERE E MIGLIORARE
export async function listNFT(nft: NFT, listingPrice: number, isConnected: boolean, address: string | undefined, walletProvider: Eip1193Provider | undefined) {
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
        const tx_mint = await nftmcecontractWithSigner.listItem(ERC6956Full_address.address, nft.id, ethToWei(listingPrice), txParams);
        receipt_mint = await tx_mint.wait();
        console.log('Transaction confirmed:', receipt_mint);


        return receipt_mint;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}




/// DA RIVEDERE E MIGLIORARE
export async function cancelListNFT(nft: NFT, isConnected: boolean, address: string | undefined, walletProvider: Eip1193Provider | undefined) {
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
        
        console.log(ERC6956Full_address.address, nft.id);
        // QUI da cambiare in .address
        const tx_mint = await nftmcecontractWithSigner.cancelListing(ERC6956Full_address.address, nft.id, txParams);
        receipt_mint = await tx_mint.wait();
        console.log('Transaction confirmed:', receipt_mint);


        return receipt_mint;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

/// DA RIVEDERE E MIGLIORARE
export async function redeemNFT(nft: NFT, attestation: Attestation, isConnected: boolean, address: string | undefined, walletProvider: Eip1193Provider | undefined) {
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
        
        console.log(ERC6956Full_address.address, nft.id);

        // QUI SI DOVRà RICHIAMARE LA TRASFORMAZIONE PER attestation E data (che è la prova)
        const responseSA = await signAttestationAPI({attestation, signer})
        console.log("response: ", responseSA)
        const signedAttestation = responseSA.response;

        const responseMF = await merkleTreeAPI({anchor: attestation.anchor})
        console.log("response: ", responseMF)
        const data = responseMF.response;

        const tx_mint = await nftmcecontractWithSigner["redeemItem(address,uint256,bytes,bytes)"](ERC6956Full_address.address, nft.id, signedAttestation, data, txParams);
        receipt_mint = await tx_mint.wait();
        console.log('Transaction confirmed:', receipt_mint);


        return receipt_mint;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
