import { BigInt, DataSourceContext, log } from '@graphprotocol/graph-ts';
import {
  AnchorTransfer as AnchorTransferEvent,
} 
from '../generated/ERC6956Full/ERC6956Full';
import {
  ItemListed as ItemListedEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemBought as ItemBoughtEvent,
  ItemRedeemed as ItemRedeemedEvent
} 
from "../generated/NFTMarketplace/NFTMarketplace"
import { Token, Owner, Transaction } from '../generated/schema';
import { IpfsData } from '../generated/templates';



const ipfsHash = "QmT83suxMSkV3CqBkEK7nYbJw4MYfnSxxF8JjeqPC4XZqh";

function extractCID(uri: string): string {
  // Split the URI by '/' and get the last part
  const parts = uri.split('/');
  if (parts.length > 0) {
    // The CID should be the last part of the URI
    return parts[parts.length - 1];
  }
  return "";
}


export function handleAnchorTransfer(event: AnchorTransferEvent): void {
  log.info('Handling Anchor Transfer for Token ID: {}', [event.params.tokenId.toString()]);

  let tokenId = event.params.tokenId.toString();
  let token = Token.load(tokenId);
  let transactionId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let transaction = new Transaction(transactionId);

  if (!token) {
    token = new Token(tokenId);
    token.anchor = event.params.anchor.toHexString();
    log.info('Token anchor: {}', [token.anchor]);
    
    let cid = extractCID(event.params.cid);
    log.info('Extracted CID: {}', [cid]);

    const context = new DataSourceContext();
    context.setString('tokenId', event.params.tokenId.toString());
    IpfsData.createWithContext(cid, context);
    token.metadata = cid;

    token.isListed = false;
    token.toRedeem = false;
    token.listingPrice = BigInt.fromI32(0);
    
    transaction.from = event.params.from.toHexString();
    transaction.to = event.params.to.toHexString();
    transaction.token = event.params.tokenId.toHexString();

    transaction.timestamp = event.block.timestamp;
    transaction.save();
  }

  // Load or create the new Owner entity
  let newOwner = Owner.load(event.params.to.toHexString());
  if (!newOwner) {
    newOwner = new Owner(event.params.to.toHexString());
  }
  let tokens = newOwner.nfts.load()
  tokens.push(token);

  newOwner.save();
  log.info('New Owner: {}', [newOwner.id]);


  // Load or create the previous Owner entity
  // DOVREBBE ESSERE INUTILE PERCHè IL PRECEDENTE owner DOVREBBE ESSERE GIà PRESENTE
  let prevOwner = Owner.load(event.params.from.toHexString());
  if (!prevOwner) {
    prevOwner = new Owner(event.params.from.toHexString());
  }
  prevOwner.save();

  token.owner = event.params.to.toHexString();
  log.info('New Token Owner: {}', [token.owner]);
  token.save();
}



export function handleItemListed(event: ItemListedEvent): void {
  let token = Token.load(event.params.tokenId.toString())
  if (token) {
    token.isListed = true
    token.listingPrice = event.params.price
    token.save()
  }
}

export function handleItemBought(event: ItemBoughtEvent): void {
  let token = Token.load(event.params.tokenId.toString())
  if (token) {
    token.isListed = false;
    token.listingPrice = BigInt.fromI32(0);
    token.toRedeem = true;
    token.save()
  }
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let token = Token.load(event.params.tokenId.toString())
  if (token) {
    token.isListed = false;
    token.listingPrice = BigInt.fromI32(0);
    token.save()
  }
}


export function handleItemRedeemed(event: ItemRedeemedEvent): void {
  let token = Token.load(event.params.tokenId.toString())
  if (token) {
    token.toRedeem = false;
    token.save();
  }
}