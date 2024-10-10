import { Tag } from "lucide-react";

// WHY NOT, MAYBE ALSO ICON
export type Page = {
  title: string;
  smallTitle: string,
  href: string;
};
export const PAGES: Page[] = [
  {
      title: "Marketplace",
      smallTitle: "Market",
      href: "/marketplace"
  },
  {
      title: "My NFTs",
      smallTitle: "My NFTs",
      href: "/my-nft"
  },
  {
      title: "Create NFT",
      smallTitle: "Create",
      href: "/nft-creation"
  },
  {
      title: "Redeem NFT",
      smallTitle: "Redeem",
      href: "/redeem"
  },
]


// Define the Tag type as a union of string literals
export type Tag = 'Tag 1' | 'Tag 2' | 'Tag 3' | 'Tag 4';

// Define the immutable list of tags
export const zod_TAGS = [
  'Tag 1',
  'Tag 2',
  'Tag 3',
  'Tag 4',
] as const;
export const TAGS = zod_TAGS as readonly Tag[];

// export type OrderBy_by = 'name';
export type OrderBy = {
  name: string,
  label: string,
};
export const orderByOptions: OrderBy[] = [
  { name: 'id', label: 'id' },
];
export enum OrderDirectionEnum {
  asc = 0,
  desc = 1,
}
export type OrderDirection = OrderDirectionEnum;



export type MetadataEntity = {
  id: string,
  title: string,
  description: string,
  imageURI: string,
  tags: Tag[],
}
export type Metadata = {
  title: string,
  description: string,
  imageURI: string,
  tags: Tag[],
}

export type Transaction = {
  id: string,
  from: Owner,
  to: Owner,
  token: NFT,
  timestamp: bigint,
}

export type token_NFT = {
  token: NFT
}
export type NFT = {
  id: string,
  anchor: string,
  metadataURI: string,
  metadata: Metadata,
  owner: NFT_Owner,
  isListed: boolean,
  listingPrice: bigint,
  toRedeem: boolean,
  transactions: Transaction[],
}

export type Metadata_e = {
  id: string,
  title: string,
  description: string,
  imageURI: string,
  tags: Tag[],
}
export type Metadatas = {
  tokenMetadata_collection: Metadata_e[]
}


export type NFTtokens = {
  tokens: NFT[]
}
export type OwnerNFTtokens = {
  owner: {
    id: string,
    nfts: NFT[]
  }
}

export type NFT_Owner = {
  id: string,
  // address: string,
}
export type Owner = {
  id: string,
  // address: string,
  nfts: NFT[],
}

export type Data_Owner = {
  owner: Owner
}

export interface NFTtokenVariables {
  id: string,
}
export type Where_Token = {
  id: string
}
export interface NFTtokenFromOwnerVariables {
  id: string,
  where_token: Where_Token
}


export interface Where_Marketplace {
  isListed: Boolean,
  metadata_: Where_Tags
}
export interface NFTtokensVariables {
  skip: number,
  first: number,
  where_marketplace: Where_Marketplace,
  orderBy: string,
  orderDirection: string,
}

// PROBABILMENTE QUI tags  DOVRà CAMBIARE IN where_tags
export interface tokenSearchVariables {
  text: string,
  skip: number,
  first: number,
  where_marketplace: Where_Marketplace
}



export type Where_Token_Metadata = {
  title_contains_nocase: string,
  tags_contains: Tag[]
}
export type Where_Metadata = {
  metadata_: Where_Token_Metadata
}

export type Where_Owner_Id = {
  id: string
}
export type Where_Tags = {
  tags_contains: Tag[]
}

export type Where_Token_Owner = {
  owner_: Where_Owner_Id,
  metadata_: Where_Token_Metadata
}
export type Where_Token_Owner_Redeem = {
  toRedeem: boolean,
  owner_: Where_Owner_Id,
  metadata_: Where_Tags
}
export type Where_Token_Redeem = {
  toRedeem: boolean,
  metadata_: Where_Tags
}


export interface ownerVariables {
  id: string,
  skip: number,
  first: number,
  where_metadata: Where_Metadata,
  orderBy: string,
  orderDirection: string,
}
export interface searchOwnerVariables {
  text: string,
  id: string,
  skip: number,
  first: number,
  where_token_owner: Where_Token_Owner
  orderBy: string,
  orderDirection: string,
}

// QUI HO CONTROLLATO, BASTA USARE owner: address VISTO CHE ID == ADDRESS
export type Where_Owner_Address = {
  id: string
}


// PROBABILMENTE QUI, NON SERVIRà SOLO owner_, MA ANCHE tags IN QUALCHE MODO
// PROBABILMENTE SERVIRà FARE SI CHE tags SIA OPZIONALE
export interface tokenOwnerVariables {
  id: string,
  skip: number,
  first: number,
  where_token_redeem: Where_Token_Redeem,
  orderBy: string,
  orderDirection: string,
}
export interface tokenOwnerSearchVariables {
  text: string,
  skip: number,
  first: number,
  where_token_owner: Where_Token_Owner
}

export type Attestation = {
  to: string;
  anchor: string;
}
export type Anchor = {
  anchor: string;
}

export enum Token_orderBy {
  id,
  anchor,
  metadataURI,
  tags,
  owner,
  owner__id,
  transactions
}
