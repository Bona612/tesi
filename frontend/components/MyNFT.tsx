'use client';

import * as React from 'react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


// Import everything needed to use the `useQuery` hook
import { ApolloProvider, useQuery, gql, TypedDocumentNode, useSuspenseQuery, useBackgroundQuery, useReadQuery, QueryRef, OperationVariables } from '@apollo/client';
import { GET_OWNER_NFTS } from "@/apollo/subgraphQueries"
import client from "@/lib/apollo-client";
import NFTsPagination from './NFTsPagination';
import { NFTtokens, NFTtokensVariables, Owner, Data_Owner, ownerVariables, OwnerNFTtokens, Metadatas, Metadata_e } from "@/types/index";
import NFTList from './NFTList';
import { useFilters } from '@/context/FilterContext';
import { useNFTperRow } from '@/context/NFTperRowContext';



interface MarketplaceProps {
    totalData: QueryRef<OwnerNFTtokens, ownerVariables>;
    queryRef: QueryRef<OwnerNFTtokens, ownerVariables>;
    isPending: boolean;
    onRefetch: () => void;
    onFetchMore: () => void;
}


const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event)
};


export default function MyNFT({ totalData, queryRef, onFetchMore }: MarketplaceProps) {
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
  const pass = {tokens: data?.owner?.nfts};
    console.log(pass);

  const { data: countData } = useReadQuery(totalData);
  const num_data = countData?.owner?.nfts.length || 0;
  const n_pages = Math.ceil(num_data / nftPerRow);
  console.log("numero pagine calcolate: ", n_pages);


    return (
        <div>
            <div>
                <NFTList data={pass} />
            </div>
            <div>
                <NFTsPagination n_pages={n_pages} onChange={onChange} onFetchMore={onFetchMore} />
            </div>
        </div>
    )
}