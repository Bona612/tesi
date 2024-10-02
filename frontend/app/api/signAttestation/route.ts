import { Attestation } from "@/types";
import { NextResponse, NextRequest } from "next/server";
import { BrowserProvider, Contract, Eip1193Provider, ethers, formatUnits } from 'ethers'
import { ecsign, toRpcSig, fromRpcSig } from 'ethereumjs-util';
// import { createMerkleTree, generateMerkleProof, getMerkleTreeRoot } from "../../../utils/merkleTreeUtilities";
import { ERC6956Full } from '@/typechain/contracts/ERC6956Full';



export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5


interface RequestBody {
  attestation: Attestation
}


/// THIS IS GOOD!!! IT WORKS
async function signAttestation(attestation: Attestation): Promise<string> {
  const oraclePrivateKey: string = process.env.ORACLE_PRIVATE_KEY || "";
  console.log(oraclePrivateKey);

  // Create a wallet instance from the private key
  const wallet = new ethers.Wallet(oraclePrivateKey);

  const attestationTime = Math.floor(Date.now() / 1000.0); // Now in seconds UTC
  // DA CAPIRE CON PRECISIONE QUESTO, SECONDO ME ININFLUENTE COSì CMO'è
  const validStartTime = 0;
  const validEndTime = attestationTime + 15 * 60; // 15 minutes valid from attestation


  // Compute the message hash (in the Ethereum signed message format)
  const messageHash = ethers.solidityPackedKeccak256(
      ["address", "bytes32", "uint256", 'uint256', "uint256"],
      [attestation.to, attestation.anchor, attestationTime, validStartTime, validEndTime]
  );

  // Sign the message hash with the wallet's private key
  const signature = await wallet.signMessage(ethers.getBytes(messageHash));
  console.log("signature ", signature)

  // const sig = await signer.signMessage(ethers.getBytes(messageHash))
  // console.log("signed signer: ", sig);

  const prova = ethers.AbiCoder.defaultAbiCoder().encode(
    ['address', 'bytes32', 'uint256', 'uint256', 'uint256', 'bytes'], 
    [attestation.to, attestation.anchor, attestationTime, validStartTime, validEndTime, signature]
  );
  console.log("prova ", prova);

  return prova;
}

export async function POST(request: NextRequest) {
    try {
      const body = await request.json();

      // Access the data
      const { attestation } = body as RequestBody;

      const signedAttestation: string = await signAttestation(attestation)
      console.log("signedAttestation: ", signedAttestation);

      return NextResponse.json({ 'response': signedAttestation , 'status': 200 });
    } 
    catch (error) {
      console.log(error);
      return NextResponse.json(
        { 'error': "Internal Server Error " + process.env.ORACLE_PRIVATE_KEY },
        { 'status': 500 }
      );
    }
};