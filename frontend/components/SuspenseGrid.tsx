'use client'


import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Unstable_Grid2';
import BaseNFTBox from '@/components/BaseNFT';

import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { BrowserProvider, Contract, Eip1193Provider, ethers, formatUnits } from 'ethers'
// import { ERC6956Full__factory } from '@/typechain/factories/contracts/ERC6956Full__factory';
// import { ERC6956Full } from '@/typechain/contracts/ERC6956Full';
// import ERC6956Full_address from "../../contractsData/ERC6956Full_address.json";

import Link from 'next/link';
import { graphql, useFragment, usePaginationFragment } from 'react-relay';
import type { NFTList_query$data, NFTList_query$key } from '@/components/__generated__/NFTList_query.graphql';
import styles from './index.module.css';
import Grid from './Grid';
import { NFTtokens, NFTtokensVariables } from "@/types/index";

import { Stringifier } from 'postcss';
import type { NFTListWithAddress_query$data, NFTListWithAddress_query$key } from '@/components/__generated__/NFTListWithAddress_query.graphql';

import {
  gql,
  TypedDocumentNode,
  useSuspenseQuery
} from '@apollo/client';
import { SkeletonCard } from './SkeletonCard';


  
// type NFTListProps = {
//     data: NFTtokens;
//     ownerAddress?: string;
// };



// This is the Client Component because it implements pagination with `usePaginationFragment`.
const SuspenseGrid = React.memo(() => {
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()

  const iterations = 4; // Number of times you want to iterate
  const componentsArray = Array.from({ length: iterations });


  return (
    <div>
        <Grid>
            {componentsArray.map((_, idx) => (
                <SkeletonCard key={`${idx}`}></SkeletonCard>
            ))}
        </Grid>
    </div>
  );
});

SuspenseGrid.displayName = 'SuspenseGrid';

export default SuspenseGrid;