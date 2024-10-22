'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';import ErrorBoundary from '@/components/ErrorBoundary';
import NFTsHeader from '@/components/NFTsHeader';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

import { Suspense, useTransition  } from 'react';

import { useBackgroundQuery, QueryRef } from '@apollo/client';
import { GET_OWNER_REDEEM_NFTS } from "@/apollo/subgraphQueries";
import { Tag, tokenOwnerVariables, Where_Token_Redeem, OrderDirectionEnum, OwnerNFTtokens, Where_Token_Metadata } from "@/types";
import { useFilters } from '@/context/FilterContext';
import { useNFTperRow } from '@/context/NFTperRowContext';
import Redeem from './Redeem';
import SuspenseGrid from './SuspenseGrid';
import { findOrderBy, orderDirectionMap } from '@/utils/utils';


export default function RedeemStructure() {
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()

  const [isPending, startTransition] = useTransition();

  const { searchText, setSearchText, tags, setTags, orderBy, setOrderBy, orderDirection, setOrderDirection, page, setPage } = useFilters();
  const { nftPerRow } = useNFTperRow();

  const wtm: Where_Token_Metadata = { title_contains_nocase: searchText, tags_contains: tags };
  const where_token_redeem: Where_Token_Redeem = {toRedeem: true,  metadata_: wtm};



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


  let variables = {id: address ? address.toLowerCase() : "", skip: (page - 1) * nftPerRow, first: nftPerRow, where_token_redeem: where_token_redeem, orderBy: orderBy.name, orderDirection: OrderDirectionEnum[orderDirection]} as tokenOwnerVariables
  // const pollInterval_ms = 5000
  
  let [customQueryRef, { refetch: refetchOwnerRedeemNfts}] = useBackgroundQuery(GET_OWNER_REDEEM_NFTS, {
    variables: {id: address ? address.toLowerCase() : "", where_token_redeem: where_token_redeem, orderBy: orderBy.name, orderDirection: OrderDirectionEnum[orderDirection]} as tokenOwnerVariables,
    // skip: !address
  });
  let [queryRef, { refetch, fetchMore }] = useBackgroundQuery(GET_OWNER_REDEEM_NFTS, {
    variables: variables,
    // skip: !address
    // notifyOnNetworkStatusChange: true,
    // pollInterval: pollInterval_ms,
    // fetchPolicy: 'network-only', // Used for first execution
    // nextFetchPolicy: 'cache-first', // Used for subsequent executions
  });

  useEffect(() => {
    if (address) {
      refetchOwnerRedeemNfts(); // Re-query when the address changes
      refetch(); // Re-query when the address changes
    }
  }, [address]);

  // function handleRefetch() {
  //   startTransition(() => {
  //     refetch({
  //       // VARAIBLES TO CHANGE
  //     });
  //   });
  // };

  // useEffect(() => {
  //   startTransition(() => {
  //     refetch({
  //       // VARAIBLES TO CHANGE
  //       // orderBy: ,
  //       // orderDirection: ,
  //     });
  //   });
  // }, [orderBy, orderDirection]);
  

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
            <Redeem totalData={customQueryRef as QueryRef<OwnerNFTtokens, tokenOwnerVariables>} queryRef={queryRef as QueryRef<OwnerNFTtokens, tokenOwnerVariables>} isPending={isPending} onFetchMore={handleFetchMore} />
          </Suspense>
        </ErrorBoundary>
    </div>
  );
}
