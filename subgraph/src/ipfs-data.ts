import { Bytes, dataSource, json, log } from '@graphprotocol/graph-ts';
import { TokenMetadata } from '../generated/schema';


export function handleIpfsData(content: Bytes): void {
  let tokenMetadata = new TokenMetadata(dataSource.stringParam())
  const value = json.fromBytes(content).toObject()

  if (value) {
    const imageURI = value.get('imageURI')
    const title = value.get('title')
    const description = value.get('description')
    const tags = value.get('tags')

    if (title && imageURI && description && tags) {
      tokenMetadata.title = title.toString()
      tokenMetadata.imageURI = imageURI.toString()
      tokenMetadata.description = description.toString()
      tokenMetadata.tags = tags.toArray().map<string>((tag, index) => tag.toString());
    }

    tokenMetadata.save()
  }
}

