'use client';

import * as React from 'react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';import ErrorBoundary from '@/components/ErrorBoundary';
import NFTsHeader from '@/components/NFTsHeader';
import { SkeletonCard } from '@/components/SkeletonCard';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

import { Suspense, useTransition  } from 'react';
import NFTList from '@/components/NFTList';

// Import everything needed to use the `useQuery` hook
import { ApolloProvider, useQuery, gql, TypedDocumentNode, useSuspenseQuery, useBackgroundQuery, useLoadableQuery, LoadQueryFunction, OperationVariables, QueryRef } from '@apollo/client';
import { GET_NFT } from "@/apollo/subgraphQueries"
import client from "@/lib/apollo-client";
import Marketplace from '@/components/Marketplace';
import { number } from 'zod';
import { Tag, TAGS, NFTtokens, NFTtokensVariables, tokenSearchVariables, NFTtokenVariables, NFT } from "@/types";
import SuspenseGrid from './SuspenseGrid';
import { useMediaQuery, useMediaQueries } from '@/hooks/useMediaQuery';
import { FloatingButton } from './FloatingButton';
import NFTInfo from './NFTInfo';
import BackButton from './BackButton';
import { useWallet } from '@/context/WalletContext';

// import { useMediaQuery } from 'react-responsive'


// Define the type for media queries object
type MediaQueries = {
    [key: string]: MediaQueryList;
};

type NFTInfoStructureProps = {
    tokenId: string
}






export default function NFTInfoStructure({ tokenId }: NFTInfoStructureProps) {
  // const { address, chainId, isConnected } = useWeb3ModalAccount()
  // const { walletProvider } = useWeb3ModalProvider()
  // console.log(isConnected)
  // console.log(address)

  
  // const skip: number = 0
  // const [first, setFirst] = useState<number>(3);
  // const [first, setFirst] = useState<number>(0);
  // const [skip, setSkip] = useState<number>(0);
  // const [tagList, setTagList] = useState<Tag[] | null>([]);
  // const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  // const [isPending, startTransition] = useTransition();
  const { address } = useWallet();

  const variables = {id: tokenId} as NFTtokenVariables;

  let [queryRef] = useBackgroundQuery(GET_NFT, {
    variables: variables,
    // notifyOnNetworkStatusChange: true,
    // pollInterval: pollInterval_ms,
    // fetchPolicy: 'network-only', // Used for first execution
    // nextFetchPolicy: 'cache-first', // Used for subsequent executions
  });

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


  // queryRef = [] as QueryRef<NFT, NFTtokenVariables>;
  console.log(tokenId)

  return (
    <div className="pt-2 pl-2 pr-2">
      <BackButton />
      <ErrorBoundary fallback={<div>Error loading data</div>}>
          <Suspense fallback={<SkeletonCard></SkeletonCard>}>
            <NFTInfo queryRef={queryRef} />
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