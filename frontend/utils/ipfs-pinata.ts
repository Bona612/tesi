import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import { sha256 } from 'multiformats/hashes/sha2'

import axios from 'axios';

import { Tag, Owner, NFT, Metadata }from "@/types/index";


export async function preDetermineCID() {
    try {
      const text = "Hello World!";
      const blob = new Blob([text], { type: "text/plain" });
      const unit8array = new Uint8Array(await blob.arrayBuffer());
      const bytes = raw.encode(unit8array)
      const hash = await sha256.digest(bytes)
      const cid = CID.create(1, raw.code, hash)
       console.log(cid.toString())
    } catch(error) {
      console.log(error)
    }
}


export async function getIPFSContent(uri: string) {
    let response = undefined;
    try {
        console.log(uri);
        const url = `https://gateway.pinata.cloud/ipfs/${uri}`;
        response = await axios.get(url, { responseType: 'stream' });
        console.log("response: ", response)

        // // Save the file locally
        // const writer = fs.createWriteStream('./downloadedFile');
        // response.data.pipe(writer);

        // writer.on('finish', () => {
        //     console.log('File downloaded successfully');
        // });

        // writer.on('error', (error) => {
        //     console.error('Error downloading file:', error);
        // });
    } catch (error) {
        console.error('Error retrieving file: ', error);
    }

    return response;
}