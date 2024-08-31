import { getValidAnchorsForMerkleTree } from "@/lib/valid-anchors";
import { createMerkleTree, generateMerkleProof, getMerkleTreeRoot as createMerkleTreeRoot } from "../../backend/utils/merkleTreeUtilities";
// import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

export function getMerkleTree() { // : StandardMerkleTree<string[]>
    console.log("ciao");
    const mt = createMerkleTree(getValidAnchorsForMerkleTree());
    console.log("ciao mt");
    return mt;
}

export function getMerkleTreeRoot() {
  return createMerkleTreeRoot(getMerkleTree());
}

export function getMerkleTreeProof(anchor: string) {
    const mf = generateMerkleProof(getMerkleTree(), anchor);
    console.log("altro ciao mf");
    return mf;
}