'use client';

import * as React from 'react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


// Import everything needed to use the `useQuery` hook
import { ApolloProvider, useQuery, gql, TypedDocumentNode, useSuspenseQuery, useBackgroundQuery, useReadQuery, QueryRef, OperationVariables } from '@apollo/client';
import { GET_OWNER_NFTS } from "@/apollo/subgraphQueries"
import client from "@/lib/apollo-client";
import NFTsPagination from './NFTsPagination';
import { NFTtokens, NFTtokensVariables, Owner, Data_Owner, ownerVariables, OwnerNFTtokens, Metadatas, Metadata_e, searchOwnerVariables } from "@/types/index";
import NFTList from './NFTList';
import { useFilters } from '@/context/FilterContext';
import { useNFTperRow } from '@/context/NFTperRowContext';



interface MarketplaceProps {
    totalData: QueryRef<OwnerNFTtokens, ownerVariables>;
    queryRef: QueryRef<OwnerNFTtokens, ownerVariables>;
    isPending: boolean;
    // onRefetch: () => void;
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

  // if (!queryRef) {
  //   return (<div>undefined</div>);
  // }

  

//   let query: QueryRef<OwnerNFTtokens, ownerVariables> = undefined;
//   let searchQuery: QueryRef<NFTtokens, searchOwnerVariables> = undefined;
//   if (queryRef instanceof QueryRef<OwnerNFTtokens, ownerVariables>) {
//     query = queryRef as QueryRef<OwnerNFTtokens, ownerVariables>;
//   } 
//   else if (queryRef instanceof QueryRef<NFTtokens, searchOwnerVariables>) {
//     searchQuery = queryRef as QueryRef<NFTtokens, searchOwnerVariables>;
//   }


  const { data, error } = useReadQuery(queryRef);
  console.log(data)
  const pass = {tokens: data?.owner?.nfts};
  console.log(pass);

  const { data: countData, error: errorCount } = useReadQuery(totalData);
  const num_data = countData?.owner?.nfts.length
  const n_pages = Math.ceil(num_data / nftPerRow) || 1;
  console.log("numero pagine calcolate: ", n_pages);


  // if (error) {
  //   return (<p>undefined</p>);
  // }

    return (
        <div>
            <div>
                <NFTList data={pass} />
            </div>
            {num_data > 0 &&
              <div>
                  <NFTsPagination n_pages={n_pages} onChange={onChange} onFetchMore={onFetchMore} />
              </div>
            }  
        </div>
    )
}