'use client';

import * as React from 'react';
import NFTList from '@/components/NFTList';

import { useReadQuery, QueryRef } from '@apollo/client';
import NFTsPagination from './NFTsPagination';
import { NFTtokens, NFTtokensVariables } from "@/types/index";
import { useFilters } from '@/context/FilterContext';
import { useNFTperRow } from '@/context/NFTperRowContext';



interface MarketplaceProps {
    totalData: QueryRef<NFTtokens, NFTtokensVariables>;
    queryRef: QueryRef<NFTtokens, NFTtokensVariables>;
    isPending: boolean;
    onFetchMore: () => void;
}


const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
};


export default function Marketplace({ totalData, queryRef, onFetchMore }: MarketplaceProps) {
  //const { searchText, tags, setTags, orderBy, setOrderBy, orderDirection, setOrderDirection, page, setPage } = useFilters();
  const { nftPerRow } = useNFTperRow();

  const { data, error } = useReadQuery(queryRef);
  const pass = {tokens: data?.tokens};

  const { data: countData, error: errorCount } = useReadQuery(totalData);
  const num_data = countData?.tokens?.length;
  const n_pages = Math.ceil(num_data / nftPerRow) || 1;


    return (
        <div>
            <div>
                <NFTList data={data} />
            </div>
            {num_data > 0 &&
              <div>
                  <NFTsPagination n_pages={n_pages} onChange={onChange} onFetchMore={onFetchMore} />
              </div>
            } 
        </div>
    )
}