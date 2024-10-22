'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '8e16571495bbfafc00a57b9fb7c27829'

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

const INFURA_BASE_URL = process.env.INFURA_BASE_URL || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";

const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  chainName: 'Sepolia Testnet',
  currency: 'ETH',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: "https://sepolia.infura.io/v3/97070e614e654251a0578e1f52ccde09"
}

const localhost = {
  chainId: 1337,  // Commonly used chain ID for local development
  name: 'Localhost',
  currency: 'ETH',
  explorerUrl: '',
  rpcUrl: 'http://localhost:8545'
};

// 3. Create a metadata object
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://localhost', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}
// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
})

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet, localhost, sepolia],
  defaultChain: sepolia,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - false as default
})

export function Web3Modal({ children }: Readonly<{
    children: React.ReactNode;
  }>) {
  return children
}