'use client';

import * as React from 'react';

// Import everything needed to use the `useQuery` hook
import { useReadQuery, QueryRef } from '@apollo/client';
import NFTsPagination from './NFTsPagination';
import { ownerVariables, OwnerNFTtokens } from "@/types/index";
import NFTList from './NFTList';
import { useFilters } from '@/context/FilterContext';
import { useNFTperRow } from '@/context/NFTperRowContext';



interface MarketplaceProps {
    totalData: QueryRef<OwnerNFTtokens, ownerVariables>;
    queryRef: QueryRef<OwnerNFTtokens, ownerVariables>;
    isPending: boolean;
    onFetchMore: () => void;
}


const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
};


export default function MyNFT({ totalData, queryRef, onFetchMore }: MarketplaceProps) {
  const { searchText, tags, setTags, orderBy, setOrderBy, orderDirection, setOrderDirection, page, setPage } = useFilters();
  const { nftPerRow } = useNFTperRow();


  const { data, error } = useReadQuery(queryRef);
  const pass = {tokens: data?.owner?.nfts};

  const { data: countData, error: errorCount } = useReadQuery(totalData);
  const num_data = countData?.owner?.nfts.length
  const n_pages = Math.ceil(num_data / nftPerRow) || 1;


    return (
        <div>
            <div>
                <NFTList data={pass} />
            </div>
            {num_data > 0 &&
              <div>
                  <NFTsPagination n_pages={n_pages} onChange={onChange} onFetchMore={onFetchMore} />
              </div>
            }  
        </div>
    )
}