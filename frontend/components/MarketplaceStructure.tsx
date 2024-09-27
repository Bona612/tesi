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
import { GET_MARKETPLACE_NFTS } from "@/apollo/subgraphQueries"
import client from "@/lib/apollo-client";
import Marketplace from '@/components/Marketplace';
import { number } from 'zod';
import { Tag, TAGS, NFTtokens, NFTtokensVariables, tokenSearchVariables, OrderBy, OrderDirectionEnum, OrderDirection, orderByOptions, Where_Marketplace, Where_Token_Metadata, Where_Metadata } from "@/types";
import SuspenseGrid from './SuspenseGrid';
import { useMediaQuery, useMediaQueries } from '@/hooks/useMediaQuery';
import { FloatingButton } from './FloatingButton';
import { useFilters } from '@/context/FilterContext';
import { findOrderBy, orderDirectionMap } from '@/utils/utils';
import { useNFTperRow } from '@/context/NFTperRowContext';

// import { useMediaQuery } from 'react-responsive'


// Define the type for media queries object
type MediaQueries = {
  [key: string]: MediaQueryList;
};



// // DA VEDERE SE COSì è MEGLIO, IN UN SECONDO MOMENTO
// {
//   params,
//   searchParams,
// }: {
//   params: { slug: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }

export default function MarketplaceStructure() {
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  // console.log(isConnected)
  // console.log(address)

  
  // const skip: number = 0
  // const [first, setFirst] = useState<number>(3);
  // const [first, setFirst] = useState<number>(0);
  // const [skip, setSkip] = useState<number>(0);
  // const [tagList, setTagList] = useState<Tag[] | null>([]);
  // const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isPending, startTransition] = useTransition();

  const { searchText, setSearchText, tags, setTags, orderBy, setOrderBy, orderDirection, setOrderDirection, page, setPage } = useFilters();
  const { nftPerRow } = useNFTperRow();


  // const updateTags = (tag: Tag) => {
  //     const newTags = tags.includes(tag)
  //         ? tags.filter((t) => t !== tag)
  //         : [...tags, tag];
      
  //     return newTags;
  // }

  // const handleOnClick = (tag: Tag) => {
  //     setTags(updateTags(tag));
  // };

  const wtm: Where_Token_Metadata = { title_contains_nocase: searchText, tags_contains: tags };
  const where_marketplace: Where_Marketplace = { isListed: true, metadata_: wtm };

  // VARAIBLES TO CHANGE
  let variables = {skip: (page - 1) * nftPerRow, first: nftPerRow, where_marketplace: where_marketplace, orderBy: orderBy.name, orderDirection: OrderDirectionEnum[orderDirection]} as NFTtokensVariables
  const pollInterval_ms = 5000

  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams();

  // // Function to update the URL with the selected tags
  // const updateURL = useCallback(
  //   (tags: Tag[]) => {
  //     const params = new URLSearchParams(searchParams.toString());
  //     console.log(tags.length)
  //     console.log("params: ", params)
  //     console.log(params.get('tags'))
  //     if (tags.length > 0) {
  //       params.set('tags', tags.join(','));
  //       router.push(`?${params.toString()}`);
  //     }
  //     else {
  //       console.log("vediamo se entra")
  //       params.delete('tags')
  //       router.replace(pathname);
  //     }
      
  //   },
  //   [searchParams, router]
  // );
  // const updateURL = useCallback(
  //   (tags: Tag[], orderBy: OrderBy, orderDirection: OrderDirection, page: number) => {
  //     const params = new URLSearchParams(searchParams.toString());

  //     // Update the 'tags' parameter
  //     if (tags.length > 0) {
  //       params.set('tags', tags.join(','));
  //     } else {
  //       params.delete('tags');
  //     }
  //     // Update the 'orderBy' parameter
  //     params.set('orderBy', orderBy.name);
  //     // Update the 'orderDirection' parameter
  //     params.set('orderDirection', OrderDirectionEnum[orderDirection]);
  //     // Update the 'page' parameter
  //     params.set('page', page.toString());

  //     // Replace the URL with the updated search params
  //     const newUrl = params.toString() ? `?${params.toString()}` : pathname;
  //     router.push(newUrl);
  //     // router.replace(newUrl);
  //   },
  //   [searchParams, router, pathname]
  // );

  // useEffect(() => {
  //   updateURL(tags, orderBy, orderDirection, page);
  // }, [tags, orderBy, orderDirection, page]);

  useEffect(() => {
    setPage(1);
    // updateURL(tags, orderBy, orderDirection, page);
  }, [nftPerRow]);

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
    const searchTextParam = searchParams.get('searchText') || searchText;
    setTags(tagsArray as Tag[]);
    setOrderBy(findOrderBy(orderByParam));
    setOrderDirection(orderDirectionMap[orderDirectionParam]);
    setPage(isNaN(Number(pageParam)) ? 1 : Number(pageParam));
    setSearchText(searchTextParam);
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
    const searchTextParam = searchParams.get('searchText') || searchText;
    setTags(tagsArray as Tag[]);
    setOrderBy(findOrderBy(orderByParam));
    setOrderDirection(orderDirectionMap[orderDirectionParam]);
    setPage(isNaN(Number(pageParam)) ? 1 : Number(pageParam));
    setSearchText(searchTextParam);
    console.log("orderDirectionParam: ", orderDirectionParam);
    console.log("fem sta prova: ", orderDirectionMap[orderDirectionParam]);
    console.log("fem sta prova2: ", orderDirectionParam);
  }, [searchParams]);

  // // Function to handle tag selection
  // const handleTagChange = (tag: Tag) => {
  //   setSelectedTags((prevTags) => {
  //     const newTags = prevTags.includes(tag)
  //       ? prevTags.filter((t) => t !== tag)
  //       : [...prevTags, tag];
  //     updateURL(newTags);
  //     return newTags;
  //   });

  //   console.log(isConnected)
  //   console.log(address)

  //   // handleRefetch();
  // };

  // // DA CAPIRE IN UN SECONDO MOMENTO, QUI SUCCEDE CHE ALCUNE COSE SONO UNDEFINED
  // // DA ELIMINARE PROBABILMENTE
  // // Initialize state based on URL parameters
  // useEffect(() => {
  //   console.log("fine")
  //   const tagsParam = searchParams.get('tags') || '';
  //   const tagsArray = tagsParam.split(',').filter(Boolean);
  //   const orderByParam = searchParams.get('orderBy') || '';
  //   const orderDirectionParam = searchParams.get('orderDirection') || '';
  //   const pageParam = searchParams.get('page') || '';
  //   setTags(tagsArray as Tag[]);
  //   setOrderBy(findOrderBy(orderByParam));
  //   setOrderDirection(orderDirectionMap[orderDirectionParam]);
  //   setPage(isNaN(Number(pageParam)) ? 1 : Number(pageParam));
  //   console.log("fem sta prova: ", orderDirectionMap[orderDirectionParam]);
  //   console.log("fem sta prova2: ", orderDirectionParam);
  // }, [searchParams]);
    

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

  function handleFetchMore() {
    console.log("FETCH MORE")
    startTransition(() => {
      fetchMore({
        variables: variables,
      });
    });
  };

  
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



  

  

  // // Log state changes
  // useEffect(() => {
  //   console.log("Updated 'first' in useEffect:", first);
  // }, [first]);



  // const screenSize = useMediaQueries()
  // console.log("screen ", screenSize)

  // useEffect(() => {
  //   console.log("Screen size changed to:", screenSize);
  //   // Update the state variable based on screen size
  //   if (screenSize === 'small') {
  //     setFirst(1);
  //   } 
  //   else if (screenSize === 'medium') {
  //     setFirst(2);
  //   } 
  //   else if (screenSize === 'large') {
  //     setFirst(3);
  //   }
  //   else if (screenSize === 'extralarge') {
  //     setFirst(4);
  //   }
  //   else {
  //     setFirst(-1);
  //   }
  // }, [screenSize]);

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