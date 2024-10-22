'use client'


import * as React from 'react';

import Grid from './Grid';
import { SkeletonCard } from './SkeletonCard';
import { useNFTperRow } from '@/context/NFTperRowContext';



const SuspenseGrid = React.memo(() => {
  const { nftPerRow }= useNFTperRow();

  const componentsArray = Array.from({ length: nftPerRow });

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