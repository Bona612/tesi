"use client";


import React, { useState } from 'react';
import { TagFilter } from '@/components/TagFilter';
import { OrderByFilter } from '@/components/OrderByFilter';
import SearchBar from '@/components/ui/SearchBar';
import { Tag, TAGS } from "@/types";
import { LoadQueryFunction, OperationVariables } from '@apollo/client';
import { FloatingButton } from './FloatingButton';
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


    const updateTags = (tag: Tag) => {
        const newTags = tags.includes(tag)
            ? tags.filter((t) => t !== tag)
            : [...tags, tag];
        
        return newTags;
    }

    const handleOnClick = (tag: Tag) => {
        setTags(updateTags(tag));
    };
    
    // const onClick = () => {
    //     console.log("dentro");
    // };
    

    return (
        <div>
            {/* <div>
                <Filters isDesktop={isDesktop} tagList={tagList} handleOnClick={handleOnClick}></Filters>
                {isDesktop ? (
                    <div>
                        <TagFilter tagList={tagList} handleOnClick={handleOnClick} />
                        <OrderByFilter />
                    </div>
                ) : (
                    <>
                    <FloatingButton onClick={onClick}>Filters</FloatingButton>
                    </>
                )}
            </div> */}
            <div className="flex m-4">
                <SearchBar placeholder="Search..." />
                {/* <div>
                    <TagFilter tagList={tagList} handleOnClick={handleOnClick}/>
                    <OrderByFilter />
                </div> */}
                <Filters isDesktop={isDesktop} ></Filters>
                {/* {isDesktop ??
                    <div>
                        <TagFilter tagList={tagList} handleOnClick={handleOnClick}/>
                        <OrderByFilter />
                    </div>
                } */}
            </div>
            <div>
                {tags && <TagListWithContext ></TagListWithContext>}
            </div>
            {/* {!isDesktop ??
                <div>
                    <FloatingButton onClick={onClick}>Filters</FloatingButton>
                </div>
            } */}
        </div>
    );
};

export default NFTsHeader;