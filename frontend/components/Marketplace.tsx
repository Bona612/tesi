'use client';

import * as React from 'react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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

//   if (!queryRef) {
//     return (<div>undefined</div>);
//   }

  ///  Query with Suspense and Background/Read
  const { data, error } = useReadQuery(queryRef);
  console.log(data)
  const pass = {tokens: data?.tokens};
  console.log(pass);

  const { data: countData, error: errorCount } = useReadQuery(totalData);
  const num_data = countData?.tokens?.length || 1;
  const n_pages = Math.ceil(num_data / nftPerRow);
  console.log("num data: ", num_data);
  console.log("numero pagine calcolate: ", n_pages);


  
//   if (error) {
//     return (<p>undefined</p>);
//   }

    return (
        <div>
            <div>
                <NFTList data={data} />
            </div>
            <div>
                <NFTsPagination n_pages={n_pages} onChange={onChange} onFetchMore={onFetchMore} />
            </div>
        </div>
    )
}