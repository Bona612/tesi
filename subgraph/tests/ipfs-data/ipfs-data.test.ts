import { test, assert, newMockEvent, clearStore, describe, afterAll, logDataSources, beforeEach, afterEach, logStore, dataSourceMock, readFile } from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes, DataSourceContext, ethereum, log, store, Value } from "@graphprotocol/graph-ts";
import { 
  AnchorTransfer as AnchorTransferEvent
} from "../../generated/ERC6956Full/ERC6956Full";
import { handleAnchorTransfer } from "../../src/erc-token";
import { IpfsData } from "../../generated/templates";
import { handleIpfsData } from '../../src/ipfs-data';
import { Owner, Token, TokenMetadata } from "../../generated/schema";


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


describe("Test mapping", () => { 
   
    beforeEach(() => {
      clearStore() // <-- clear the store before each test in the file
    })
  
    afterEach(() => {
      clearStore();
    })

    // Test for handleAnchorTransfer
    test("handleAnchorTransfer should create a new Token and assign an Owner, also creation of Metadata", () => {
    assert.dataSourceCount('IpfsData', 0)

    let from = Address.fromString("0x0000000000000000000000000000000000000001");
    let to = Address.fromString("0x0000000000000000000000000000000000000002");
    let anchor = Bytes.fromHexString("0x0000000000000000000000000000000000000003");
    let tokenId = BigInt.fromI32(1);
    let cid = "QmT83suxMSkV3CqBkEK7nYbJw4MYfnSxxF8JjeqPC4XZqh";

    let event = createAnchorTransferEvent(from, to, tokenId, anchor, cid);
    handleAnchorTransfer(event);

    assert.fieldEquals("Token", tokenId.toString(), "anchor", anchor.toHexString());
    assert.fieldEquals("Token", tokenId.toString(), "owner", to.toHexString());
    assert.fieldEquals("Token", tokenId.toString(), "metadata", cid);

    const token = Token.load(tokenId.toString());
    log.info("transactions: {}", [token!.transactions.load().length.toString()]);
    if (token!.transactions.load().length > 0) {
      log.info("transaction id: {}", [token!.transactions.load()[0].id]);
      assert.fieldEquals("Transaction", token!.transactions.load()[0].id, "id", event.transaction.hash.toHex() + "-" + event.logIndex.toString());
      log.info("transaction from: {}", [token!.transactions.load()[0].from]);
      assert.fieldEquals("Owner", token!.transactions.load()[0].from, "id", from.toHexString());
      log.info("transaction to: {}", [token!.transactions.load()[0].to]);
      assert.fieldEquals("Owner", token!.transactions.load()[0].to, "id", to.toHexString());
      log.info("transaction tokenID: {}", [token!.transactions.load()[0].token]);
      assert.fieldEquals("Token", token!.transactions.load()[0].token, "id", tokenId.toString());
    }
    // assert.fieldEquals("Token", tokenId.toString(), "transactions");

    assert.dataSourceCount('IpfsData', 1)

    // Now we have to mock the dataSource metadata and specifically dataSource.stringParam()
    // dataSource.stringParams actually uses the value of dataSource.address(), so we will mock the address using dataSourceMock from  matchstick-as
    // First we will reset the values and then use dataSourceMock.setAddress() to set the CID
    dataSourceMock.resetValues()
    dataSourceMock.setAddress(cid)

    // Now we need to generate the Bytes to pass to the dataSource handler
    // For this case we introduced a new function readFile, that reads a local json and returns the content as Bytes
    const content = readFile(`./data/prova.json`)
    handleIpfsData(content)

    // Now we will test if a TokenLockMetadata was created
    const metadata = TokenMetadata.load(cid)

    assert.stringEquals(metadata!.title, "titolo")
    assert.stringEquals(metadata!.description, "descrizione")
    assert.stringEquals(metadata!.imageURI, "http://localhost:5001/api/v0/QmQBTFquW63WmSD85R684fzupGZDCE9rAK5x4neLrvobh8")
    assert.stringEquals(metadata!.tags[0], "Tag 1")

    const newOwner = Owner.load(to.toHexString());
    assert.bigIntEquals(BigInt.fromI32(newOwner!.nfts.load().length), BigInt.fromI32(1))

    log.info("lunghezza: {}: [{}]", [newOwner!.nfts.load().length.toString(), newOwner!.nfts.load()[0].id]);
    log.info("lunghezza: {}, {}", [newOwner!.transactions.load().length.toString(), newOwner!.transactionsReceived.load().length.toString()]);
    assert.bigIntEquals(BigInt.fromI32(newOwner!.transactionsReceived.load().length), BigInt.fromI32(1))
    assert.bigIntEquals(BigInt.fromI32(newOwner!.transactions.load().length), BigInt.fromI32(0))

    const prevOwner = Owner.load(from.toHexString());
    assert.bigIntEquals(BigInt.fromI32(prevOwner!.nfts.load().length), BigInt.fromI32(0))

    // log.info("lunghezza: {}: [{}]", [prevOwner!.nfts.load().length.toString(), prevOwner!.nfts.load()[0].id]);
    log.info("lunghezza: {}, {}", [prevOwner!.transactions.load().length.toString(), prevOwner!.transactionsReceived.load().length.toString()]);
    assert.bigIntEquals(BigInt.fromI32(prevOwner!.transactions.load().length), BigInt.fromI32(1))
    assert.bigIntEquals(BigInt.fromI32(prevOwner!.transactionsReceived.load().length), BigInt.fromI32(0))

    assert.stringEquals(newOwner!.id, to.toHexString());
    assert.stringEquals(newOwner!.nfts.load()[0].id, tokenId.toString());
    assert.stringEquals(prevOwner!.transactions.load()[0].id, "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1");
    assert.stringEquals(newOwner!.transactionsReceived.load()[0].id, "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1");


    logStore();
    logDataSources('IpfsData');

    store.remove("Token", BigInt.fromI32(1).toString());
  });
});