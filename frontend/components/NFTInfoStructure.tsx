'use client';

import * as React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SkeletonCard } from '@/components/SkeletonCard';

import { Suspense } from 'react';

import { useBackgroundQuery } from '@apollo/client';
import { GET_NFT } from "@/apollo/subgraphQueries";
import { NFTtokenVariables } from "@/types";
import NFTInfo from './NFTInfo';
import BackButton from './BackButton';
import { useWallet } from '@/context/WalletContext';



type NFTInfoStructureProps = {
    tokenId: string
}


export default function NFTInfoStructure({ tokenId }: NFTInfoStructureProps) {
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
  //   startTransition(() => {
  //     refetch({
  //       tags: selectedTags
  //     });
  //   });
  // };

  // function handleRefetchOnMediaChanged() {
  //   startTransition(() => {
  //     refetch({
  //       first: first
  //     });
  //   });
  // };

  // function handleFetchMore() {
  //   startTransition(() => {
  //     fetchMore({
  //       variables: {
  //         skip: skip
  //       },
  //     });
  //   });
  // };


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
