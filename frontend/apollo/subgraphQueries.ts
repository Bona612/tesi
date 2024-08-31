import { gql, TypedDocumentNode } from "@apollo/client"
import { NFTtokens, NFTtokensVariables, tokenSearchVariables, Owner, ownerVariables, Data_Owner, tokenOwnerVariables, NFT} from "@/types";


export const GET_NFT: TypedDocumentNode<NFT, NFTtokensVariables> = gql`
  query GetNFT($id: string) {
    token(id: $id) {
      id
      anchor
      metadata {
        id
        title
        description
        tags
        imageURI
      }
      owner {
        id
      }
      isListed
      listingPrice
      transactions {
        id
      }
    }
  }
`;

export const GET_NFTS: TypedDocumentNode<NFTtokens, NFTtokensVariables> = gql`
  query GetNFTs($skip: Int, $first: Int, $where_tags: Where_Tags, $orderBy: Token_orderBy, $orderDirection: OrderDirection) {
    tokens(skip: $skip, first: $first, where: $where_tags, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      anchor
      metadata {
        id
        title
        description
        tags
        imageURI
      }
      owner {
        id
      }
      isListed
      listingPrice
    }
  }
`;

export const SEARCH_NFTS: TypedDocumentNode<NFTtokens, tokenSearchVariables> = gql`
  query SearchNFTs($text: String, $skip: Int, $first: Int, $where_tags: Where_Tags) {
    tokenSearch(text: $text, skip: $skip, first: $first, where: $where_tags) {
      id
      anchor
      metadata {
        id
        title
        description
        tags
        imageURI
      }
      owner {
        id
      }
      isListed
      listingPrice
    }
  }
`;

export const GET_OWNER_NFTS: TypedDocumentNode<Data_Owner, ownerVariables> = gql`
  query GetOwnerNFTs($id: String!, $skip: Int, $first: Int, $where_tags: Where_Tags, $orderBy: Token_orderBy, $orderDirection: OrderDirection) {
    owner(id: $id) {
      id
      nfts(skip: $skip, first: $first, where: $where_tags, orderBy: $orderBy, orderDirection: $orderDirection) {
        id
        anchor
        metadata {
          id
          title
          description
          tags
          imageURI
        }
        owner {
          id
        }
        isListed
        listingPrice
      }
    }
  }
`;

/// DA RIVEDERE, PROBABILMENTE MANCA LA PARTE RELATIVA AI TAGS NEL WHERE
export const SEARCH_OWNER_NFTS: TypedDocumentNode<NFTtokens, tokenOwnerVariables> = gql`
  query SearchOwnerNFTs($text: String, $skip: Int, $first: Int, $where_token_owner: Where_Token_Owner) {
    tokenSearch(text: $text, skip: $skip, first: $first, where: $where_token_owner) {
      id
      anchor
      metadata {
        id
        title
        description
        tags
        imageURI
      }
      owner {
        id
      }
      isListed
      listingPrice
    }
  }
`;