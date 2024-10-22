"use client";


import React from 'react';
import SearchBar from '@/components/ui/SearchBar';
import { Tag } from "@/types";
import { useMediaQuery }from "@/hooks/useMediaQuery"
import { Filters } from './Filters';
import { useFilters } from '@/context/FilterContext';
import TagListWithContext from '@/components/TagListWithContext';



interface SearchBarProps {
    handleSearchBarChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleOrderByChange?: () => void;
    handleOrderDirectionChange?: () => void;
    tagList?: Tag[];
    handleTagChange?: (tag: Tag) => void;
}


const NFTsHeader: React.FC<SearchBarProps> = ({}: SearchBarProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { tags, setTags, orderBy, orderDirection } = useFilters();


    return (
        <div>
            <div>
                <div className="flex m-4">
                    <SearchBar placeholder="Search..." />
                    <Filters isDesktop={isDesktop} ></Filters>
                </div>
                <div>
                    {tags && <TagListWithContext ></TagListWithContext>}
                </div>
            </div>
        </div>
    );
};

export default NFTsHeader;