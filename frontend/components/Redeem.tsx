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
import { GET_OWNER_REDEEM_NFTS } from "@/apollo/subgraphQueries"
import client from "@/lib/apollo-client";
import NFTsPagination from './NFTsPagination';
import { NFTtokens, NFTtokensVariables, Owner, Data_Owner, ownerVariables } from "@/types/index";



interface MarketplaceProps {
    first: number;
    skip: number;
    setSkip: React.Dispatch<React.SetStateAction<number>>;
    queryRef: QueryRef<Data_Owner, ownerVariables>;
    isPending: boolean;
    onRefetch: () => void;
    onFetchMore: () => void;
}


const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event)
};


export default function Redeem({ first, skip, setSkip, queryRef, onFetchMore }: MarketplaceProps) {
  // const { address, chainId, isConnected } = useWeb3ModalAccount()
  // const { walletProvider } = useWeb3ModalProvider()

  // METTERE QUESTA PARTE IN QUESTO COMPONENT, O COMUNQUE IN UN PARENT COMPONENT RISPETTO ALLA QUERY, QUESTO PER LA PAGINATION
//   const [skip, setSkip] = useState(0);
//   const first = 3;


  // let first = 3;
  // let skip = 0;
  // const variables: page_RootLayoutQuery$variables = {first: first, skip: skip}

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

    return (
        <div>
            {/* <div>
                <NFTList data={data} />
            </div>
            <div>
                <NFTsPagination n_pages={n_pages} first={first} onChange={onChange} setSkip={setSkip} onFetchMore={onFetchMore} />
            </div> */}
        </div>
    )
}