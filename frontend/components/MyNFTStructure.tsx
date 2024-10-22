'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import NFTsHeader from '@/components/NFTsHeader';

import { Suspense, useTransition  } from 'react';

import { useBackgroundQuery, QueryRef } from '@apollo/client';
import { GET_OWNER_NFTS } from "@/apollo/subgraphQueries"
import { Tag, ownerVariables, OrderDirectionEnum, Where_Token_Metadata, Where_Metadata, OwnerNFTtokens } from "@/types";
import MyNFT from './MyNFT';
import { useFilters } from '@/context/FilterContext';
import { findOrderBy, orderDirectionMap } from '@/utils/utils';
import SuspenseGrid from './SuspenseGrid';
import { useNFTperRow } from '@/context/NFTperRowContext';
import { useWallet } from '@/context/WalletContext';


export default function MyNFTStructure() {
  const { address } = useWallet();
  

  const [isPending, startTransition] = useTransition();

  const { searchText, setSearchText, tags, setTags, orderBy, setOrderBy, orderDirection, setOrderDirection, page, setPage } = useFilters();
  const { nftPerRow } = useNFTperRow();
  
  const wtm: Where_Token_Metadata = { title_contains_nocase: searchText, tags_contains: tags };
  const where_metadata: Where_Metadata = { metadata_: wtm };


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

  let variables = {id: address ? address.toLowerCase() : "", skip: (page - 1) * nftPerRow, first: nftPerRow, where_metadata: where_metadata, orderBy: orderBy.name, orderDirection: OrderDirectionEnum[orderDirection]} as ownerVariables
  // const pollInterval_ms = 5000
  
  let [customQueryRef, { refetch: refetchOwnerRedeemNfts}] = useBackgroundQuery(GET_OWNER_NFTS, {
    variables: {id: address ? address.toLowerCase() : "", where_metadata: where_metadata, orderBy: orderBy.name, orderDirection: OrderDirectionEnum[orderDirection]} as ownerVariables,
    // skip: !address
  });
  let [queryRef, { refetch, fetchMore }] = useBackgroundQuery(GET_OWNER_NFTS, {
    variables: variables,
    // skip: !address
    // notifyOnNetworkStatusChange: true,
    // pollInterval: pollInterval_ms,
    // fetchPolicy: 'network-only', // Used for first execution
    // nextFetchPolicy: 'network-only', // Used for subsequent executions
    // // nextFetchPolicy: 'cache-first', // Used for subsequent executions
  });

  
  useEffect(() => {
    if (address) {
      refetchOwnerRedeemNfts(); // Re-query when the address changes
      refetch(); // Re-query when the address changes
    }
  }, [address]);

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
          <MyNFT totalData={customQueryRef as QueryRef<OwnerNFTtokens, ownerVariables>} queryRef={queryRef as QueryRef<OwnerNFTtokens, ownerVariables>} isPending={isPending} onFetchMore={handleFetchMore} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}