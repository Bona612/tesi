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



interface MarketplaceProps {
    // first: number;
    // skip: number;
    // setSkip: React.Dispatch<React.SetStateAction<number>>;
    queryRef: QueryRef<OwnerNFTtokens, ownerVariables>;
    isPending: boolean;
    onRefetch: () => void;
    onFetchMore: () => void;
}


const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event)
};


export default function MyNFT({ queryRef, onFetchMore }: MarketplaceProps) {
  // const { address, chainId, isConnected } = useWeb3ModalAccount()
  // const { walletProvider } = useWeb3ModalProvider()

  const { searchText, tags, setTags, orderBy, setOrderBy, orderDirection, setOrderDirection, page, setPage } = useFilters();

  if (!queryRef) {
    return (<div>undefined</div>);
  }

///  Query with Suspense and Background/Read
  const { data } = useReadQuery(queryRef);
  console.log(data)
  const n_pages = data?.owner?.nfts || 0;
  console.log("numero pagine calcolate: ", n_pages);
//   console.log("data from read query: ", data)
//   console.log(typeof data)


//   // Memoize the fetched data
//   const memoizedData = useMemo(() => data, [data]) as NFTtokens;

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error : {error.message}</p>;

    const pass = {tokens: data?.owner?.nfts};
    console.log(pass);
    return (
        <div>
            <div>
                <NFTList data={pass} />
            </div>
            <div>
                <NFTsPagination n_pages={1} onChange={onChange} onFetchMore={onFetchMore} />
            </div>
        </div>
    )
}