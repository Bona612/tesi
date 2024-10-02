// app/api/merkle-tree/route.ts
import { NextResponse } from 'next/server';
import { getMerkleTreeProof } from '@/lib/merkle-tree';
import { BrowserProvider, Contract, Eip1193Provider, ethers, formatUnits } from 'ethers'
import { createMerkleTree, generateMerkleProof } from '@/utils/merkleTreeUtilities';
import { getValidAnchorsForMerkleTreeUtility } from '@/utils/validAnchorsUtilities';


const anchors: string[] = [   
  "0x5f91a71cff8405364143a67fe7ff7183803bcb9e9a1c0c7ed2605970b319b028",
  "0x4cc52563699fb1e3333b8aab3ecf016f8fd084e6fc48edf8603d83d4c5b97536",    
  "0x3ab9a2c6e6a7a11cbf3ec33b9a44926f7b85b6f93a599be75dcb2a1b7a9f9f31",    
  "0xa0921e50c2a4a929b2f9f2a5496f0d978b3bc73e5e5f598a8a2cfe7651d3b7aa",    
  "0x7df829da1f67a4745f4c92a1383ccf8a59b52a9b049e4ff1d751b812f4a4b11b",    
  "0x1e0d8a633ea6dba9ed83be812537f9e12b948a78b9a5d9f8b63a62b3e78a1d7b",    
  "0x92fcb938cb2e243b44e5045f4178e3282c7c929de4a7c1a3bc92d3c4f42a7d94",    
  "0x50ea59a8bf8fc302f830ad25a9cbf31b04bb0d7e6e7ed8bc78531a5b96e84f63",    
  "0x03d4ae07fe1203fbc647df23d3a7c84d6f7099b1af6ea4d2f8c1b85db124f1d0",    
  "0xf96db9fc7cb22c3299c6725c1b2fd5f9d59cc9c85f0c428aa728f607b9a8f116",    
  "0xb491acb33e98ae0f0e6c1691d7b0d394b0e086a48419275e2389d1af728c0c1e",    
  "0x7ae9b3d8a912e4a191d698f3ae4aab7152d1ffb06b680c2d69da2e6c5d021cc8",    
  "0xc74c438e14f4a8b1eb838cbad9c086b437ebcc2e4c9a56465d4cf27636f39f84",    
  "0x0d22b38364f627dfffc70dcd0f5e4bbf0f8ff4c7057bbd1f13a3f7d4c1f9b59a",    
  "0x29df1d46c63bc39fc23fa704d25e683fdb5505df0dc5797f7dc1c33fce908021",    
  "0x4e78ff5f9f32d92c2eb92d62cc758803c35ba4744e2da1de42bb3d7b9f2b5e1a",    
  "0xa0d8d5e8f53c9912a6a783f17ea7e0d4b3f4d71fbf82ff93d9c7888c6fd530ea",    
  "0xe85bf8ae2ae9b3df53d3d9acb8ea7c0dc7ea2a5b4e2f1e4c9a87294c27e0595b",    
  "0x12b7bdef87b82c5d836f94c8d3a49ccedbc8825271ed563be9b2f6f5f7e01db3",    
  "0xe7b19fcf2cf0e8de13f78084e8e49ac56b4f013a134d859531527c9c73725f94",    
  "0x837a97fcab9f814fc1e85d9f65b2a6576af55e623b2ed6c91e546a94999fe504",    
  "0x2e65a0bcdf51bb25d8e4e372184cb4e84d99560dbf449ad2d3d62af73ad8b82b",    
  "0xc1d31eae10a7a7b0492e775dfea0afc8f52db144c3e98eb9e764af2d3a8d1af4",    
  "0x68ea6fe23b9dcf1a91ff1878c5797b9ff9fa6543ea892bb8d54b1c73610eaa79",    
  "0xb79f4d22d60e9e09fe2bd7157865d2b29885bdf98611c9b13d9b9a5279c72e0f"
];


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

    const anchorsForMerkleTree = anchors.map(anchor => [anchor]);
    const merkleTree = createMerkleTree(anchorsForMerkleTree);
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