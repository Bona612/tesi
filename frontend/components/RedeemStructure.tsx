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
import { SEARCH_OWNER_REDEEM_NFTS, GET_OWNER_REDEEM_NFTS } from "@/apollo/subgraphQueries"
import client from "@/lib/apollo-client";
import Marketplace from '@/components/Marketplace';
import { number } from 'zod';
import { Tag, TAGS, Owner, Data_Owner, ownerVariables, tokenSearchVariables, Where_Tags, Token_orderBy, OrderDirection, tokenOwnerVariables, Where_Token_Redeem, OrderDirectionEnum, NFTtokensVariables } from "@/types";
import MyNFT from './MyNFT';
import { useFilters } from '@/context/FilterContext';
import { useNFTperRow } from '@/context/NFTperRowContext';
import Redeem from './Redeem';


export default function RedeemStructure() {
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  // console.log(isConnected)
  // console.log(address)

  const [isPending, startTransition] = useTransition();

  const { tags, setTags, orderBy, setOrderBy, orderDirection, setOrderDirection, page, setPage } = useFilters();
  const { nftPerRow } = useNFTperRow();

  const id: string = address?.toString() || "";
  const where_tags: Where_Tags = { tags_contains: tags };
  const where_token_redeem: Where_Token_Redeem = {toRedeem: false,  metadata_: where_tags};



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
  // useEffect(() => {
  //   updateURL(tags);
  // }, [tags]);

  // // Initialize state based on URL parameters
  // useEffect(() => {
  //   console.log("fine")
  //   const tagsParam = searchParams.get('tags') || '';
  //   const tagsArray = tagsParam.split(',').filter(Boolean);
  //   setTags(tagsArray as Tag[]);
  // }, [searchParams]);


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

  // VARAIBLES TO CHANGE
  let variables = {id: address?.toLowerCase(), skip: (page - 1) * nftPerRow, first: nftPerRow, where_token_redeem: where_token_redeem, orderBy: orderBy.name, orderDirection: OrderDirectionEnum[orderDirection]} as tokenOwnerVariables
  const pollInterval_ms = 5000
  
  let [customQueryRef, { refetch: refetchOwnerRedeemNfts, fetchMore: fetchMoreOwnerRedeemNfts }] = useBackgroundQuery(GET_OWNER_REDEEM_NFTS, {
    variables: {id: address?.toLowerCase(), where_token_redeem: where_token_redeem, orderBy: orderBy.name, orderDirection: OrderDirectionEnum[orderDirection]} as tokenOwnerVariables,
  });
  let [queryRef, { refetch, fetchMore }] = useBackgroundQuery(GET_OWNER_REDEEM_NFTS, {
    variables: variables,
    // notifyOnNetworkStatusChange: true,
    // pollInterval: pollInterval_ms,
    // fetchPolicy: 'network-only', // Used for first execution
    // nextFetchPolicy: 'cache-first', // Used for subsequent executions
  });

  useEffect(() => {
    console.log("ADDRESS CHANGED !!!");
    if (address) {
      console.log("REFETCH !!!");
      refetchOwnerRedeemNfts(); // Re-query when the address changes
    }
  }, [address]);
  useEffect(() => {
    console.log("ADDRESS CHANGED !!!");
    if (address) {
      console.log("REFETCH !!!");
      refetch(); // Re-query when the address changes
    }
  }, [address]);

  function handleRefetch() {
    console.log("REFETCH")
    startTransition(() => {
      refetch({
        // VARAIBLES TO CHANGE
      });
    });
  };

  useEffect(() => {
    console.log("REFETCH")
    startTransition(() => {
      refetch({
        // VARAIBLES TO CHANGE
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
        },
      });
    });
  };

  
  const [loadNfts, searchQueryRef] = useLoadableQuery(SEARCH_OWNER_REDEEM_NFTS);

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
            <Redeem queryRef={customQueryRef} isPending={isPending} onRefetch={handleRefetch} onFetchMore={handleFetchMore} />
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