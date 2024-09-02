'use client';

import * as React from 'react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import BaseNFTBox from '@/components/BaseNFT';
import ListedNFTBox from '@/components/ListedNFT';
import ConnectButton from '@/components/ConnectButton';
// import NFTsHeader from '@/components/NFTsHeader';

import { RelayEnvironmentProvider } from '@/components/RelayEnvironmentProvider';
import { fetchGraphQLQuery } from '@/relay/fetchGraphQLQuery';
import { graphql } from 'relay-runtime';
import { RelayRecordMapPublisher } from '@/components/RelayRecordMapPublisher';
// import type { page_RootLayoutQuery, page_RootLayoutQuery$variables } from '@/app/marketplace/__generated__/page_RootLayoutQuery.graphql';
import ErrorBoundary from '@/components/ErrorBoundary';
import NFTsHeader from '@/components/NFTsHeader';
import { SkeletonCard } from '@/components/SkeletonCard';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

import { Suspense, useTransition  } from 'react';
import NFTList from '@/components/NFTList';

// Import everything needed to use the `useQuery` hook
import { ApolloProvider, useQuery, gql, TypedDocumentNode, useSuspenseQuery, useBackgroundQuery, useLoadableQuery, LoadQueryFunction, OperationVariables, QueryRef } from '@apollo/client';
import { GET_NFTS, SEARCH_NFTS } from "@/apollo/subgraphQueries"
import client from "@/lib/apollo-client";
import Marketplace from '@/components/Marketplace';
import { number } from 'zod';
import { Tag, TAGS, NFTtokens, NFTtokensVariables, tokenSearchVariables, NFTtokenVariables, NFT } from "@/types";
import SuspenseGrid from './SuspenseGrid';
import { useMediaQuery, useMediaQueries } from '@/hooks/useMediaQuery';
import { FloatingButton } from './FloatingButton';
import NFTInfo from './NFTInfo';
import BackButton from './BackButton';

// import { useMediaQuery } from 'react-responsive'


// Define the type for media queries object
type MediaQueries = {
    [key: string]: MediaQueryList;
};

type NFTInfoStructureProps = {
    tokenId: string
}






export default function NFTInfoStructure({ tokenId }: NFTInfoStructureProps) {
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  // console.log(isConnected)
  // console.log(address)

  
  // const skip: number = 0
  // const [first, setFirst] = useState<number>(3);
  const [first, setFirst] = useState<number>(0);
  const [skip, setSkip] = useState<number>(0);
  // const [tagList, setTagList] = useState<Tag[] | null>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isPending, startTransition] = useTransition();


  const variables = {id: tokenId} as NFTtokenVariables

  /// DA SCOMMENTARE SOTTO
  // let [queryRef] = useBackgroundQuery(GET_NFT, {
  //   variables: variables,
  //   notifyOnNetworkStatusChange: true,
  //   pollInterval: pollInterval_ms,
  //   fetchPolicy: 'network-only', // Used for first execution
  //   nextFetchPolicy: 'cache-first', // Used for subsequent executions
  // });

  // function handleRefetch() {
  //   console.log("REFETCH")
  //   startTransition(() => {
  //     refetch({
  //       tags: selectedTags
  //     });
  //   });
  // };

  // function handleRefetchOnMediaChanged() {
  //   console.log("REFETCH with new first")
  //   startTransition(() => {
  //     refetch({
  //       first: first
  //     });
  //   });
  // };

  // function handleFetchMore() {
  //   console.log("FETCH MORE")
  //   startTransition(() => {
  //     fetchMore({
  //       variables: {
  //         skip: skip
  //       },
  //     });
  //   });
  // };

  
  // const [loadNfts, searchQueryRef] = useLoadableQuery(SEARCH_NFTS);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event)
    const inputValue = event.target.value;
    console.log(inputValue);
  
    // startTransition(() => {
    //   loadNfts({ 
    //     text: inputValue,
    //     skip: skip,
    //     first: first,
    //   } as tokenSearchVariables);
    // });

    // queryRef = searchQueryRef as QueryRef<NFTtokens, NFTtokensVariables>; // Update queryRef to point to the search query
  };


  const queryRef = [] as QueryRef<NFT, NFTtokenVariables>;
  console.log(tokenId)

  return (
    <div>
        <BackButton />
        <ErrorBoundary fallback={<div>Error loading data</div>}>
            <Suspense fallback={<div>Suspense</div>}>
                <NFTInfo queryRef={queryRef} tokenId={tokenId} />;
            </Suspense>
        </ErrorBoundary>
    </div>
  );
}

// const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(GET_NFTS, {
  //   variables: variables,
  //   notifyOnNetworkStatusChange: true,
  //   pollInterval: pollIntervalms,
  //   fetchPolicy: 'network-only', // Used for first execution
  //   nextFetchPolicy: 'cache-first', // Used for subsequent executions
  // });
  // const { data } = useSuspenseQuery(GET_NFTS, {
  //   variables: variables,
  //   notifyOnNetworkStatusChange: true,
  //   pollInterval: pollIntervalms,
  //   fetchPolicy: 'network-only', // Used for first execution
  //   nextFetchPolicy: 'cache-first', // Used for subsequent executions
  // });