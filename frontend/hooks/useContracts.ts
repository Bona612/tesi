

// PROBABILMENTE DA LEVARE


// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import { ERC6956Full } from "../typechain"; // Adjust the path based on your project structure
// import { getContractInstance } from "../utils/contracts";
// // import Web3Modal from "@web3modal/ethers";
// import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
// import { BrowserProvider, Contract, formatUnits } from 'ethers';


// export const useContract = (contractAddress?: string) => {
//   const [contract, setContract] = useState<ERC6956Full | null>(null);
//   const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
//   const [signer, setSigner] = useState<ethers.Signer | null>(null);
//   const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);

//   const { address, chainId, isConnected } = useWeb3ModalAccount();

//   const { walletProvider } = useWeb3ModalProvider();

//   async function onSignMessage() {
//     const provider = new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider)
//     const signer = await provider.getSigner()
//     const signature = await signer?.signMessage('Hello Web3Modal Ethers')
//     console.log(signature)
//   }

//   useEffect(() => {
//     const initWeb3Modal = async () => {
//       const web3ModalInstance = new Web3Modal({
//         cacheProvider: true,
//         providerOptions: {}, // You can customize this with provider options if needed
//       });
//       setWeb3Modal(web3ModalInstance);
//     };
//     initWeb3Modal();
//   }, []);

//   const connectWallet = async () => {
//     if (!web3Modal) return;

//     try {
//       const provider = await web3Modal.connect();
//       const web3Provider = new ethers.BrowserProvider(provider as any); // Type assertion for ethers-v6 compatibility
//       setProvider(web3Provider);

//       const signer = await web3Provider.getSigner();
//       setSigner(signer);
//     } catch (error) {
//       console.error("Failed to connect wallet:", error);
//     }
//   };

//   const loadContract = async (contractAddress: string) => {
//     if (!signer) return;

//     try {
//       const contractInstance = await getContractInstance(contractAddress, signer);
//       setContract(contractInstance);
//     } catch (error) {
//       console.error("Failed to load contract:", error);
//     }
//   };

//   useEffect(() => {
//     if (contractAddress && signer) {
//       loadContract(contractAddress);
//     }
//   }, [contractAddress, signer]);

//   return { contract, connectWallet, provider, signer };
// };
