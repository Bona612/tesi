// import { test, assert, newMockEvent, newMockIpfsFile } from "matchstick-as/assembly/index";
// import { Bytes, dataSource } from "@graphprotocol/graph-ts";
// import { handleIpfsData } from "../src/ipfs-data";
// import { TokenMetadata } from "../generated/schema";

// // Test for handleIpfsData
// test("handleIpfsData should store TokenMetadata with correct fields", () => {
//   let cid = "QmT83suxMSkV3CqBkEK7nYbJw4MYfnSxxF8JjeqPC4XZqh";
//   let jsonData = `
//   {
//     "title": "My NFT",
//     "description": "This is a test NFT",
//     "imageURI": "ipfs://image",
//     "tags": ["Art", "Collectible"]
//   }`;

//   // Mock IPFS file
//   newMockIpfsFile(cid, jsonData);

//   // Set context (simulates dataSource.stringParam() call)
//   dataSource.setString("tokenId", "1");

//   let content = Bytes.fromUTF8(jsonData);
//   handleIpfsData(content);

//   assert.fieldEquals("TokenMetadata", "1", "title", "My NFT");
//   assert.fieldEquals("TokenMetadata", "1", "description", "This is a test NFT");
//   assert.fieldEquals("TokenMetadata", "1", "imageURI", "ipfs://image");
//   assert.fieldEquals("TokenMetadata", "1", "tags", "[Art, Collectible]");
// });
