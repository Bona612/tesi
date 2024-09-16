'use client';

import * as React from 'react';

import NFTList from '@/components/NFTList';

// Import everything needed to use the `useQuery` hook
import { ApolloProvider, useQuery, gql, TypedDocumentNode, useSuspenseQuery, useBackgroundQuery } from '@apollo/client';
import { GET_OWNER_NFTS } from "@/apollo/subgraphQueries"
// import client from "@/lib/apollo-client";
import Marketplace from '@/components/Marketplace';
import MarketplaceStructure from '@/components/MarketplaceStructure';
import MyNFTStructure from '@/components/MyNFTStructure';
import { FilterProvider } from '@/context/FilterContext';
import { NFTperRowProvider } from '@/context/NFTperRowContext';


export default function ResponsiveGrid() {
  // const { address, chainId, isConnected } = useWeb3ModalAccount()
  // const { walletProvider } = useWeb3ModalProvider()

  return (
    <div>
      <NFTperRowProvider>
        <FilterProvider>
          {/* <ApolloProvider client={client}> */}
            <MyNFTStructure />
          {/* </ApolloProvider> */}
        </FilterProvider>
      </NFTperRowProvider>
    </div>
  );
}
