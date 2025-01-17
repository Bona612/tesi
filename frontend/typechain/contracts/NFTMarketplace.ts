/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface NFTMarketplaceInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "buyItem"
      | "cancelListing"
      | "listItem"
      | "owner"
      | "redeemItem(address,uint256,bytes,bytes)"
      | "redeemItem(address,uint256,bytes)"
      | "renounceOwnership"
      | "transferOwnership"
      | "updateListing"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "ItemBought"
      | "ItemCanceled"
      | "ItemListed"
      | "ItemRedeemed"
      | "OwnershipTransferred"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "buyItem",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "cancelListing",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "listItem",
    values: [AddressLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "redeemItem(address,uint256,bytes,bytes)",
    values: [AddressLike, BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "redeemItem(address,uint256,bytes)",
    values: [AddressLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateListing",
    values: [AddressLike, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "buyItem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "cancelListing",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "listItem", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "redeemItem(address,uint256,bytes,bytes)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "redeemItem(address,uint256,bytes)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateListing",
    data: BytesLike
  ): Result;
}

export namespace ItemBoughtEvent {
  export type InputTuple = [
    nftAddress: AddressLike,
    tokenId: BigNumberish,
    buyer: AddressLike,
    price: BigNumberish
  ];
  export type OutputTuple = [
    nftAddress: string,
    tokenId: bigint,
    buyer: string,
    price: bigint
  ];
  export interface OutputObject {
    nftAddress: string;
    tokenId: bigint;
    buyer: string;
    price: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ItemCanceledEvent {
  export type InputTuple = [
    nftAddress: AddressLike,
    tokenId: BigNumberish,
    seller: AddressLike
  ];
  export type OutputTuple = [
    nftAddress: string,
    tokenId: bigint,
    seller: string
  ];
  export interface OutputObject {
    nftAddress: string;
    tokenId: bigint;
    seller: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ItemListedEvent {
  export type InputTuple = [
    nftAddress: AddressLike,
    tokenId: BigNumberish,
    seller: AddressLike,
    price: BigNumberish
  ];
  export type OutputTuple = [
    nftAddress: string,
    tokenId: bigint,
    seller: string,
    price: bigint
  ];
  export interface OutputObject {
    nftAddress: string;
    tokenId: bigint;
    seller: string;
    price: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ItemRedeemedEvent {
  export type InputTuple = [
    nftAddress: AddressLike,
    tokenId: BigNumberish,
    buyer: AddressLike
  ];
  export type OutputTuple = [
    nftAddress: string,
    tokenId: bigint,
    buyer: string
  ];
  export interface OutputObject {
    nftAddress: string;
    tokenId: bigint;
    buyer: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface NFTMarketplace extends BaseContract {
  connect(runner?: ContractRunner | null): NFTMarketplace;
  waitForDeployment(): Promise<this>;

  interface: NFTMarketplaceInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  buyItem: TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish],
    [void],
    "payable"
  >;

  cancelListing: TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  listItem: TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish, price: BigNumberish],
    [void],
    "nonpayable"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  "redeemItem(address,uint256,bytes,bytes)": TypedContractMethod<
    [
      nftAddress: AddressLike,
      tokenId: BigNumberish,
      attestation: BytesLike,
      data: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  "redeemItem(address,uint256,bytes)": TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish, attestation: BytesLike],
    [void],
    "nonpayable"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  updateListing: TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish, newPrice: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "buyItem"
  ): TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "cancelListing"
  ): TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "listItem"
  ): TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish, price: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "redeemItem(address,uint256,bytes,bytes)"
  ): TypedContractMethod<
    [
      nftAddress: AddressLike,
      tokenId: BigNumberish,
      attestation: BytesLike,
      data: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "redeemItem(address,uint256,bytes)"
  ): TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish, attestation: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateListing"
  ): TypedContractMethod<
    [nftAddress: AddressLike, tokenId: BigNumberish, newPrice: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "ItemBought"
  ): TypedContractEvent<
    ItemBoughtEvent.InputTuple,
    ItemBoughtEvent.OutputTuple,
    ItemBoughtEvent.OutputObject
  >;
  getEvent(
    key: "ItemCanceled"
  ): TypedContractEvent<
    ItemCanceledEvent.InputTuple,
    ItemCanceledEvent.OutputTuple,
    ItemCanceledEvent.OutputObject
  >;
  getEvent(
    key: "ItemListed"
  ): TypedContractEvent<
    ItemListedEvent.InputTuple,
    ItemListedEvent.OutputTuple,
    ItemListedEvent.OutputObject
  >;
  getEvent(
    key: "ItemRedeemed"
  ): TypedContractEvent<
    ItemRedeemedEvent.InputTuple,
    ItemRedeemedEvent.OutputTuple,
    ItemRedeemedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;

  filters: {
    "ItemBought(address,uint256,address,uint256)": TypedContractEvent<
      ItemBoughtEvent.InputTuple,
      ItemBoughtEvent.OutputTuple,
      ItemBoughtEvent.OutputObject
    >;
    ItemBought: TypedContractEvent<
      ItemBoughtEvent.InputTuple,
      ItemBoughtEvent.OutputTuple,
      ItemBoughtEvent.OutputObject
    >;

    "ItemCanceled(address,uint256,address)": TypedContractEvent<
      ItemCanceledEvent.InputTuple,
      ItemCanceledEvent.OutputTuple,
      ItemCanceledEvent.OutputObject
    >;
    ItemCanceled: TypedContractEvent<
      ItemCanceledEvent.InputTuple,
      ItemCanceledEvent.OutputTuple,
      ItemCanceledEvent.OutputObject
    >;

    "ItemListed(address,uint256,address,uint256)": TypedContractEvent<
      ItemListedEvent.InputTuple,
      ItemListedEvent.OutputTuple,
      ItemListedEvent.OutputObject
    >;
    ItemListed: TypedContractEvent<
      ItemListedEvent.InputTuple,
      ItemListedEvent.OutputTuple,
      ItemListedEvent.OutputObject
    >;

    "ItemRedeemed(address,uint256,address)": TypedContractEvent<
      ItemRedeemedEvent.InputTuple,
      ItemRedeemedEvent.OutputTuple,
      ItemRedeemedEvent.OutputObject
    >;
    ItemRedeemed: TypedContractEvent<
      ItemRedeemedEvent.InputTuple,
      ItemRedeemedEvent.OutputTuple,
      ItemRedeemedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
  };
}
