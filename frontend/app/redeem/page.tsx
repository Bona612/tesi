'use client';

import * as React from 'react';
import RedeemStructure from '@/components/RedeemStructure';
import { FilterProvider } from '@/context/FilterContext';
import { NFTperRowProvider } from '@/context/NFTperRowContext';


export default function ResponsiveGrid() {

  return (
    <div>
        <NFTperRowProvider>
          <FilterProvider>
            <RedeemStructure />
          </FilterProvider>
        </NFTperRowProvider>
    </div>
  );
}
