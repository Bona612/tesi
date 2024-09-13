'use client'


import * as React from 'react';
// import Grid from '@mui/material/Unstable_Grid2';
import BaseNFTBox from '@/components/BaseNFT';

import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { BrowserProvider, Contract, Eip1193Provider, ethers, formatUnits } from 'ethers'
// import { ERC6956Full__factory } from '@/typechain/factories/contracts/ERC6956Full__factory';
// import { ERC6956Full } from '@/typechain/contracts/ERC6956Full';
// import ERC6956Full_address from "../../contractsData/ERC6956Full_address.json";

import Link from 'next/link';
import Grid from './Grid';
import { NFTtokens, NFTtokensVariables } from "@/types/index";

import { Stringifier } from 'postcss';

import {
  gql,
  TypedDocumentNode,
  useSuspenseQuery
} from '@apollo/client';


  
type NFTListProps = {
    data: NFTtokens;
    ownerAddress?: string;
};



// This is the Client Component because it implements pagination with `usePaginationFragment`.
const NFTList = React.memo(({ data, ownerAddress }: NFTListProps) => {
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()


  console.log("data: ")
  console.log(data)
  // let data: string | never[] = [];
  let nftArray = data?.tokens;


  return (
    <div>
        <Grid>
            {data?.tokens.map((nft, idx) => (
                <BaseNFTBox nft={nft} key={`${nft.id}-${idx}`} />
            ))}
        </Grid>
    </div>
  );
});

NFTList.displayName = 'NFTList';

export default NFTList;
