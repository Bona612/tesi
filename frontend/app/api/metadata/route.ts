import { CID } from "multiformats/cid";
import { NextResponse, NextRequest } from "next/server";

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5


const SUBGRAPH_STUDIO_ENDPOINT = process.env.SUBGRAPH_STUDIO_ENDPOINT || "";

export async function POST(request: NextRequest) {
    try {
      const jsonData = await request.json();
      console.log("JSON data: ", jsonData);
  
      const data = JSON.stringify({
        pinataOptions: {cidVersion: 1},
        pinataContent: jsonData,
        pinataMetadata: {
          name: jsonData.title ? `${jsonData.title}.json` : 'default.json'
        }
      });

      const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          'Content-Type': 'application/json'
        },
        body: data,
      });

      const resData = await res.json();
      console.log(resData);


      return NextResponse.json({ 'response': resData ,  'status': 200 });
    }
    catch (error) {
      console.log(error);
      return NextResponse.json(
        { 'error': "Internal Server Error" },
        { 'status': 500 }
      );
    }
};
// export async function POST(request: NextRequest) {
//     try {
//       const jsonData = await request.json();
//       console.log("JSON data: ", jsonData);
  
//       const data = JSON.stringify({
//         pinataOptions: {cidVersion: 1},
//         pinataContent: jsonData,
//         pinataMetadata: {
//           name: jsonData.title ? `${jsonData.title}.json` : 'default.json'
//         }
//       });

//       const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.PINATA_JWT}`,
//           'Content-Type': 'application/json'
//         },
//         body: data,
//       });

//       const resData = await res.json();
//       console.log(resData);

//       const cid1 = CID.parse(resData.IpfsHash);

//       // Get codec and hash function details
//       console.log('CID1 Details:', {
//         version: cid1.version,
//         codec: cid1.code,
//         hash: cid1.multihash
//       });

//       return NextResponse.json({ 'response': resData ,  'status': 200 });
//     }
//     catch (error) {
//       console.log(error);
//       return NextResponse.json(
//         { 'error': "Internal Server Error" },
//         { 'status': 500 }
//       );
//     }
// };

import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL!,
});

export async function GET(request: NextRequest) {
    try {
      // Parse the URL to get query parameters
      const url = new URL(request.url);
      const cid = url.searchParams.get('CID');
      console.log("CID");
      console.log(cid);
  
      // Validate that anchor is provided and is a string
      if (typeof cid !== 'string') {
        return NextResponse.json({ error: 'Valid CID parameter is required' }, { status: 400 });
      }
  
      const metadata = await pinata.gateways.get(cid);
  
      return NextResponse.json({ response: metadata });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to retrieve Merkle tree' }, { status: 500 });
    }
}

// export async function DELETE(request: NextRequest) {

//   try {
//     const formData = await request.formData();

//     const cid: string = formData.get("cid") as string;

//     const res = await fetch("https://api.pinata.cloud/pinning/unpin/" + cid, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer YOUR_PINATA_JWT`,
//       },
//     });
//     const resData = await res.json();
//     console.log(resData);

//     return NextResponse.json({ 'response': resData ,  'status': 200 });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//         { 'error': "Internal Server Error" },
//         { 'status': 500 }
//     );
//   }
// }