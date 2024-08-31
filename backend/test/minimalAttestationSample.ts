import hre from "hardhat";
import { keccak256, ecsign, toRpcSig, fromRpcSig } from 'ethereumjs-util';
import { randomBytes } from 'crypto';


// QUESTO SCRIPT SARà UTILE IN FASE DI INSERIMENTO DEL TOKEN NEL MARKETPLACE
// LA CREAZIONE VERRà FATTA TRAMITE ATTESTATION
// QUESTO SARà UN FORM NELLA PAGINA DI CREAZION NEL FRONT-END


export async function minimalAttestationSample() {
    // #################################### ACCOUNTS
  // Alice shall get the NFT, oracle signs the attestation off-chain 
  // Oracle needs to be a trusted Oracle of the smart-contract that shall accept the generated attestation
  const [alice, oracle] = await hre.ethers.getSigners();

  // #################################### CREATE AN ATTESTATION
  const to = alice.address;
  const anchor = '0x4cc52563699fb1e3333b8aab3ecf016f8fd084e6fc48edf8603d83d4c5b97536'

  const attestationTime = Math.floor(Date.now() / 1000.0); // Now in seconds UTC
  const validStartTime = 0;
  const validEndTime = attestationTime + 15 * 60; // 15 minutes valid from attestation

  const messageHash = hre.ethers.solidityPackedKeccak256(
    ["address", "bytes32", "uint256", 'uint256', "uint256"], 
    [to, anchor, attestationTime, validStartTime, validEndTime]
  );
  const sig = await oracle.signMessage(hre.ethers.getBytes(messageHash));

  return hre.ethers.AbiCoder.defaultAbiCoder().encode(
    ['address', 'bytes32', 'uint256', 'uint256', 'uint256', 'bytes'], 
    [to, anchor, attestationTime,  validStartTime, validEndTime, sig]
  );
}


export function signAttestation(attestation: { to: string, anchor: string, attestationTime: BigInteger, validStartTime: BigInteger, validEndTime: BigInteger}, privateKey: string): string {
    const messageHash = hre.ethers.solidityPackedKeccak256(
      ["address", "bytes32", "uint256", 'uint256', "uint256"],
      [attestation.to, attestation.anchor, attestation.attestationTime, attestation.validStartTime, attestation.validEndTime]
    );

    // Sign the hash with the private key
    const { v, r, s } = ecsign(Buffer.from(messageHash), Buffer.from(privateKey));

    // Concatenate r, s, v into a single string as per Ethereum's signature format
    const signature = toRpcSig(v, r, s);

    return hre.ethers.AbiCoder.defaultAbiCoder().encode(
      ['address', 'bytes32', 'uint256', 'uint256', 'uint256', 'bytes'], 
      [attestation.to, attestation.anchor, attestation.attestationTime, attestation.validStartTime, attestation.validEndTime, signature]
    );
}