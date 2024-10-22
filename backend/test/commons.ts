import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

// With TypeChain this step can be done programmatically
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { createHash } from "crypto";
import { ethers, keccak256 } from "ethers";
import hre from "hardhat";



// NULLADDR setting
export const NULLADDR = ethers.ZeroAddress;

// Interaces Id computation
// Identifer already computed
export const IERC6956ValidAnchorsInterfaceId = ethers.toBeHex("0x051c9bd8");
export const IERC6956FloatableInterfaceId = ethers.toBeHex("0xf82773f7");
// /// without createAttestation
// export const IERC6956InterfaceId = ethers.toBeHex("0xa9cf7635");
/// with createAttestation
export const IERC6956InterfaceId = ethers.toBeHex("0xf3cdf0f3");
export const IERC6956AttestationLimitedInterfaceId = ethers.toBeHex("0x75a2e933");



export const enum ERC6956Authorization {
  NONE,               // = 0,      // None of the above
  OWNER,              // = (1<<OWNER), // The owner of the token, i.e. the digital representation
  ISSUER,             // = (1<<ISSUER), // The issuer of the tokens, i.e. this smart contract
  ASSET,              // = (1<<ASSET), // The asset, i.e. via attestation
  OWNER_AND_ISSUER,   // = (1<<OWNER) | (1<<ISSUER),
  OWNER_AND_ASSET,    // = (1<<OWNER) | (1<<ASSET),
  ASSET_AND_ISSUER,   // = (1<<ASSET) | (1<<ISSUER),
  ALL                 // = (1<<OWNER) | (1<<ISSUER) | (1<<ASSET) // Owner + Issuer + Asset
}

export const enum AttestedTransferLimitUpdatePolicy {
  IMMUTABLE,
  INCREASE_ONLY,
  DECREASE_ONLY,
  FLEXIBLE
}

export const enum ERC6956Role {
    OWNER,  // =0, The owner of the digital token
    ISSUER, // =1, The issuer (contract) of the tokens, typically represented through a MAINTAINER_ROLE, the contract owner etc.
    ASSET,  // =2, The asset identified by the anchor
    INVALID // =3, Reserved, do not use.
}


export async function createAttestation(to: string, anchor: string, oracle: HardhatEthersSigner, validStartTime: number = 0) {
    // #################################### ACCOUNTS
  // Alice shall get the NFT, oracle signs the attestation off-chain 
  // Oracle needs to be a trusted Oracle of the smart-contract that shall accept the generated attestation
//   const [alice, oracle] = await hre.ethers.getSigners();

  // #################################### CREATE AN ATTESTATION

  const attestationTime = Math.floor(Date.now() / 1000.0); // Now in seconds UTC
  const validEndTime = attestationTime + validStartTime + 15 * 60; // 15 minutes valid from attestation

  const messageHash = hre.ethers.solidityPackedKeccak256(
    ["address", "bytes32", "uint256", 'uint256', "uint256"], 
    [to, anchor, attestationTime, validStartTime, validEndTime]
  );
  
  const sig = await oracle.signMessage(hre.ethers.getBytes(messageHash));

  return hre.ethers.AbiCoder.defaultAbiCoder().encode(
    ['address', 'bytes32', 'uint256', 'uint256', 'uint256', 'bytes'], 
    [to, anchor, attestationTime, validStartTime, validEndTime, sig]
  );
}

export async function createAttestation2(to: string, anchor: string, oracle: HardhatEthersSigner, validStartTime: number = 0) {
  // #################################### ACCOUNTS
  // Alice shall get the NFT, oracle signs the attestation off-chain 
  // Oracle needs to be a trusted Oracle of the smart-contract that shall accept the generated attestation
  //   const [alice, oracle] = await hre.ethers.getSigners();

  // #################################### CREATE AN ATTESTATION

  const attestationTime = Math.floor(Date.now() / 1000.0); // Now in seconds UTC
  const validEndTime = attestationTime + validStartTime + 15 * 60; // 15 minutes valid from attestation

  const messageHash = hre.ethers.solidityPackedKeccak256(
    ["address", "bytes32", "uint256", 'uint256', "uint256"], 
    [to, anchor, attestationTime, validStartTime, validEndTime]
  );
  
  const sig = await oracle.signMessage(hre.ethers.getBytes(messageHash));

  return hre.ethers.AbiCoder.defaultAbiCoder().encode(
    ['address', 'bytes32', 'uint256', 'uint256', 'uint256', 'bytes'], 
    [to, anchor, attestationTime, validStartTime, validEndTime, sig]
  );
}

// non so se vanno ritornati due valori invece di uno
export async function createAttestationWithData(to: string, anchor: string, oracle: HardhatEthersSigner, merkleTree: StandardMerkleTree<string[]>, validStartTime: number = 0) {
    // #################################### ACCOUNTS
  // Alice shall get the NFT, oracle signs the attestation off-chain 
  // Oracle needs to be a trusted Oracle of the smart-contract that shall accept the generated attestation
//   const [alice, oracle] = await hre.ethers.getSigners();

  // #################################### CREATE AN ATTESTATION


  const attestationTime = Math.floor(Date.now() / 1000.0); // Now in seconds UTC
  const validEndTime = attestationTime + validStartTime + 15 * 60; // 15 minutes valid from attestation

  const messageHash = hre.ethers.solidityPackedKeccak256(
    ["address", "bytes32", "uint256", 'uint256', "uint256"], 
    [to, anchor, attestationTime, validStartTime, validEndTime]
  );
  const sig = await oracle.signMessage(hre.ethers.getBytes(messageHash));

  const proof = merkleTree.getProof([anchor]);

  return [hre.ethers.AbiCoder.defaultAbiCoder().encode(
    ['address', 'bytes32', 'uint256', 'uint256', 'uint256', 'bytes'], 
    [to, anchor, attestationTime,  validStartTime, validEndTime, sig]
  ),
  hre.ethers.AbiCoder.defaultAbiCoder().encode(['bytes32[]'],
    [proof]
  )
  ];
}



// #################################### PRELIMINARIES
export const merkleTestAnchors = [
    ['0x' + createHash('sha256').update('TestAnchor123').digest('hex')],
    ['0x' + createHash('sha256').update('TestAnchor124').digest('hex')],
    ['0x' + createHash('sha256').update('TestAnchor125').digest('hex')],
    ['0x' + createHash('sha256').update('TestAnchor126').digest('hex')],
    ['0x' + createHash('sha256').update('SaltLeave').digest('hex')] // shall never be used on-chain!
];


function createInvalidAnchor() {
    const alice = '0x' + createHash('sha256').update('TestAnchor123').digest('hex').substring(0, 40);
    const bob = '0x' + createHash('sha256').update('TestAnchor124').digest('hex').substring(0, 40);
    const carl = '0x' + createHash('sha256').update('TestAnchor125').digest('hex').substring(0, 40);

    // (1)
    const values = [
        [alice, '100'],
        [bob, '200']
        ];

    // (2)
    const tree = StandardMerkleTree.of(values, ['address', 'uint256']);

    let proof = [""];
    // (2)
    for (const [i, v] of tree.entries()) {
        if (v[0] === alice) {
          // (3)
          proof = tree.getProof(i);
        }
    }

    const verified = StandardMerkleTree.verify(tree.root, ['address', 'uint'], [alice, '100'], proof);

    // Generate an invalid proof by altering a hash in the valid proof
    let invalidProof = proof;
    invalidProof[0] = '0x' + createHash('sha256').update('TestAnchor001').digest('hex').substring(0, 64);
    
    const verified_invalid = StandardMerkleTree.verify(tree.root, ['address', 'uint'], [alice, '100'], invalidProof);

    return invalidProof[0];
}

// Setting of an invalid anchor
export const invalidAnchor = createInvalidAnchor();