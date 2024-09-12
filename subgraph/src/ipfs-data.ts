import { Bytes, dataSource, json, log } from '@graphprotocol/graph-ts';
import { TokenMetadata } from '../generated/schema';


export function handleIpfsData(content: Bytes): void {
  log.info('dentro handleTokenMetadata: {}', [dataSource.stringParam()]);

  let tokenMetadata = new TokenMetadata(dataSource.stringParam())
  const value = json.fromBytes(content).toObject()

  log.info('value key: {}', [value.entries[0].key]);
  log.info('value value: {}', [value.entries[0].value.toString()]);
  if (value) {
    const imageURI = value.get('imageURI')
    const title = value.get('title')
    const description = value.get('description')
    const tags = value.get('tags')

    log.info('Sono entrato', []);
    if (title && imageURI && description && tags) {
      tokenMetadata.title = title.toString()
      tokenMetadata.imageURI = imageURI.toString()
      tokenMetadata.description = description.toString()
      tokenMetadata.tags = tags.toArray().map<string>((tag, index) => tag.toString());
      log.info('title: {}', [tokenMetadata.title]);
      log.info('imageURI: {}', [tokenMetadata.imageURI]);
      log.info('description: {}', [tokenMetadata.description]);
      log.info('Tag[0]: {}', [tokenMetadata.tags[0]]);
    }

    tokenMetadata.save()
  }
}

