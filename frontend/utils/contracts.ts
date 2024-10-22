import { Attestation, NFT } from "@/types";
import { Eip1193Provider, ethers } from "ethers";
import NFTMarketplace_address from "../contractsData/NFTMarketplace_address.json";
import NFTMarketplace from "../contractsData/NFTMarketplace.json";
import { NFTMarketplace as NFTM } from '@/typechain/contracts/NFTMarketplace';
import { ethToWei } from "./utils";
import { merkleTreeAPI, signAttestationAPI } from "./attestation";
import ERC6956Full_address from "../contractsData/ERC6956Full_address.json";
import ERC6956Full from "../contractsData/ERC6956Full.json";
import { ERC6956Full as IERC6956Full } from "../typechain";



export async function buyNFT(toast: (arg0: { title: string; description: string; }) => void, nft: NFT, isConnected: boolean, address: string | undefined, walletProvider: Eip1193Provider | undefined) {
    try {
        if (!isConnected) throw new Error('User disconnected');
        
        // Set up the ethers provider
        const ethersProvider = new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider);
        
        // Get the signer from the provider
        const signer = await ethersProvider.getSigner();
        console.log("signer");
        console.log(signer);
        
        // The Contract object
        const nftmcecontract1 = new ethers.Contract(NFTMarketplace_address.address, NFTMarketplace.abi);
        
        const nftmcecontract: NFTM = new ethers.Contract(NFTMarketplace_address.address, NFTMarketplace.abi, signer) as unknown as NFTM;
        
        // Check if the address is valid
        if (!ethers.isAddress(await signer.getAddress())) {
            throw new Error('Invalid address');
        }

        const nftmcecontractWithSigner = nftmcecontract.connect(signer);
        // Prepare your transaction parameters
        const txParams = {
            value: nft.listingPrice
        };

        let receipt_mint: ethers.ContractTransactionReceipt | null = null;
        
        const tx_mint = await nftmcecontractWithSigner.buyItem(ERC6956Full_address.address, nft.id, txParams);
        receipt_mint = await tx_mint.wait();

        const result = receipt_mint as ethers.ContractTransactionReceipt;
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


export async function listNFT(toast: (arg0: { title: string; description: string; }) => void, nft: NFT, listingPrice: number, isConnected: boolean, address: string | undefined, walletProvider: Eip1193Provider | undefined) {
    try {
        if (!isConnected) throw new Error('User disconnected');
        
        // Set up the ethers provider
        const ethersProvider = new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider);
        
        // Get the signer from the provider
        const signer = await ethersProvider.getSigner();
        
        // The Contract object
        const nftmcecontract1 = new ethers.Contract(NFTMarketplace_address.address, NFTMarketplace.abi);
        
        const nftmcecontract: NFTM = new ethers.Contract(NFTMarketplace_address.address, NFTMarketplace.abi, signer) as unknown as NFTM;

        // Check if the address is valid
        if (!ethers.isAddress(await signer.getAddress())) {
            throw new Error('Invalid address');
        }

        const nftmcecontractWithSigner = nftmcecontract.connect(signer);

        let receipt_mint: ethers.ContractTransactionReceipt | null = null;
        const ercContract: IERC6956Full = new ethers.Contract(ERC6956Full_address.address, ERC6956Full.abi, signer) as unknown as IERC6956Full;
        // Check if the NFT is already approved for the marketplace
        let approvedAddress = await ercContract.getApproved(nft.id);

        // If not approved, approve the marketplace to transfer the NFT
        if (approvedAddress !== NFTMarketplace_address.address) {
            // Approve the marketplace to transfer the NFT
            await ercContract.approve(NFTMarketplace_address.address, nft.id);
        }
        
        while (approvedAddress !== NFTMarketplace_address.address) {
            approvedAddress = await ercContract.getApproved(nft.id);
            console.log(`Approved address for token ${nft.id}:`, approvedAddress);
        }        

        const tx_mint = await nftmcecontractWithSigner.listItem(ERC6956Full_address.address, nft.id, ethToWei(0.0001));
        receipt_mint = await tx_mint.wait();

        const result = receipt_mint as ethers.ContractTransactionReceipt;
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



export async function cancelListNFT(toast: (arg0: { title: string; description: string; }) => void, nft: NFT, isConnected: boolean, address: string | undefined, walletProvider: Eip1193Provider | undefined) {
    try {
        if (!isConnected) throw new Error('User disconnected');
        
        // Set up the ethers provider
        const ethersProvider = new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider);
        
        // Get the signer from the provider
        const signer = await ethersProvider.getSigner();
        
        // The Contract object
        const nftmcecontract1 = new ethers.Contract(NFTMarketplace_address.address, NFTMarketplace.abi);
        
        const nftmcecontract: NFTM = new ethers.Contract(NFTMarketplace_address.address, NFTMarketplace.abi, signer) as unknown as NFTM;
        

        // Check if the address is valid
        if (!ethers.isAddress(await signer.getAddress())) {
            throw new Error('Invalid address');
        }

        const nftmcecontractWithSigner = nftmcecontract.connect(signer);
        let receipt_mint: ethers.ContractTransactionReceipt | null = null;
        const tx_mint = await nftmcecontractWithSigner.cancelListing(ERC6956Full_address.address, nft.id); // , txParams);
        receipt_mint = await tx_mint.wait();

        const result = receipt_mint as ethers.ContractTransactionReceipt;
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


export async function redeemNFT(toast: (arg0: { title: string; description: string; }) => void, nft: NFT, attestation: Attestation, isConnected: boolean, address: string | undefined, walletProvider: Eip1193Provider | undefined) {
    try {
        if (!isConnected) throw new Error('User disconnected');
        
        // Set up the ethers provider
        const ethersProvider = new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider);

        // Get the signer from the provider
        const signer = await ethersProvider.getSigner();

        const nftmcecontract1 = new ethers.Contract(NFTMarketplace_address.address, NFTMarketplace.abi);
        
        const nftmcecontract: NFTM = new ethers.Contract(NFTMarketplace_address.address, NFTMarketplace.abi, signer) as unknown as NFTM;
        
        // Check if the address is valid
        if (!ethers.isAddress(await signer.getAddress())) {
            throw new Error('Invalid address');
        }

        const nftmcecontractWithSigner = nftmcecontract.connect(signer);

        let receipt_mint: ethers.ContractTransactionReceipt | null = null;

        const to = await signer.getAddress()
        const attestationToSign: Attestation = {
            to: to,
            anchor: attestation.anchor
        }

        const responseSA = await signAttestationAPI({attestation: attestationToSign})
        const signedAttestation = responseSA.response;

        const responseMF = await merkleTreeAPI({anchor: attestation.anchor})
        const data = responseMF.response;

        const tx_mint = await nftmcecontractWithSigner["redeemItem(address,uint256,bytes,bytes)"](ERC6956Full_address.address, nft.id, signedAttestation, data); // , txParams);
        receipt_mint = await tx_mint.wait();

        const result = receipt_mint as ethers.ContractTransactionReceipt;
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
