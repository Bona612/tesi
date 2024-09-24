import { test, assert, newMockEvent, clearStore, describe, afterAll, logDataSources, beforeEach, afterEach, logStore, dataSourceMock, readFile } from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes, DataSourceContext, ethereum, log, store, Value } from "@graphprotocol/graph-ts";
import { 
  AnchorTransfer as AnchorTransferEvent
} from "../../generated/ERC6956Full/ERC6956Full";
import { 
    ItemListed as ItemListedEvent,
    ItemBought as ItemBoughtEvent,
    ItemCanceled as ItemCanceledEvent,
    ItemRedeemed as ItemRedeemedEvent
} from "../../generated/NFTMarketplace/NFTMarketplace";
import { handleAnchorTransfer, handleItemListed, handleItemBought, handleItemCanceled, handleItemRedeemed } from "../../src/erc-token";
import { Owner, Token, TokenMetadata } from "../../generated/schema";

export { handleAnchorTransfer, handleItemListed, handleItemBought, handleItemCanceled, handleItemRedeemed }

// Mock event creation helpers
function createAnchorTransferEvent(from: Address, to: Address, tokenId: BigInt, anchor: Bytes, cid: string): AnchorTransferEvent {
  let mockEvent = newMockEvent();
  let newAnchorTransferEvent = new AnchorTransferEvent(
    Address.fromString("0xf33e2937F2f2dE9bA30C8341aF93c839C7FbC58D"),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  newAnchorTransferEvent.parameters = new Array();
  newAnchorTransferEvent.parameters.push(new ethereum.EventParam("from", ethereum.Value.fromAddress(from)));
  newAnchorTransferEvent.parameters.push(new ethereum.EventParam("to", ethereum.Value.fromAddress(to)));
  newAnchorTransferEvent.parameters.push(new ethereum.EventParam("anchor", ethereum.Value.fromBytes(anchor)));
  newAnchorTransferEvent.parameters.push(new ethereum.EventParam("tokenId", ethereum.Value.fromUnsignedBigInt(tokenId)));
  newAnchorTransferEvent.parameters.push(new ethereum.EventParam("cid", ethereum.Value.fromString(cid)));

  return newAnchorTransferEvent;
}
function createItemListedEvent(nftAddress: Address, tokenId: BigInt, seller: Address, price: BigInt): ItemListedEvent {
  let mockEvent = newMockEvent();
  let newItemListedEvent = new ItemListedEvent(
    Address.fromString("0x493c27bBcB1a00273EBA71e72371aE5750cbDc8B"),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  newItemListedEvent.parameters = new Array();
  newItemListedEvent.parameters.push(new ethereum.EventParam("nftAddress", ethereum.Value.fromAddress(nftAddress)));
  newItemListedEvent.parameters.push(new ethereum.EventParam("tokenId", ethereum.Value.fromUnsignedBigInt(tokenId)));
  newItemListedEvent.parameters.push(new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller)));
  newItemListedEvent.parameters.push(new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price)));

  return newItemListedEvent;
}
function createItemCanceledEvent(nftAddress: Address, tokenId: BigInt, seller: Address): ItemCanceledEvent {
  let mockEvent = newMockEvent();
  let newItemCanceledEvent = new ItemCanceledEvent(
    Address.fromString("0x493c27bBcB1a00273EBA71e72371aE5750cbDc8B"),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  newItemCanceledEvent.parameters = new Array();
  newItemCanceledEvent.parameters.push(new ethereum.EventParam("nftAddress", ethereum.Value.fromAddress(nftAddress)));
  newItemCanceledEvent.parameters.push(new ethereum.EventParam("tokenId", ethereum.Value.fromUnsignedBigInt(tokenId)));
  newItemCanceledEvent.parameters.push(new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller)));

  return newItemCanceledEvent;
}
function createItemBoughtEvent(nftAddress: Address, tokenId: BigInt, buyer: Address, price: BigInt): ItemBoughtEvent {
  let mockEvent = newMockEvent();
  let newItemBoughtEvent = new ItemBoughtEvent(
    Address.fromString("0x493c27bBcB1a00273EBA71e72371aE5750cbDc8B"),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  newItemBoughtEvent.parameters = new Array();
  newItemBoughtEvent.parameters.push(new ethereum.EventParam("nftAddress", ethereum.Value.fromAddress(nftAddress)));
  newItemBoughtEvent.parameters.push(new ethereum.EventParam("tokenId", ethereum.Value.fromUnsignedBigInt(tokenId)));
  newItemBoughtEvent.parameters.push(new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer)));
  newItemBoughtEvent.parameters.push(new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price)));

  return newItemBoughtEvent;
}
function createItemRedeemedEvent(nftAddress: Address, tokenId: BigInt, buyer: Address): ItemRedeemedEvent {
  let mockEvent = newMockEvent();
  let newItemRedeemedEvent = new ItemRedeemedEvent(
    Address.fromString("0x493c27bBcB1a00273EBA71e72371aE5750cbDc8B"),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  newItemRedeemedEvent.parameters = new Array();
  newItemRedeemedEvent.parameters.push(new ethereum.EventParam("nftAddress", ethereum.Value.fromAddress(nftAddress)));
  newItemRedeemedEvent.parameters.push(new ethereum.EventParam("tokenId", ethereum.Value.fromUnsignedBigInt(tokenId)));
  newItemRedeemedEvent.parameters.push(new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer)));

  return newItemRedeemedEvent;
}


describe("Test mapping", () => { 
   
  beforeEach(() => {
    clearStore() // <-- clear the store before each test in the file
  })

  afterEach(() => {
    clearStore();
  })


  test("handleItemListed should list a Token in the marketplace", () => {
    let from = Address.fromString("0x0000000000000000000000000000000000000001");
    let to = Address.fromString("0x0000000000000000000000000000000000000002");
    let anchor = Bytes.fromHexString("0x0000000000000000000000000000000000000003");
    let tokenId = BigInt.fromI32(2);
    let cid = "QmT83suxMSkV3CqBkEK7nYbJw4MYfnSxxF8JjeqPC4XZqh";

    let createEvent = createAnchorTransferEvent(from, to, tokenId, anchor, cid);
    handleAnchorTransfer(createEvent);

    let nftAddress = Address.fromString("0xf33e2937F2f2dE9bA30C8341aF93c839C7FbC58D");
    let seller = to;
    let price = BigInt.fromI32(1);
    
    let listItemEvent = createItemListedEvent(nftAddress, tokenId, seller, price);
    handleItemListed(listItemEvent);
    
    const token = Token.load(tokenId.toString());
    log.info("isListed: {}", [token!.isListed.toString()]);
    assert.fieldEquals("Token", token!.id, "isListed", true.toString());
    log.info("price: {}", [token!.listingPrice.toString()]);
    assert.fieldEquals("Token", token!.id, "listingPrice", price.toString());
  });

  test("handleItemCanceled should cancel list of a Token in the marketplace", () => {
    let from = Address.fromString("0x0000000000000000000000000000000000000001");
    let to = Address.fromString("0x0000000000000000000000000000000000000002");
    let anchor = Bytes.fromHexString("0x0000000000000000000000000000000000000010");
    let tokenId = BigInt.fromI32(3);
    let cid = "QmT83suxMSkV3CqBkEK7nYbJw4MYfnSxxF8JjeqPC4XZqi";

    let createEvent = createAnchorTransferEvent(from, to, tokenId, anchor, cid);
    handleAnchorTransfer(createEvent);

    let nftAddress = Address.fromString("0xf33e2937F2f2dE9bA30C8341aF93c839C7FbC58D");
    let seller = to;
    let price = BigInt.fromI32(1);
    
    let listItemEvent = createItemListedEvent(nftAddress, tokenId, seller, price);
    handleItemListed(listItemEvent);

    let cancelItemEvent = createItemCanceledEvent(nftAddress, tokenId, seller);
    handleItemCanceled(cancelItemEvent);

    const tokenCancelled = Token.load(tokenId.toString());
    log.info("isListed: {}", [tokenCancelled!.isListed.toString()]);
    assert.fieldEquals("Token", tokenCancelled!.id, "isListed", false.toString());
    log.info("price: {}", [tokenCancelled!.listingPrice.toString()]);
    assert.fieldEquals("Token", tokenCancelled!.id, "listingPrice", BigInt.fromI32(0).toString());
  });

  test("handleItemBought should buy a Token listed in the marketplace and handleItemRedeemed should redeem a Token buyed", () => {
    let from = Address.fromString("0x0000000000000000000000000000000000000001");
    let to = Address.fromString("0x0000000000000000000000000000000000000002");
    let anchor = Bytes.fromHexString("0x0000000000000000000000000000000000000003");
    let tokenId = BigInt.fromI32(2);
    let cid = "QmT83suxMSkV3CqBkEK7nYbJw4MYfnSxxF8JjeqPC4XZqh";

    let createEvent = createAnchorTransferEvent(from, to, tokenId, anchor, cid);
    handleAnchorTransfer(createEvent);

    let nftAddress = Address.fromString("0xf33e2937F2f2dE9bA30C8341aF93c839C7FbC58D");
    let seller = to;
    let price = BigInt.fromI32(1);
    
    let listItemEvent = createItemListedEvent(nftAddress, tokenId, seller, price);
    handleItemListed(listItemEvent);
    
    const token = Token.load(tokenId.toString());
    log.info("isListed: {}", [token!.isListed.toString()]);
    assert.fieldEquals("Token", token!.id, "isListed", true.toString());
    log.info("price: {}", [token!.listingPrice.toString()]);
    assert.fieldEquals("Token", token!.id, "listingPrice", price.toString());

    let buyer = Address.fromString("0x0000000000000000000000000000000000000004");

    let buyItemEvent = createItemBoughtEvent(nftAddress, tokenId, buyer, price);
    handleItemBought(buyItemEvent);
    
    const tokenBuyed = Token.load(tokenId.toString());
    log.info("isListed: {}", [tokenBuyed!.isListed.toString()]);
    assert.fieldEquals("Token", tokenBuyed!.id, "isListed", false.toString());
    log.info("price: {}", [tokenBuyed!.listingPrice.toString()]);
    assert.fieldEquals("Token", tokenBuyed!.id, "listingPrice", BigInt.fromI32(0).toString());
    log.info("to redeem: {}", [tokenBuyed!.toRedeem.toString()]);
    assert.fieldEquals("Token", tokenBuyed!.id, "toRedeem", true.toString());

    let redeemItemEvent = createItemRedeemedEvent(nftAddress, tokenId, buyer);
    handleItemRedeemed(redeemItemEvent);
    
    const tokenRedeemed = Token.load(tokenId.toString());
    log.info("to redeem: {}", [tokenRedeemed!.toRedeem.toString()]);
    assert.fieldEquals("Token", tokenRedeemed!.id, "toRedeem", false.toString());

    let transferEvent = createAnchorTransferEvent(seller, buyer, tokenId, anchor, cid);
    handleAnchorTransfer(transferEvent);

    const tokenTransferred = Token.load(tokenId.toString());
    log.info("new owner: {}", [tokenTransferred!.owner]);
    assert.fieldEquals("Token", tokenId.toString(), "owner", buyer.toHexString());

    assert.entityCount("Token", 1);
  });
})
