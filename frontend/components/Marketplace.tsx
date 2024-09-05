'use client';

import * as React from 'react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import BaseNFTBox from '@/components/BaseNFT';
import ListedNFTBox from '@/components/ListedNFT';
import ConnectButton from '@/components/ConnectButton';
// import NFTsHeader from '@/components/NFTsHeader';

// import { RelayEnvironmentProvider } from '@/components/RelayEnvironmentProvider';
import { fetchGraphQLQuery } from '@/relay/fetchGraphQLQuery';
import { graphql } from 'relay-runtime';
// import { RelayRecordMapPublisher } from '@/components/RelayRecordMapPublisher';
// import type { page_RootLayoutQuery, page_RootLayoutQuery$variables } from '@/app/marketplace/__generated__/page_RootLayoutQuery.graphql';
import ErrorBoundary from '@/components/ErrorBoundary';
import NFTsHeader from '@/components/NFTsHeader';
import { SkeletonCard } from '@/components/SkeletonCard';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

import { Suspense, useTransition  } from 'react';
import NFTList from '@/components/NFTList';

// Import everything needed to use the `useQuery` hook
import { ApolloProvider, useQuery, gql, TypedDocumentNode, useSuspenseQuery, useBackgroundQuery, useReadQuery, QueryRef, OperationVariables } from '@apollo/client';
import { GET_MARKETPLACE_NFTS } from "@/apollo/subgraphQueries"
import client from "@/lib/apollo-client";
import NFTsPagination from './NFTsPagination';
import { NFT_Owner, NFTtokens, NFTtokensVariables, Transaction } from "@/types/index";
import { bigint } from 'zod';
import { ethToWei } from '@/utils/utils';
// import { RefetchFunction } from '@apollo/client/react/hooks/useSuspenseQuery';



interface MarketplaceProps {
    first: number;
    skip: number;
    setSkip: React.Dispatch<React.SetStateAction<number>>;
    queryRef: QueryRef<NFTtokens, NFTtokensVariables>;
    isPending: boolean;
    onRefetch: () => void;
    onFetchMore: () => void;
}


const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event)
};


export default function Marketplace({ first, skip, setSkip, queryRef, onFetchMore }: MarketplaceProps) {
  // const { address, chainId, isConnected } = useWeb3ModalAccount()
  // const { walletProvider } = useWeb3ModalProvider()

  // METTERE QUESTA PARTE IN QUESTO COMPONENT, O COMUNQUE IN UN PARENT COMPONENT RISPETTO ALLA QUERY, QUESTO PER LA PAGINATION
//   const [skip, setSkip] = useState(0);
//   const first = 3;


  // let first = 3;
  // let skip = 0;
  // const variables: page_RootLayoutQuery$variables = {first: first, skip: skip}

///  Query with Suspense and Background/Read
  // const { data } = useReadQuery(queryRef);
  const data: NFTtokens = {tokens: 
    [{
      id: "1",
      anchor: "1",
      metadata: {title: "titolo", description: "descrizione", tags: ["Tag 1"], imageURI: "https://dummyimage.com/300.png/09f/fff"},
      owner: {id: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"} as NFT_Owner,
      isListed: true,
      listingPrice: ethToWei(0.01),
      transactions: [] as Transaction[],
    },
    {
      id: "2",
      anchor: "2",
      metadata: {title: "titolo", description: "descrizione", tags: ["Tag 2"], imageURI: "https://dummyimage.com/300.png/09f/fff"},
      owner: {id: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"} as NFT_Owner,
      isListed: true,
      listingPrice: BigInt(0),
      transactions: [] as Transaction[],
    },
    {
      id: "3",
      anchor: "3",
      metadata: {title: "titolo", description: "descrizione", tags: ["Tag 3"], imageURI: "https://dummyimage.com/300.png/09f/fff"},
      owner: {id: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"} as NFT_Owner,
      isListed: false,
      listingPrice: BigInt(0),
      transactions: [] as Transaction[],
    },
    {
      id: "4",
      anchor: "4",
      metadata: {title: "titolo", description: "descrizione", tags: ["Tag 4"], imageURI: "https://dummyimage.com/300.png/09f/fff"},
      owner: {id: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"} as NFT_Owner,
      isListed: true,
      listingPrice: BigInt(0),
      transactions: [] as Transaction[],
    },
    {
      id: "5",
      anchor: "5",
      metadata: {title: "titolo", description: "descrizione", tags: ["Tag 4"],imageURI: "https://dummyimage.com/300.png/09f/fff"},
      owner: {id: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"} as NFT_Owner,
      isListed: true,
      listingPrice: BigInt(0),
      transactions: [] as Transaction[],
    },
    {
      id: "2",
      anchor: "2",
      metadata: {title: "titolo", description: "descrizione", tags: ["Tag 2"], imageURI: "https://dummyimage.com/300.png/09f/fff"},
      owner: {id: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"} as NFT_Owner,
      isListed: true,
      listingPrice: BigInt(0),
      transactions: [] as Transaction[],
    },
    {
      id: "3",
      anchor: "3",
      metadata: {title: "titolo", description: "descrizione", tags: ["Tag 3"], imageURI: "https://dummyimage.com/300.png/09f/fff"},
      owner: {id: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"} as NFT_Owner,
      isListed: true,
      listingPrice: BigInt(0),
      transactions: [] as Transaction[],
    },
    {
      id: "4",
      anchor: "4",
      metadata: {title: "titolo", description: "descrizione", tags: ["Tag 4"], imageURI: "https://dummyimage.com/300.png/09f/fff"},
      owner: {id: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"} as NFT_Owner,
      isListed: true,
      listingPrice: BigInt(0),
      transactions: [] as Transaction[],
    },]
  }
  const n_tokens: number = data?.tokens?.length;
  let n_pages: number = -1;
  if (first == 0) {
    n_pages = 0;
  }
  else {
    n_pages = Math.ceil(n_tokens / first);

  }
  console.log("numero pagine calcolate: ", n_pages);
  console.log("first ", first);
//   console.log("data from read query: ", data)
//   console.log(typeof data)


//   // Memoize the fetched data
//   const memoizedData = useMemo(() => data, [data]) as NFTtokens;

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error : {error.message}</p>;

    if (data) {
      data.tokens = data?.tokens.slice(skip, skip + first)
    }

    return (
        <div>
            <div>
                <NFTList data={data} />
            </div>
            <div className="pb-4">
                <NFTsPagination n_pages={n_pages} first={first} onChange={onChange} setSkip={setSkip} onFetchMore={onFetchMore} />
            </div>
        </div>
    )
}