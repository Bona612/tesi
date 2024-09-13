'use client';

import * as React from 'react';

// Import everything needed to use the `useQuery` hook
import { ApolloProvider, useQuery, gql, TypedDocumentNode, useSuspenseQuery, useBackgroundQuery } from '@apollo/client';
import { GET_OWNER_REDEEM_NFTS } from "@/apollo/subgraphQueries"
import client from "@/lib/apollo-client";
import Marketplace from '@/components/Marketplace';
import MarketplaceStructure from '@/components/MarketplaceStructure';
import MyNFTStructure from '@/components/MyNFTStructure';
import RedeemStructure from '@/components/RedeemStructure';


export default function ResponsiveGrid() {
  // const { address, chainId, isConnected } = useWeb3ModalAccount()
  // const { walletProvider } = useWeb3ModalProvider()

  return (
    <div>
        <ApolloProvider client={client}>
          <RedeemStructure />
        </ApolloProvider>
    </div>
  );
}
