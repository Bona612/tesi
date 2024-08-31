// import { NextResponse } from 'next/server';
// import { ethers } from 'ethers';
// import { addValidAnchor } from '@/lib/valid-anchors';
// import { getMerkleTreeRoot } from '@/lib/merkle-tree';


// const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
// const contract = new ethers.Contract(
//   process.env.CONTRACT_ADDRESS!,
//   [ // ABI fragment for the contract function
//     'function processAnchor(string memory anchor) public',
//   ],
//   provider.getSigner()
// );

// export async function POST(request: Request) {
//   const { anchor } = await request.json();
//   if (typeof anchor !== 'string') {
//     return NextResponse.json({ error: 'Invalid anchor format' }, { status: 400 });
//   }

//   try {
//     // Save the anchor to a database or in-memory storage
//     addValidAnchor(anchor);
//     const merkleRoot = getMerkleTreeRoot();

//     const tx = await contract.updateValidAnchors(merkleRoot);
//     await tx.wait();

//     return NextResponse.json({ message: 'Anchor processed' });
//   } catch (error) {
//     return NextResponse.json({ error: 'Transaction failed' }, { status: 500 });
//   }
// }
