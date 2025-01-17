import { gql, TypedDocumentNode } from "@apollo/client"
import { NFTtokens, NFTtokensVariables, tokenSearchVariables, Owner, ownerVariables, Data_Owner, tokenOwnerVariables, NFT, NFTtokenVariables, NFTtokenFromOwnerVariables, Where_Metadata, tokenOwnerSearchVariables, OwnerNFTtokens, Metadatas, Metadata_e, token_NFT, searchOwnerVariables} from "@/types";


export const GET_NFT: TypedDocumentNode<token_NFT, NFTtokenVariables> = gql`
  query GetNFT($id: String) {
    token(id: $id) {
      id
      anchor
      metadataURI
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
        from {
          id
        }
        to {
          id
        }
        token {
          id
        }
        timestamp
      }
    }
  }
`;
export const GET_NFT_FROM_OWNER: TypedDocumentNode<OwnerNFTtokens, NFTtokenFromOwnerVariables> = gql`
  query GetNFT2($owner_id: String, $where_token: Where_Token) {
    owner(id: $owner_id) {
      id
      nfts(where: $where_token) {
        id
        anchor
        metadataURI
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
          from {
            id
          }
          to {
            id
          }
          token {
            id
          }
          timestamp
        }
      }
    }
  }
`;

export const GET_MARKETPLACE_NFTS: TypedDocumentNode<NFTtokens, NFTtokensVariables> = gql`
  query GetNFTs($skip: Int, $first: Int, $where_marketplace: Where_Marketplace, $orderBy: String, $orderDirection: String) {
    tokens(skip: $skip, first: $first, where: $where_marketplace, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      anchor
      metadataURI
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


export const GET_OWNER_NFTS: TypedDocumentNode<OwnerNFTtokens, ownerVariables> = gql`
  query GetOwnerNFTs($id: String, $skip: Int, $first: Int, $where_metadata: Where_Metadata, $orderBy: String, $orderDirection: String) {
    owner(id: $id) {
      id
      nfts(skip: $skip, first: $first, where: $where_metadata, orderBy: $orderBy, orderDirection: $orderDirection) {
        id
        anchor
        metadataURI
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


export const GET_OWNER_REDEEM_NFTS: TypedDocumentNode<OwnerNFTtokens, tokenOwnerVariables> = gql`
  query GetOwnerRedeemNFTs($id: String, $skip: Int, $first: Int, $where_token_redeem: Where_Token_Redeem, $orderBy: String, $orderDirection: OrderDirection) {
    owner(id: $id) {
      id
      nfts(skip: $skip, first: $first, where: $where_token_redeem, orderBy: $orderBy, orderDirection: $orderDirection) {
        id
        anchor
        metadataURI
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
