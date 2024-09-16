import fs from 'fs';
import path from 'path';
import { getValidAnchorsUtility, getValidAnchorsForMerkleTreeUtility } from "../utils/validAnchorsUtilities";


const filePath = path.resolve(process.env.DATA_FILE_PATH!);

// const dummyAnchor = "0x5f91a71cff8405364143a67fe7ff7183803bcb9e9a1c0c7ed2605970b319b028";//generateRandomAnchorHex(32);

export function removeValidAnchor(anchor: string) {
  let anchors = getValidAnchors();
  // Filter out the anchor to remove it if present
  anchors = anchors.filter(existingAnchor => existingAnchor !== anchor);
  // Write the updated list back to the file
  fs.writeFileSync(filePath, JSON.stringify(anchors, null, 2));
}

export function addValidAnchor(anchor: string) {
  let anchors = getValidAnchors();
  if (!anchors.includes(anchor)) {
    anchors.push(anchor);
    fs.writeFileSync(filePath, JSON.stringify(anchors, null, 2));
  }
}

export function getValidAnchors(): string[] {
  // if (!fs.existsSync(filePath)) return [];
  // const data = fs.readFileSync(filePath, 'utf-8');
  // return JSON.parse(data);
  return getValidAnchorsUtility();
}

export function getValidAnchorsForMerkleTree(): string[][] {
  // console.log(fs.existsSync(filePath));
  // if (!fs.existsSync(filePath)) return [];
  // console.log("qui c'è");
  // const data = fs.readFileSync(filePath, 'utf-8');
  // const anchors: string[] = JSON.parse(data);
  // console.log("file letto");
  // const anchorsForMerkleTree = anchors.map(anchor => [anchor]);
  // console.log(anchorsForMerkleTree);
  // // Convert each string to an array containing that string
  // return anchorsForMerkleTree;
  return getValidAnchorsForMerkleTreeUtility();
}