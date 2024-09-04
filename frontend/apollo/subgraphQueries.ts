import { gql, TypedDocumentNode } from "@apollo/client"
import { NFTtokens, NFTtokensVariables, tokenSearchVariables, Owner, ownerVariables, Data_Owner, tokenOwnerVariables, NFT} from "@/types";

// DA RIVEDERE TUTTE LE QUERY, CON I DATI AGGIORNATI E CON I CONTROLLI SU isListed E toRedeem

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
      toRedeem
      transactions {
        id
      }
    }
  }
`;

export const GET_MARKETPLACE_NFTS: TypedDocumentNode<NFTtokens, NFTtokensVariables> = gql`
  query GetNFTs($skip: Int, $first: Int, $where_marketplace: Where_Marketplace, $orderBy: Token_orderBy, $orderDirection: OrderDirection) {
    tokens(skip: $skip, first: $first, where: $where_marketplace, orderBy: $orderBy, orderDirection: $orderDirection) {
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
      toRedeem
    }
  }
`;

export const SEARCH_MARKETPLACE_NFTS: TypedDocumentNode<NFTtokens, tokenSearchVariables> = gql`
  query SearchNFTs($text: String, $skip: Int, $first: Int, $where_marketplace: Where_Marketplace, $orderBy: Token_orderBy, $orderDirection: OrderDirection) {
    tokenSearch(text: $text, skip: $skip, first: $first, where: $where_marketplace, orderBy: $orderBy, orderDirection: $orderDirection) {
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
      toRedeem
    }
  }
`;

export const GET_OWNER_NFTS: TypedDocumentNode<Data_Owner, ownerVariables> = gql`
  query GetOwnerNFTs($id: String!, $skip: Int, $first: Int, $where_metadata: wWhere_Metadata, $orderBy: Token_orderBy, $orderDirection: OrderDirection) {
    owner(id: $id) {
      id
      nfts(skip: $skip, first: $first, where: $where_metadata, orderBy: $orderBy, orderDirection: $orderDirection) {
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
        toRedeem
      }
    }
  }
`;

export const SEARCH_OWNER_NFTS: TypedDocumentNode<NFTtokens, tokenOwnerVariables> = gql`
  query SearchOwnerNFTs($text: String, $skip: Int, $first: Int, $where_token_owner: Where_Token_Owner, $orderBy: Token_orderBy, $orderDirection: OrderDirection) {
    tokenSearch(text: $text, skip: $skip, first: $first, where: $where_token_owner, orderBy: $orderBy, orderDirection: $orderDirection) {
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
      toRedeem
    }
  }
`;

export const GET_OWNER_REDEEM_NFTS: TypedDocumentNode<Data_Owner, ownerVariables> = gql`
  query GetOwnerNFTs($id: String!, $skip: Int, $first: Int, $where_token_redeem: Where_Token_Redeem, $orderBy: Token_orderBy, $orderDirection: OrderDirection) {
    owner(id: $id) {
      id
      nfts(skip: $skip, first: $first, where: $where_token_redeem, orderBy: $orderBy, orderDirection: $orderDirection) {
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
        toRedeem
      }
    }
  }
`;

export const SEARCH_OWNER_REDEEM_NFTS: TypedDocumentNode<NFTtokens, tokenOwnerVariables> = gql`
  query SearchOwnerNFTs($text: String, $skip: Int, $first: Int, $where_token_owner_redeem: Where_Token_Owner_Redeem, $orderBy: Token_orderBy, $orderDirection: OrderDirection) {
    tokenSearch(text: $text, skip: $skip, first: $first, where: $where_token_owner_redeem, orderBy: $orderBy, orderDirection: $orderDirection) {
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
      toRedeem
    }
  }
`;