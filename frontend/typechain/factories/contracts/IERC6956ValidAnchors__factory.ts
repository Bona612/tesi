/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IERC6956ValidAnchors,
  IERC6956ValidAnchorsInterface,
} from "../../contracts/IERC6956ValidAnchors";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "anchor",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "AnchorApproval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "anchor",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "cid",
        type: "string",
      },
    ],
    name: "AnchorTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "anchor",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "attestationHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalUsedAttestationsForAnchor",
        type: "uint256",
      },
    ],
    name: "AttestationUse",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oracle",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "trusted",
        type: "bool",
      },
    ],
    name: "OracleUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "validAnchorHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "maintainer",
        type: "address",
      },
    ],
    name: "ValidAnchorsUpdate",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "anchorByToken",
    outputs: [
      {
        internalType: "bytes32",
        name: "anchor",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "anchor",
        type: "bytes32",
      },
      {
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
    ],
    name: "anchorValid",
    outputs: [
      {
        internalType: "bool",
        name: "isValid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "attestation",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "approveAnchor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "attestation",
        type: "bytes",
      },
    ],
    name: "approveAnchor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "approveAuthorization",
    outputs: [
      {
        internalType: "enum IERC6956.Authorization",
        name: "approveAuth",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "anchor",
        type: "bytes32",
      },
    ],
    name: "attestationsUsedByAnchor",
    outputs: [
      {
        internalType: "uint256",
        name: "attestationUses",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "attestation",
        type: "bytes",
      },
    ],
    name: "burnAnchor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "attestation",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "burnAnchor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "burnAuthorization",
    outputs: [
      {
        internalType: "enum IERC6956.Authorization",
        name: "burnAuth",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "attestation",
        type: "bytes",
      },
      {
        internalType: "string",
        name: "cid",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "createAnchor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "attestation",
        type: "bytes",
      },
      {
        internalType: "string",
        name: "cid",
        type: "string",
      },
    ],
    name: "createAnchor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "attestation",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "decodeAttestationIfValid",
    outputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "anchor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "attestationHash",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "anchor",
        type: "bytes32",
      },
    ],
    name: "tokenByAnchor",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "attestation",
        type: "bytes",
      },
    ],
    name: "transferAnchor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "attestation",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "transferAnchor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IERC6956ValidAnchors__factory {
  static readonly abi = _abi;
  static createInterface(): IERC6956ValidAnchorsInterface {
    return new Interface(_abi) as IERC6956ValidAnchorsInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IERC6956ValidAnchors {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as IERC6956ValidAnchors;
  }
}
