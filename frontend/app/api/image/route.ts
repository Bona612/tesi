import { NextResponse, NextRequest } from "next/server";

export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5

import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL!,
});


const SUBGRAPH_STUDIO_ENDPOINT = process.env.SUBGRAPH_STUDIO_ENDPOINT || "";


export async function POST(request: NextRequest) {

  try {
    const formData = await request.formData();

    const file: File = formData.get("image") as File;

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

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`
      },
      body: form,
    });

    const resData = await res.json();

    return NextResponse.json({ 'response': resData, 'status': 200 });
  } 
  catch (error) {
    console.log(error);
    return NextResponse.json(
        { 'error': "Internal Server Error" },
        { 'status': 500 }
    );
  }
}


export async function GET(request: NextRequest) {
    try {
      // Parse the URL to get query parameters
      const url = new URL(request.url);
      const cid = url.searchParams.get('CID');
  
      // Validate that anchor is provided and is a string
      if (typeof cid !== 'string') {
        return NextResponse.json({ error: 'Valid CID parameter is required' }, { status: 400 });
      }
  
      const file = await pinata.gateways.get(cid);
  
      return NextResponse.json({ response: file });
    } 
    catch (error) {
      return NextResponse.json({ error: 'Failed to retrieve Merkle tree' }, { status: 500 });
    }
}


// SE RISPONDONO, PROBABILMENTE USARE predeterminingCid ANCHE PER IMAGE
export async function DELETE(request: NextRequest) {

  try {
    const cid: string =  await request.json() as string;

    const res = await fetch("https://api.pinata.cloud/pinning/unpin/" + cid, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`
      },
    });

    return NextResponse.json({ 'response': res ,  'status': 200 });
  } 
  catch (error) {
    return NextResponse.json(
        { 'error': "Internal Server Error" },
        { 'status': 500 }
    );
  }
}