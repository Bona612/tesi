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
import { SEARCH_OWNER_NFTS, GET_OWNER_NFTS } from "@/apollo/subgraphQueries"
import client from "@/lib/apollo-client";
import Marketplace from '@/components/Marketplace';
import { number } from 'zod';
import { Tag, TAGS, Owner, Data_Owner, ownerVariables, tokenSearchVariables, Where_Tags, Token_orderBy, OrderDirection, tokenOwnerVariables } from "@/types";
import MyNFT from './MyNFT';
import { useFilters } from '@/context/FilterContext';
import Redeem from './RedeemOption';


export default function RedeemStructure() {
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

  const { searchText, tags, setTags, orderBy, orderDirection } = useFilters();

  const id: string = address?.toString() || "";
  const where_tags: Where_Tags = {tags: tags};
  // orderDirection: OrderDirection.
  const variables = {id: id, skip: skip, first: first, where_tags: where_tags, orderBy: Token_orderBy.id} as ownerVariables
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
    (tags: Tag[]) => {
      const params = new URLSearchParams(searchParams.toString());
  
      if (tags.length > 0) {
        // Set the 'tags' query parameter
        params.set('tags', tags.join(','));
        // Replace the current entry in the history stack
        router.replace(`?${params.toString()}`);
      } else {
        // If no tags, remove the 'tags' parameter
        params.delete('tags');
        
        // Check if there are any other query parameters
        const hasOtherParams = Array.from(params.keys()).length > 0;
  
        // Replace the URL accordingly
        if (hasOtherParams) {
          router.replace(`?${params.toString()}`);
        } else {
          router.replace(pathname);
        }
      }
    },
    [searchParams, router, pathname]
  );

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

  //   handleRefetch();
  // };
  useEffect(() => {
    updateURL(tags);
  }, [tags]);

  // Initialize state based on URL parameters
  useEffect(() => {
    console.log("fine")
    const tagsParam = searchParams.get('tags') || '';
    const tagsArray = tagsParam.split(',').filter(Boolean);
    setTags(tagsArray as Tag[]);
  }, [searchParams]);


  // function updateTagList(tag: Tag) {
  //   if (tagList === null) {
  //       return setTagList([tag])
  //   }

  //   const currentTags = tagList as Tag[]
  //   const tagIndex = currentTags.findIndex(t => t === tag);
    
  //   if (tagIndex > -1) {
  //       console.log("TAG presente")
  //       // Remove the tag if it exists
  //       currentTags.splice(tagIndex, 1);
  //   } else {
  //       console.log("TAG non presente")
  //       // Add the tag if it does not exist
  //       currentTags.push(tag);
  //   }

  //   console.log(currentTags)
  //   // Update the form's tags field
  //   setTagList([...currentTags]);

  //   handleRefetch();
  // }

  
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
        where_tags: {tags: tags}
      });
    });
  };

  useEffect(() => {
    console.log("REFETCH")
    startTransition(() => {
      refetch({
        where_tags: {tags: tags},
        // orderBy: ,
        // orderDirection: ,
      });
    });
  }, [orderBy, orderDirection]);
  

  function handleFetchMore() {
    console.log("FETCH MORE")
    startTransition(() => {
      fetchMore({
        variables: {
          skip: skip
        },
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
            {/* <Redeem first={first} skip={skip} setSkip={setSkip} queryRef={queryRef} isPending={isPending} onRefetch={handleRefetch} onFetchMore={handleFetchMore} /> */}
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