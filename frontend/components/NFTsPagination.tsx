// 'use client';

import * as React from 'react';
import { useState } from 'react';

import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import BaseNFTBox from '@/components/BaseNFT';
import ListedNFTBox from '@/components/ListedNFT';
import ConnectButton from '@/components/ConnectButton';
// import NFTsHeader from '@/components/NFTsHeader';

import { RelayEnvironmentProvider } from '@/components/RelayEnvironmentProvider';
import { fetchGraphQLQuery } from '@/relay/fetchGraphQLQuery';
import { graphql } from 'relay-runtime';
import { RelayRecordMapPublisher } from '@/components/RelayRecordMapPublisher';
import type { page_RootLayoutQuery, page_RootLayoutQuery$variables } from '@/app/marketplace/__generated__/page_RootLayoutQuery.graphql';
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

import { Suspense } from 'react';
import NFTList from '@/components/NFTList';

// Import everything needed to use the `useQuery` hook
import { ApolloProvider, useQuery, gql, TypedDocumentNode, useSuspenseQuery } from '@apollo/client';
import { GET_NFTS } from "@/apollo/subgraphQueries"
import client from "@/lib/apollo-client";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useFilters } from '@/context/FilterContext';



interface NFTsPaginationProps {
    n_pages: number,
    first: number,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    setSkip: React.Dispatch<React.SetStateAction<number>>;
    onFetchMore: () => void;
}


export default function NFTsPagination({n_pages, first, onChange, setSkip, onFetchMore}: NFTsPaginationProps) {
    // const { address, chainId, isConnected } = useWeb3ModalAccount()
    // const { walletProvider } = useWeb3ModalProvider()

    // const [page, setCurrentPage] = useState(1);
    const {page, setPage} = useFilters();

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()


    const handlePrevious = () => {
        if (page > 1) {
            setPage(page - 1);
            setSkip((page - 1) * first);
            onFetchMore();
        }
    };
    
    const handleNext = () => {
        if (page < n_pages) {
            setPage(page + 1);
            setSkip((page - 1) * first);
            onFetchMore();
        }
    };
    
    const handlePageChange = (page: number) => {
        setPage(page);
        setSkip((page - 1) * first);
        onFetchMore();
    };

    const createQueryString = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value);
        return params.toString();
    };
    
    // Generate pagination items
    const renderPaginationItems = () => {
        const items = [];

        // Add previous button if not on the first page
        if (page > 1) {
            items.push(
                <PaginationItem key="prev">
                    <PaginationPrevious href={`${pathname}?${createQueryString('page', (page - 1).toString())}`} onClick={handlePrevious} />
                </PaginationItem>
            );
        }

        // Determine range of pages to show
        let startPage = 1;
        let endPage = n_pages;
    
        if (n_pages > 7) {
            if (page <= 4) {
                endPage = 5;
            } else if (page + 3 >= n_pages) {
                startPage = n_pages - 4;
            } else {
                startPage = page - 2;
                endPage = page + 2;
            }

            if (startPage > 1) {
                items.push(
                    <PaginationItem key="1">
                        <PaginationLink
                            href={`${pathname}?${createQueryString('page', '1')}`}
                            isActive={page === 1}
                            onClick={() => handlePageChange(1)}
                        >
                            1
                        </PaginationLink>
                    </PaginationItem>
                );
                if (startPage > 2) {
                    items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis />
                    </PaginationItem>
                    );
                }
            }

            for (let page = startPage; page <= endPage; page++) {
                items.push(
                    <PaginationItem key={page}>
                        <PaginationLink
                            href={`${pathname}?${createQueryString('page', page.toString())}`}
                            isActive={page === page}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (endPage < n_pages - 1) {
                items.push(
                    <PaginationItem key="ellipsis2">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            if (endPage < n_pages) {
                items.push(
                    <PaginationItem key={n_pages}>
                        <PaginationLink
                            href={`${pathname}?${createQueryString('page', n_pages.toString())}`}
                            isActive={page === n_pages}
                            onClick={() => handlePageChange(n_pages)}
                        >
                            {n_pages}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } 
        else {
            for (let page = 1; page <= n_pages; page++) {
                items.push(
                    <PaginationItem key={page}>
                        <PaginationLink
                            href={`${pathname}?${createQueryString('page', page.toString())}`}
                            isActive={page === page}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }
    
        // Add next button if not on the last page
        if (page < n_pages) {
          items.push(
            <PaginationItem key="next">
              <PaginationNext href={`${pathname}?${createQueryString('page', (page + 1).toString())}`} onClick={handleNext} />
            </PaginationItem>
          );
        }
    
        return items;
    };


    return (
        <div className="nfts-pagination">
            <Pagination>
                <PaginationContent>
                    {renderPaginationItems()}
                </PaginationContent>
            </Pagination>
        </div>
    )
}