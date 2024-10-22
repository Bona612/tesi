'use client';

import * as React from 'react';

import MyNFTStructure from '@/components/MyNFTStructure';
import { FilterProvider } from '@/context/FilterContext';
import { NFTperRowProvider } from '@/context/NFTperRowContext';


export default function ResponsiveGrid() {

  return (
    <div>
      <NFTperRowProvider>
        <FilterProvider>
            <MyNFTStructure />
        </FilterProvider>
      </NFTperRowProvider>
    </div>
  );
}
