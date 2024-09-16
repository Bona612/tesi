import { CID } from "multiformats/cid";
import { NextResponse, NextRequest } from "next/server";
import * as raw from 'multiformats/codecs/raw'
import * as dagPB from '@ipld/dag-pb'
import { sha256 } from 'multiformats/hashes/sha2'

export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5


const SUBGRAPH_STUDIO_ENDPOINT = process.env.SUBGRAPH_STUDIO_ENDPOINT || "";


// async function compareArrayBuffers(file) {
//   const buffer1 = await file.arrayBuffer();
//   const buffer2 = await new Blob([file], { type: file.type }).arrayBuffer();
//   // const buffer2 = await new File([file], file.name).arrayBuffer();

//   // Convert ArrayBuffers to Uint8Array for easy comparison
//   const array1 = new Uint8Array(buffer1);
//   const array2 = new Uint8Array(buffer2);

//   if (array1.length !== array2.length) {
//     console.log('ArrayBuffers have different lengths:', array1.length, array2.length);
//     return;
//   }

//   // Compare byte by byte
//   let identical = true;
//   for (let i = 0; i < array1.length; i++) {
//     if (array1[i] !== array2[i]) {
//       console.log(`Difference found at index ${i}: ${array1[i]} !== ${array2[i]}`);
//       identical = false;
//     }
//   }

//   if (identical) {
//     console.log('The content of the two ArrayBuffers is identical.');
//   } else {
//     console.log('The content of the two ArrayBuffers differs.');
//   }
// }



export async function POST(request: NextRequest) {

  try {
    // const formData = new FormData();
    const formData = await request.formData();
    console.log("formData ", formData);
    // const src = "path/to/file.png";
    // const file = fs.createReadStream(src);
    // formData.append("file", file);

    const file: File = formData.get("image") as File;
    console.log("image ", file);

    if (!file) {
      return NextResponse.json({ error: 'Valid file image is required' }, { status: 400 });
    }

    const form = new FormData();
    form.append('file', file);

    const pinataMetadata = JSON.stringify({
      name: file.name,
    });
    form.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    form.append("pinataOptions", pinataOptions);
    console.log(form);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`
      },
      body: form,
    });

    const resData = await res.json();
    console.log(resData);

    return NextResponse.json({ 'response': resData, 'status': 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
        { 'error': "Internal Server Error" },
        { 'status': 500 }
    );
  }
}
// export async function POST(request: NextRequest) {

//   try {
//     // const formData = new FormData();
//     const formData = await request.formData();
//     console.log("formData ", formData);
//     // const src = "path/to/file.png";
//     // const file = fs.createReadStream(src);
//     // formData.append("file", file);

//     const file: File = formData.get("image") as File;
//     console.log("image ", file);

//     if (!file) {
//       return NextResponse.json({ error: 'Valid file image is required' }, { status: 400 });
//     }

//     const form = new FormData();
//     form.append('file', file);

//     const pinataMetadata = JSON.stringify({
//       name: file.name,
//     });
//     form.append("pinataMetadata", pinataMetadata);

//     const pinataOptions = JSON.stringify({
//       cidVersion: 1,
//     });
//     form.append("pinataOptions", pinataOptions);
//     // console.log(form);

//     const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.PINATA_JWT}`
//       },
//       body: form,
//     });

//     const resData = await res.json();
//     console.log(resData);

//     const cid1 = CID.parse("bafybeidh6bhadr4csigx4tbafgslniuarvxas734oqsefaywdwn32vffp4");

//     // Get codec and hash function details
//     console.log('CID1 Details:', {
//       version: cid1.version,
//       codec: cid1.code,
//       hash: cid1.multihash
//     });

//     const fileBlob = new Blob([file], { type: file.type });
//     // console.log(await file.arrayBuffer());
//     // console.log(await new File([fileBlob], file.name).arrayBuffer());
//     // console.log(await file.arrayBuffer() === await new File([fileBlob], file.name).arrayBuffer());
//     // compareArrayBuffers(file);

//     const unit8array2 = new Uint8Array(await file.arrayBuffer());

//     // const bytes2 = raw.encode(unit8array2)
//     // const bytes2 = dagPB.encode(unit8array2);
//     const bytes2 = dagPB.encode({
//       Data: unit8array2,
//       Links: []
//     })

//     const hash2 = await sha256.digest(bytes2)

//     const cid2 = CID.create(1, dagPB.code, hash2)
//     console.log(cid2.toString())

//     console.log('predet CID2 Details:', {
//       version: cid2.version,
//       codec: cid2.code,
//       hash: {
//         code: hash2.code,
//         size: hash2.size,
//         digest: Array.from(hash2.digest),
//         bytes: Array.from(hash2.bytes)
//       }
//     });

//     return NextResponse.json({ 'response': resData, 'status': 200 });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//         { 'error': "Internal Server Error" },
//         { 'status': 500 }
//     );
//   }
// }


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
  
      const file = await pinata.gateways.get(cid);
  
      return NextResponse.json({ response: file });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to retrieve Merkle tree' }, { status: 500 });
    }
}


// SE RISPONDONO, PROBABILMENTE USARE predeterminingCid ANCHE PER IMAGE
export async function DELETE(request: NextRequest) {

  try {
    console.log(request);
    // const cid = await request.json();
    // console.log("JSON data: ", cid);

    const cid: string =  await request.json() as string;
    console.log("delete cid ", cid);

    const res = await fetch("https://api.pinata.cloud/pinning/unpin/" + cid, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`
      },
    });
    console.log(res);
    // const resData = await res.json();
    // console.log(resData);

    return NextResponse.json({ 'response': res ,  'status': 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
        { 'error': "Internal Server Error" },
        { 'status': 500 }
    );
  }
}