import fs from 'fs';
import path from 'path';
import { getValidAnchorsUtility, getValidAnchorsForMerkleTreeUtility } from "../utils/validAnchorsUtilities";


const filePath = path.resolve(process.env.DATA_FILE_PATH!);


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
  return getValidAnchorsUtility();
}

export function getValidAnchorsForMerkleTree(): string[][] {
  return getValidAnchorsForMerkleTreeUtility();
}