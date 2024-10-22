'use client';

import * as React from 'react';


import MarketplaceStructure from '@/components/MarketplaceStructure';
import { FilterProvider } from '@/context/FilterContext';
import { NFTperRowProvider } from '@/context/NFTperRowContext';


export default function ResponsiveGrid() {

  return (
    <div>
      <NFTperRowProvider>
        <FilterProvider>
          <MarketplaceStructure />
        </FilterProvider>
      </NFTperRowProvider>
    </div>
  );
}