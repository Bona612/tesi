'use client';

import * as React from 'react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import BaseNFTBox from '@/components/BaseNFT';
// import ListedNFTBox from '@/components/ListedNFT';
import ErrorBoundary from '@/components/ErrorBoundary';
import NFTsHeader from '@/components/NFTsHeader';
import { SkeletonCard } from '@/components/SkeletonCard';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

import { Suspense, useTransition  } from 'react';
import NFTList from '@/components/NFTList';

// Import everything needed to use the `useQuery` hook
import { ApolloProvider, useQuery, gql, TypedDocumentNode, useSuspenseQuery, useBackgroundQuery, useLoadableQuery, LoadQueryFunction, OperationVariables, QueryRef } from '@apollo/client';
import { SEARCH_OWNER_NFTS, GET_OWNER_NFTS } from "@/apollo/subgraphQueries"
import client from "@/lib/apollo-client";
import Marketplace from '@/components/Marketplace';
import { number } from 'zod';
import { Tag, TAGS, Owner, Data_Owner, ownerVariables, tokenSearchVariables, Where_Tags, OrderBy, OrderDirection, tokenOwnerVariables, Where_Owner_Id, Where_Token_Owner, OrderDirectionEnum, Where_Token_Metadata, Where_Metadata } from "@/types";
import MyNFT from './MyNFT';
import { useFilters } from '@/context/FilterContext';
import { findOrderBy, orderDirectionMap } from '@/utils/utils';


export default function ResponsiveGrid() {
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  // console.log(isConnected)
  // console.log(address)

  const first: number = 3
  // const skip: number = 0
  // const [first, setFirst] = useState<number>(3);
  const [skip, setSkip] = useState<number>(0);
  // const [tagList, setTagList] = useState<Tag[] | null>([]);
  // const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isPending, startTransition] = useTransition();

  const { searchText, tags, setTags, orderBy, setOrderBy, orderDirection, setOrderDirection, page, setPage } = useFilters();

  const id: string = address?.toString() || "";
  
  const wtags: Where_Token_Metadata = { tags_contains: ["Tag 1"] };
  const where_metadata: Where_Metadata = { metadata_: wtags };
  
  // const variables = {id: id, skip: skip, first: first, where_token_owner: where_token_owner, orderBy: orderBy.name, orderDirection: OrderDirectionEnum[orderDirection]} as ownerVariables
  const variables = {id: "QmT83suxMSkV3CqBkEK7nYbJw4MYfnSxxF8JjeqPC4XZqh", skip: skip, first: first, orderBy: "id", orderDirection: OrderDirectionEnum[orderDirection]} as ownerVariables
  const pollInterval_ms = 5000
  console.log("variables: ", variables);


  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams();

  // // Function to update the URL with the selected tags
  // const updateURL = useCallback(
  //   (tags: Tag[], orderBy: OrderBy, orderDirection: OrderDirection, page: number) => {
  //     console.log("CALLBACK START");
  //     const params = new URLSearchParams(searchParams.toString());
  //     console.log("params: ", params)

  //     // Update the 'tags' parameter
  //     if (tags.length > 0) {
  //       params.set('tags', tags.join(','));
  //     } else {
  //       params.delete('tags');
  //     }
  //     // Update the 'orderBy' parameter
  //     params.set('orderBy', orderBy.name);
  //     // Update the 'orderDirection' parameter
  //     console.log("OrderDirectionEnum[orderDirection]: ", OrderDirectionEnum[orderDirection]);
  //     params.set('orderDirection', OrderDirectionEnum[orderDirection]);
  //     // Update the 'page' parameter
  //     params.set('page', page.toString());

  //     // Replace the URL with the updated search params
  //     const newUrl = params.toString() ? `?${params.toString()}` : pathname;
  //     router.push(newUrl);
  //     // router.replace(newUrl);
  //   },
  //   [router, pathname]
  // );

  // QUESTO PIù QUELLO DOPO SEMBRA VENIRE
  useEffect(() => {
    // updateURL(tags, orderBy, orderDirection, page);
    console.log("CALLBACK START");
    const params = new URLSearchParams(searchParams.toString());
    console.log("params: ", params)

    // Update the 'tags' parameter
    if (tags.length > 0) {
      params.set('tags', tags.join(','));
    } else {
      params.delete('tags');
    }
    // Update the 'orderBy' parameter
    params.set('orderBy', orderBy.name);
    // Update the 'orderDirection' parameter
    console.log("OrderDirectionEnum[orderDirection]: ", OrderDirectionEnum[orderDirection]);
    params.set('orderDirection', OrderDirectionEnum[orderDirection]);
    // Update the 'page' parameter
    params.set('page', page.toString());

    // Replace the URL with the updated search params
    const newUrl = params.toString() ? `?${params.toString()}` : pathname;
    router.push(newUrl);
  }, [tags, orderBy, orderDirection, page]);

  // Initialize state based on URL parameters
  useEffect(() => {
    console.log("searchParams START");
    console.log(orderBy.name);
    console.log(orderDirection);
    console.log(page);
    // console.log(searchParams.get('orderDirection'));
    const tagsParam = searchParams.get('tags') || '';
    const tagsArray = tagsParam.split(',').filter(Boolean);
    const orderByParam = searchParams.get('orderBy') || orderBy.name;
    console.log(searchParams.get('orderDirection'));
    console.log(OrderDirectionEnum[orderDirection]);
    console.log(orderDirectionMap[OrderDirectionEnum[orderDirection]]);
    const orderDirectionParam = searchParams.get('orderDirection') || OrderDirectionEnum[orderDirection];
    const pageParam = searchParams.get('page') || page;
    setTags(tagsArray as Tag[]);
    setOrderBy(findOrderBy(orderByParam));
    setOrderDirection(orderDirectionMap[orderDirectionParam]);
    setPage(isNaN(Number(pageParam)) ? 1 : Number(pageParam));
    console.log("orderDirectionParam: ", orderDirectionParam);
    console.log("fem sta prova: ", orderDirectionMap[orderDirectionParam]);
    console.log("fem sta prova2: ", orderDirectionParam);
  }, []);
  useEffect(() => {
    console.log("searchParams START");
    console.log(orderBy.name);
    console.log(orderDirection);
    console.log(page);
    // console.log(searchParams.get('orderDirection'));
    const tagsParam = searchParams.get('tags') || '';
    const tagsArray = tagsParam.split(',').filter(Boolean);
    const orderByParam = searchParams.get('orderBy') || orderBy.name;
    console.log(searchParams.get('orderDirection'));
    console.log(OrderDirectionEnum[orderDirection]);
    console.log(orderDirectionMap[OrderDirectionEnum[orderDirection]]);
    const orderDirectionParam = searchParams.get('orderDirection') || OrderDirectionEnum[orderDirection];
    const pageParam = searchParams.get('page') || page;
    setTags(tagsArray as Tag[]);
    setOrderBy(findOrderBy(orderByParam));
    setOrderDirection(orderDirectionMap[orderDirectionParam]);
    setPage(isNaN(Number(pageParam)) ? 1 : Number(pageParam));
    console.log("orderDirectionParam: ", orderDirectionParam);
    console.log("fem sta prova: ", orderDirectionMap[orderDirectionParam]);
    console.log("fem sta prova2: ", orderDirectionParam);
  }, [searchParams]);

  
  let [queryRef, { refetch, fetchMore }] = useBackgroundQuery(GET_OWNER_NFTS, {
    variables: variables,
    notifyOnNetworkStatusChange: true,
    pollInterval: pollInterval_ms,
    fetchPolicy: 'network-only', // Used for first execution
    nextFetchPolicy: 'cache-first', // Used for subsequent executions
  });

  function handleRefetch() {
    console.log("REFETCH")
    startTransition(() => {
      refetch({
        // VARAIBLES TO CHANGE
        // where_metadata: where_metadata
      });
    });
  };

  useEffect(() => {
    console.log("REFETCH")
    startTransition(() => {
      refetch({
        // VARAIBLES TO CHANGE
        // where_metadata: where_metadata,
        // orderBy: orderBy.name, 
        // orderDirection: OrderDirectionEnum[orderDirection]
        // orderBy: "id", 
        // orderDirection: OrderDirectionEnum[OrderDirectionEnum.asc]
      });
    });
  }, [orderBy, orderDirection]);
  

  function handleFetchMore() {
    console.log("FETCH MORE")
    startTransition(() => {
      fetchMore({
        variables: variables,
      });
    });
  };

  
  const [loadNfts, searchQueryRef] = useLoadableQuery(SEARCH_OWNER_NFTS);

  // const handleSearchBarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   // console.log(event)
  //   const inputValue = event.target.value;
  //   console.log(inputValue);
  
  //   startTransition(() => {
  //     loadNfts({ 
  //       text: inputValue,
  //       skip: skip,
  //       first: first,
  //       where_token_owner: {owner_: {address: ""}}
  //     } as tokenOwnerVariables);
  //   });

  //   // da scommentare dopo
  //   // queryRef = searchQueryRef as QueryRef<Owner, ownerVariables>; // Update queryRef to point to the search query
  // };

  // useEffect(() => {
  //   console.log("REFETCH SEARCH BAR")
  //   startTransition(() => {
  //     loadNfts({ 
  //       text: inputValue,
  //       skip: skip,
  //       first: first,
  //       where_token_owner: {owner_: {address: ""}}
  //     } as tokenOwnerVariables);
  //   });
  // }, [searchText]);


  
  // /// QUI DA SISTEMARE PER IL RESET
  // useEffect(() => {
  //   // Reset filters on first mount
  //   resetFilters();
  // }, []);

  // useEffect(() => {
  //   const handleRouteChange = (url: string) => {
  //     if (url === '/marketplace' && previousPathRef.current !== '/marketplace') {
  //       resetFilters();
  //     }
  //     previousPathRef.current = url;
  //   };

  //   router.events.on('routeChangeComplete', handleRouteChange);

  //   return () => {
  //     router.events.off('routeChangeComplete', handleRouteChange);
  //   };
  // }, [resetFilters, router.events]);


  return (
    <div>
        <NFTsHeader />
        <ErrorBoundary fallback={<div>Error loading data</div>}>
          <Suspense fallback={<SkeletonCard></SkeletonCard>}>
            <MyNFT first={first} skip={skip} setSkip={setSkip} queryRef={queryRef} isPending={isPending} onRefetch={handleRefetch} onFetchMore={handleFetchMore} />
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