import { NextResponse, NextRequest } from "next/server";
import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import { sha256 } from 'multiformats/hashes/sha2'


export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5


async function convertToUint8Array(data: Blob | string): Promise<Uint8Array> {
  if (typeof data === 'string') {
    data = new Blob([data], { type: 'text/plain' });
  }
  
  const arrayBuffer = await data.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

async function generateCID(uint8array: Uint8Array): Promise<CID> {
  const bytes = raw.encode(uint8array);
  const hash = await sha256.digest(bytes);
  return CID.create(1, raw.code, hash);
}

async function predeterminingCIDMetadata(request: NextRequest) {
  const body = await request.json();
  const jsonString = JSON.stringify(body);

  const uint8array = await convertToUint8Array(jsonString);
  const cid = await generateCID(uint8array);

  return NextResponse.json({ cid: cid.toString() });
}

async function predeterminingCIDImage(request: NextRequest) {
  const formData = await request.formData();
  const file: File = formData.get('image') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const uint8array = await convertToUint8Array(file);

  const cid = await generateCID(uint8array);

  return NextResponse.json({ cid: cid.toString() });
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      return predeterminingCIDImage(request);
    } 
    else if (contentType.includes('application/json')) {
      return predeterminingCIDMetadata(request);
    } 
    else {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
    }
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
