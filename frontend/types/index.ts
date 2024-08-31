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
  { name: 'name', label: 'Name' },
  { name: 'date', label: 'Date' },
  { name: 'popularity', label: 'Popularity' }
  // Add other OrderBy objects as needed
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
  from: string,
  to: string,
  token: NFT,
  timestamp: number,
}

export type NFT = {
  id: string,
  tokenId: number,
  anchor: string,
  metadata: Metadata,
  // tags: Tag[],
  owner: NFT_Owner,
  isListed: boolean,
  listingPrice: bigint,
  transactions: Transaction[],
}

export type NFTtokens = {
  tokens: NFT[]
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

export interface NFTtokensVariables {
  skip: number,
  first: number,
  tags: Tag[] | null,
}

// PROBABILMENTE QUI tags  DOVRà CAMBIARE IN where_tags
export interface tokenSearchVariables {
  text: string,
  skip: number,
  first: number,
  tags: Tag[] | null,
}

export type Where_Tags = {
  tags: Tag[]
}

export interface ownerVariables {
  id: string,
  skip: number,
  first: number,
  where_tags: Where_Tags,
}

// QUI HO CONTROLLATO, BASTA USARE owner: address VISTO CHE ID == ADDRESS
export type Where_Token_Owner_Address = {
  address: String
}
export type Where_Token_Owner = {
  owner_: Where_Token_Owner_Address
}

// PROBABILMENTE QUI, NON SERVIRà SOLO owner_, MA ANCHE tags IN QUALCHE MODO
// PROBABILMENTE SERVIRà FARE SI CHE tags SIA OPZIONALE
export interface tokenOwnerVariables {
  id: string,
  skip: number,
  first: number,
  where_token_owner: Where_Token_Owner,
}

export type Attestation = {
  to: string;
  anchor: string;
  attestationTime: number;
  validStartTime: number;
  validEndTime: number;
}

export enum Token_orderBy {
  id,
  tokenId,
  anchor,
  metadataURI,
  tags,
  owner,
  owner__id,
  owner__address,
  transactions,
}
