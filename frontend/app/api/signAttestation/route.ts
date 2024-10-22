import { Attestation } from "@/types";
import { NextResponse, NextRequest } from "next/server";
import { ethers } from 'ethers'



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


async function signAttestation(attestation: Attestation): Promise<string> {
  const oraclePrivateKey: string = process.env.ORACLE_PRIVATE_KEY || "";

  // Create a wallet instance from the private key
  const wallet = new ethers.Wallet(oraclePrivateKey);

  const attestationTime = Math.floor(Date.now() / 1000.0); // Now in seconds UTC
  
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

      return NextResponse.json({ 'response': signedAttestation , 'status': 200 });
    } 
    catch (error) {
      return NextResponse.json(
        { 'error': "Internal Server Error " },
        { 'status': 500 }
      );
    }
};