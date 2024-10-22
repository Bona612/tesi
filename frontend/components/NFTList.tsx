'use client'


import * as React from 'react';
import BaseNFTBox from '@/components/BaseNFT';


import Grid from './Grid';
import { NFTtokens } from "@/types/index";

  
type NFTListProps = {
    data: NFTtokens;
    ownerAddress?: string;
};



const NFTList = React.memo(({ data, ownerAddress }: NFTListProps) => {

  return (
    <div>
        <Grid>
            {data?.tokens && data?.tokens.map((nft, idx) => (
                <BaseNFTBox nft={nft} key={`${nft.id}-${idx}`} />
            ))}
        </Grid>
    </div>
  );
});

NFTList.displayName = 'NFTList';

export default NFTList;
