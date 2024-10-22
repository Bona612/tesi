import { getValidAnchorsForMerkleTree } from "@/lib/valid-anchors";
import { createMerkleTree, generateMerkleProof, getMerkleTreeRoot as createMerkleTreeRoot } from "../utils/merkleTreeUtilities";

export function getMerkleTree() { // : StandardMerkleTree<string[]>
    const mt = createMerkleTree(getValidAnchorsForMerkleTree());
    return mt;
}

export function getMerkleTreeRoot() {
  return createMerkleTreeRoot(getMerkleTree());
}

export function getMerkleTreeProof(anchor: string) {
    const mf = generateMerkleProof(getMerkleTree(), anchor);
    return mf;
}