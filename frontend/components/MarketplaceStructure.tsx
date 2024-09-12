'use client';

import * as React from 'react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

import { Suspense, useTransition  } from 'react';
import NFTList from '@/components/NFTList';

// Import everything needed to use the `useQuery` hook
import { ApolloProvider, useQuery, gql, TypedDocumentNode, useSuspenseQuery, useBackgroundQuery, useLoadableQuery, LoadQueryFunction, OperationVariables, QueryRef } from '@apollo/client';
import { GET_MARKETPLACE_NFTS, SEARCH_MARKETPLACE_NFTS } from "@/apollo/subgraphQueries"
import client from "@/lib/apollo-client";
import Marketplace from '@/components/Marketplace';
import { number } from 'zod';
import { Tag, TAGS, NFTtokens, NFTtokensVariables, tokenSearchVariables, OrderBy, OrderDirectionEnum, OrderDirection, orderByOptions } from "@/types";
import SuspenseGrid from './SuspenseGrid';
import { useMediaQuery, useMediaQueries } from '@/hooks/useMediaQuery';
import { FloatingButton } from './FloatingButton';
import { useFilters } from '@/context/FilterContext';
import { findOrderBy, orderDirectionMap } from '@/utils/utils';

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
  const [first, setFirst] = useState<number>(0);
  const [skip, setSkip] = useState<number>(0);
  // const [tagList, setTagList] = useState<Tag[] | null>([]);
  // const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isPending, startTransition] = useTransition();

  const { tags, setTags, orderBy, setOrderBy, orderDirection, setOrderDirection, page, setPage } = useFilters();


  const updateTags = (tag: Tag) => {
      const newTags = tags.includes(tag)
          ? tags.filter((t) => t !== tag)
          : [...tags, tag];
      
      return newTags;
  }

  const handleOnClick = (tag: Tag) => {
      setTags(updateTags(tag));
  };

  // VARAIBLES TO CHANGE
    const variables = {skip: skip, first: first, tags: tags} as NFTtokensVariables
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
  const updateURL = useCallback(
    (tags: Tag[], orderBy: OrderBy, orderDirection: OrderDirection, page: number) => {
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

      // Replace the URL with the updated search params
      const newUrl = params.toString() ? `?${params.toString()}` : pathname;
      router.push(newUrl);
      // router.replace(newUrl);
    },
    [searchParams, router, pathname]
  );

  useEffect(() => {
    updateURL(tags, orderBy, orderDirection, page);
  }, [tags, orderBy, orderDirection, page]);

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
    

  /// DA SCOMMENTARE SOTTO
  // let [queryRef, { refetch, fetchMore }] = useBackgroundQuery(GET_NFTS, {
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



  

  

  // Log state changes
  useEffect(() => {
    console.log("Updated 'first' in useEffect:", first);
  }, [first]);


  const queryRef = [] as QueryRef<NFTtokens, NFTtokensVariables>;

  const screenSize = useMediaQueries()
  console.log("screen ", screenSize)

  useEffect(() => {
    console.log("Screen size changed to:", screenSize);
    // Update the state variable based on screen size
    if (screenSize === 'small') {
      setFirst(1);
    } 
    else if (screenSize === 'medium') {
      setFirst(2);
    } 
    else if (screenSize === 'large') {
      setFirst(3);
    }
    else if (screenSize === 'extralarge') {
      setFirst(4);
    }
    else {
      setFirst(-1);
    }
  }, [screenSize]);

  return (
    <div>
        {/* <div>
          <p>The current screen size is: {screenSize}</p>
          <p>first is: {first}</p>
        </div> */}
        <NFTsHeader />
        <ErrorBoundary fallback={<div>Error loading data</div>}>
          <Suspense fallback={<SuspenseGrid></SuspenseGrid>}>
            <Marketplace first={first} skip={skip} setSkip={setSkip} queryRef={queryRef} isPending={isPending} onRefetch={() => {}} onFetchMore={() => {}} />
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