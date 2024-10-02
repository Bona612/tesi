// app/api/merkle-tree/route.ts
import { NextResponse } from 'next/server';
import { getMerkleTreeProof } from '@/lib/merkle-tree';
import { BrowserProvider, Contract, Eip1193Provider, ethers, formatUnits } from 'ethers'
import { createMerkleTree, generateMerkleProof } from '@/utils/merkleTreeUtilities';
import { getValidAnchorsForMerkleTreeUtility } from '@/utils/validAnchorsUtilities';


export async function GET(request: Request) {
  try {
    // Parse the URL to get query parameters
    const url = new URL(request.url);
    const anchor = url.searchParams.get('anchor');
    console.log("anchor");
    console.log(anchor);

    // Validate that anchor is provided and is a string
    if (typeof anchor !== 'string' || anchor.trim() === '') {
      return NextResponse.json({ error: 'Valid anchor query parameter is required' }, { status: 400 });
    }

    console.log("anchor got");

    const merkleTree = createMerkleTree(getValidAnchorsForMerkleTreeUtility());
    const merkleTreeProof = generateMerkleProof(merkleTree, anchor);
    // Generate or fetch the Merkle tree using the anchor
    // const merkleTreeProof = getMerkleTreeProof(anchor);
    console.log("merkleTreeProof");
    console.log(merkleTreeProof);
    const data = ethers.AbiCoder.defaultAbiCoder().encode(
      ['bytes32[]'],
      [merkleTreeProof]);

    return NextResponse.json({ response: data });
  } 
  catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve Merkle tree' }, { status: 500 });
  }
}