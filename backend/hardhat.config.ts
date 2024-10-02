import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import '@typechain/hardhat'
import '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-chai-matchers'

import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();


const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || "";
const INFURA_BASE_URL = process.env.INFURA_BASE_URL || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Adjust the number of runs as needed
      },
    }
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v6',
    // alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    // externalArtifacts: ['externalArtifacts/*.json'], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
    // dontOverrideCompile: false // defaults to false
  },
  paths: {
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {
      // accounts: {
      //   mnemonic: process.env.SEED_PHRASE,
      // },
      chainId: 1337,
      from: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    },
    localhost: {
      url: 'http://127.0.0.1:8545',  // `${process.env.LOCALHOST_RPC_URL}`
      // accounts: non dobbiamo fornirli, lo fa Hardhat dietro le quinte
      chainId: 1337, // Anche se è considerata una rete a sè stante, ha lo stesso chainId della rete di default hardhat
      from: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
      accounts: ["0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"]
    },
    sepolia: {
      url: `${INFURA_BASE_URL}${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111, // Visto dal sito Chainlist.org
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    outputFile: "gas-report.txt", // Il prospetto sul consumo di gas non verrà fornito su terminale ma su un file a parte
    // noColors: true,
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  },
  ignition: {
    requiredConfirmations: 6,
  }
};

export default config;