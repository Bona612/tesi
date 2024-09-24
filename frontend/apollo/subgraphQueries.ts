import { gql, TypedDocumentNode } from "@apollo/client"
import { NFTtokens, NFTtokensVariables, tokenSearchVariables, Owner, ownerVariables, Data_Owner, tokenOwnerVariables, NFT, NFTtokenVariables, NFTtokenFromOwnerVariables, Where_Metadata, tokenOwnerSearchVariables, OwnerNFTtokens, Metadatas, Metadata_e, token_NFT, searchOwnerVariables} from "@/types";


// DA CAPIRE QUALE DELLE DUE SIA LA MIGLIORE, IN TERMINI DI PERFORMANCE E SICUREZZA
export const GET_NFT: TypedDocumentNode<token_NFT, NFTtokenVariables> = gql`
  query GetNFT($id: String) {
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

// export const SEARCH_MARKETPLACE_NFTS: TypedDocumentNode<NFTtokens, tokenSearchVariables> = gql`
//   query SearchNFTs($text: String, $skip: Int, $first: Int, $where_marketplace: Where_Marketplace) {
//     tokenSearch(text: $text, skip: $skip, first: $first, where: $where_marketplace) {
//       id
//       anchor
//       metadata {
//         id
//         title
//         description
//         tags
//         imageURI
//       }
//       owner {
//         id
//       }
//       isListed
//       listingPrice
//       toRedeem
//     }
//   }
// `;


//       where: {metadata_: { or: [{ tags_contains: ["Tag 1"] }, { tags_contains: ["Tag 2"] }] }}
export const GET_OWNER_NFTS: TypedDocumentNode<OwnerNFTtokens, ownerVariables> = gql`
  query GetOwnerNFTs($id: String, $skip: Int, $first: Int, $where_metadata: Where_Metadata, $orderBy: String, $orderDirection: String) {
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

// export const SEARCH_OWNER_NFTS: TypedDocumentNode<NFTtokens, searchOwnerVariables> = gql`
//   query SearchOwnerNFTs($text: String, $skip: Int, $first: Int, $where_token_owner: Where_Token_Owner) {
//     tokenSearch(text: $text, skip: $skip, first: $first, where: $where_token_owner) {
//       id
//       anchor
//       metadata {
//         id
//         title
//         description
//         tags
//         imageURI
//       }
//       owner {
//         id
//       }
//       isListed
//       listingPrice
//       toRedeem
//     }
//   }
// `;

export const GET_OWNER_REDEEM_NFTS: TypedDocumentNode<OwnerNFTtokens, tokenOwnerVariables> = gql`
  query GetOwnerRedeemNFTs($id: String, $skip: Int, $first: Int, $where_token_redeem: Where_Token_Redeem, $orderBy: String, $orderDirection: OrderDirection) {
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

// export const SEARCH_OWNER_REDEEM_NFTS: TypedDocumentNode<NFTtokens, tokenOwnerVariables> = gql`
//   query SearchOwnerRedeemNFTs($text: String, $skip: Int, $first: Int, $where_token_owner_redeem: Where_Token_Owner_Redeem) {
//     tokenSearch(text: $text, skip: $skip, first: $first, where: $where_token_owner_redeem) {
//       id
//       anchor
//       metadata {
//         id
//         title
//         description
//         tags
//         imageURI
//       }
//       owner {
//         id
//       }
//       isListed
//       listingPrice
//       toRedeem
//     }
//   }
// `;