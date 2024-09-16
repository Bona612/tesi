'use client';

import * as React from 'react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import ErrorBoundary from '@/components/ErrorBoundary';
import NFTsHeader from '@/components/NFTsHeader';
import { SkeletonCard } from '@/components/SkeletonCard';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

import { Suspense, useTransition  } from 'react';
import NFTList from '@/components/NFTList';

// Import everything needed to use the `useQuery` hook
import { ApolloProvider, useQuery, gql, TypedDocumentNode, useSuspenseQuery, useBackgroundQuery, useReadQuery, QueryRef, OperationVariables } from '@apollo/client';
import { GET_MARKETPLACE_NFTS } from "@/apollo/subgraphQueries"
import client from "@/lib/apollo-client";
import NFTsPagination from './NFTsPagination';
import { NFT_Owner, NFTtokens, NFTtokensVariables, Transaction } from "@/types/index";
import { bigint } from 'zod';
import { ethToWei } from '@/utils/utils';
import { useFilters } from '@/context/FilterContext';
import { useNFTperRow } from '@/context/NFTperRowContext';



interface MarketplaceProps {
    totalData: QueryRef<NFTtokens, NFTtokensVariables>;
    queryRef: QueryRef<NFTtokens, NFTtokensVariables>;
    isPending: boolean;
    onRefetch: () => void;
    onFetchMore: () => void;
}


const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event)
};


export default function Marketplace({ totalData, queryRef, onFetchMore }: MarketplaceProps) {
  // const { address, chainId, isConnected } = useWeb3ModalAccount()
  // const { walletProvider } = useWeb3ModalProvider()


  const { searchText, tags, setTags, orderBy, setOrderBy, orderDirection, setOrderDirection, page, setPage } = useFilters();
  const { nftPerRow } = useNFTperRow();

  if (!queryRef) {
    return (<div>undefined</div>);
  }

  ///  Query with Suspense and Background/Read
  const { data } = useReadQuery(queryRef);
  console.log(data)

  const { data: countData } = useReadQuery(totalData);
  const num_data = countData?.tokens?.length || 0;
  const n_pages = Math.ceil(num_data / nftPerRow);
  console.log("numero pagine calcolate: ", n_pages);


  const pass = {tokens: data?.tokens};
  console.log(pass);

    return (
        <div>
            <div>
                <NFTList data={data} />
            </div>
            <div className="pb-4">
                <NFTsPagination n_pages={n_pages} onChange={onChange} onFetchMore={onFetchMore} />
            </div>
        </div>
    )
}