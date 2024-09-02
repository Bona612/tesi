import { BigInt, ethereum, store, dataSource, json, Bytes } from '@graphprotocol/graph-ts';
import {
  ERC6956Full,
  AnchorTransfer as AnchorTransferEvent,
} 
from '../generated/ERC6956Full/ERC6956Full';
import {
  NFTMarketplace,
  ItemListed as ItemListedEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemBought as ItemBoughtEvent,
  ItemRedeemed as ItemRedeemedEvent
} 
from "../generated/NFTMarketplace/NFTMarketplace"
import { Token, Owner, Transaction, TokenMetadata } from '../generated/schema';
import { TokenMetadata as TokenMetadataTemplate } from '../generated/templates'



export function handleMetadata(content: Bytes): void {
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
      tokenMetadata.tags = tags.toArray().map<string>((tag, index) => tag.toString());
      tokenMetadata.description = description.toString()
    }

    tokenMetadata.save()
  }
}


export function handleAnchorTransfer(event: AnchorTransferEvent): void {
  let tokenId = event.params.tokenId.toString();
  let token = Token.load(tokenId);
  let transactionId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let transaction = new Transaction(transactionId);

  if (!token) {
    token = new Token(tokenId);
    token.anchor = event.params.anchor.toHex();
    token.metadata =  event.params.cid;

    TokenMetadataTemplate.create(event.params.cid)

    token.isListed = false;
    token.listingPrice = BigInt.fromI32(0);

    
    transaction.from = event.params.from.toString();
    transaction.to = event.params.to.toString();
    transaction.token = event.params.tokenId.toString();

    transaction.timestamp = event.block.timestamp;
    transaction.save();

    let trans = token.transactions.load()
    trans.push(transaction);
  }

  // Load or create the new Owner entity
  let newOwner = Owner.load(event.params.to.toHexString());
  if (!newOwner) {
    newOwner = new Owner(event.params.to.toHexString());
  }
  newOwner.save();

  // Load or create the previous Owner entity
  // DOVREBBE ESSERE INUTILE PERCHè IL PRECEDENTE owner DOVREBBE ESSERE GIà PRESENTE
  let prevOwner = Owner.load(event.params.from.toHexString());
  if (!prevOwner) {
    prevOwner = new Owner(event.params.from.toHexString());
  }
  prevOwner.save();

  token.owner = event.params.to.toHexString();

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
    // token.owner = event.params.buyer.toString();
    token.toRedeem = false;
    token.save();

    // let transaction = new Transaction(event.transaction.hash.toHex());
    // if (transaction) {
    //   transaction.from = event.params.seller.toString();
    //   transaction.to = event.params.buyer.toString();
    //   transaction.token = event.params.tokenId.toString();
    //   transaction.timestamp = event.block.timestamp;
    //   transaction.save();

    //   let newOwner = Owner.load(event.params.buyer.toHex());
    //   if (newOwner) {
    //     newOwner.nfts = newOwner.nfts + token
    //     newOwner.transactions = newOwner.transactions + transaction
    //     newOwner.save();
    //   }
      
    //   let prevOwner = Owner.load(event.params.from.toHex());
    //   if (prevOwner) {
    //     prevOwner.nfts = prevOwner.nfts - token
    //     prevOwner.transactionsReceived = prevOwner.transactionsReceived + transaction
    //     prevOwner.save();
    //   }
    // }
  }
}