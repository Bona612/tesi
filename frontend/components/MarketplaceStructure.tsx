'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';import ErrorBoundary from '@/components/ErrorBoundary';
import NFTsHeader from '@/components/NFTsHeader';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

import { Suspense, useTransition  } from 'react';

import { useBackgroundQuery } from '@apollo/client';
import { GET_MARKETPLACE_NFTS } from "@/apollo/subgraphQueries"
import Marketplace from '@/components/Marketplace';
import { Tag, NFTtokensVariables, OrderDirectionEnum, Where_Marketplace, Where_Token_Metadata } from "@/types";
import SuspenseGrid from './SuspenseGrid';
import { useFilters } from '@/context/FilterContext';
import { findOrderBy, orderDirectionMap } from '@/utils/utils';
import { useNFTperRow } from '@/context/NFTperRowContext';


// Define the type for media queries object
type MediaQueries = {
  [key: string]: MediaQueryList;
};



export default function MarketplaceStructure() {
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const [isPending, startTransition] = useTransition();

  const { searchText, setSearchText, tags, setTags, orderBy, setOrderBy, orderDirection, setOrderDirection, page, setPage } = useFilters();
  const { nftPerRow } = useNFTperRow();

  const wtm: Where_Token_Metadata = { title_contains_nocase: searchText, tags_contains: tags };
  const where_marketplace: Where_Marketplace = { isListed: true, metadata_: wtm };

  let variables = {skip: (page - 1) * nftPerRow, first: nftPerRow, where_marketplace: where_marketplace, orderBy: orderBy.name, orderDirection: OrderDirectionEnum[orderDirection]} as NFTtokensVariables
  // const pollInterval_ms = 5000

  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams();

  useEffect(() => {
    setPage(1);
  }, [nftPerRow]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Update the 'tags' parameter
    if (tags.length > 0) {
      params.set('tags', tags.join(','));
    } else {
      params.delete('tags');
    }
    // Update the 'orderBy' parameter
    params.set('orderBy', orderBy.name);
    // Update the 'orderDirection' parameter
    params.set('orderDirection', OrderDirectionEnum[orderDirection]);
    // Update the 'page' parameter
    params.set('page', page.toString());

    // Update the 'searchText' parameter (only if searchText is not empty)
    if (searchText !== "") {
      params.set('searchText', searchText);
    } else {
      params.delete('searchText');
    }

    // Replace the URL with the updated search params
    const newUrl = params.toString() ? `?${params.toString()}` : pathname;
    router.push(newUrl);
  }, [searchText, tags, orderBy, orderDirection, page]);

  // Initialize state based on URL parameters
  useEffect(() => {
    const tagsParam = searchParams.get('tags') || '';
    const tagsArray = tagsParam.split(',').filter(Boolean);
    const orderByParam = searchParams.get('orderBy') || orderBy.name;
    const orderDirectionParam = searchParams.get('orderDirection') || OrderDirectionEnum[orderDirection];
    const pageParam = searchParams.get('page') || page;
    const searchTextParam = searchParams.get('searchText') || searchText;
    setTags(tagsArray as Tag[]);
    setOrderBy(findOrderBy(orderByParam));
    setOrderDirection(orderDirectionMap[orderDirectionParam]);
    setPage(isNaN(Number(pageParam)) ? 1 : Number(pageParam));
    setSearchText(searchTextParam);
  }, []);
  useEffect(() => {
    const tagsParam = searchParams.get('tags') || '';
    const tagsArray = tagsParam.split(',').filter(Boolean);
    const orderByParam = searchParams.get('orderBy') || orderBy.name;
    const orderDirectionParam = searchParams.get('orderDirection') || OrderDirectionEnum[orderDirection];
    const pageParam = searchParams.get('page') || page;
    const searchTextParam = searchParams.get('searchText') || searchText;
    setTags(tagsArray as Tag[]);
    setOrderBy(findOrderBy(orderByParam));
    setOrderDirection(orderDirectionMap[orderDirectionParam]);
    setPage(isNaN(Number(pageParam)) ? 1 : Number(pageParam));
    setSearchText(searchTextParam);
  }, [searchParams]);


  let [customQueryRef, { refetch: refetchOwnerRedeemNfts}] = useBackgroundQuery(GET_MARKETPLACE_NFTS, {
    variables: {where_marketplace: where_marketplace, orderBy: orderBy.name, orderDirection: OrderDirectionEnum[orderDirection]} as NFTtokensVariables,
  });
  let [queryRef, { refetch, fetchMore }] = useBackgroundQuery(GET_MARKETPLACE_NFTS, {
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

  function handleFetchMore() {
    startTransition(() => {
      fetchMore({
        variables: variables,
      });
    });
  };


  return (
    <div>
      <NFTsHeader />
      <ErrorBoundary fallback={<div>Error loading data</div>}>
        <Suspense fallback={<SuspenseGrid></SuspenseGrid>}>
          <Marketplace totalData={customQueryRef} queryRef={queryRef} isPending={isPending} onFetchMore={handleFetchMore} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}