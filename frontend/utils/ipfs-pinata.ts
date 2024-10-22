import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import { sha256 } from 'multiformats/hashes/sha2'

import axios from 'axios';


export async function preDetermineCID() {
    try {
      const text = "Hello World!";
      const blob = new Blob([text], { type: "text/plain" });
      const unit8array = new Uint8Array(await blob.arrayBuffer());
      const bytes = raw.encode(unit8array)
      const hash = await sha256.digest(bytes)
      const cid = CID.create(1, raw.code, hash)
    } catch(error) {
      console.log(error)
    }
}


export async function getIPFSContent(uri: string) {
    let response = undefined;
    try {
        const url = `https://gateway.pinata.cloud/ipfs/${uri}`;
        response = await axios.get(url, { responseType: 'stream' });
    } 
    catch (error) {
        console.error('Error retrieving file: ', error);
    }

    return response;
}