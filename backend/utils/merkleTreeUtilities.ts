import { StandardMerkleTree } from "@openzeppelin/merkle-tree";


export function createMerkleTree(leaves: string[][]) {
    const merkleTree = StandardMerkleTree.of(leaves, ['bytes32'], {sortLeaves: true});
    return merkleTree;
}

export function generateMerkleProof(merkleTree: StandardMerkleTree<string[]>, anchor: string) {
    const merkleProof = merkleTree.getProof([anchor]);
    return merkleProof;
}

export function getMerkleTreeRoot(merkleTree: StandardMerkleTree<string[]>) {
    const merkleRoot = merkleTree.root;
    return merkleRoot;
}