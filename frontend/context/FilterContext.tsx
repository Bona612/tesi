import { OrderBy, OrderDirection, OrderDirectionEnum, Tag } from '@/types';
import React, { createContext, useState, useContext, ReactNode } from 'react';


interface FilterStateType {
  searchText: string,
  tags: Tag[],
  orderBy: OrderBy;
  orderDirection: OrderDirection;
  page: number,
}

interface FilterContextType extends FilterStateType {
  setSearchText: (searchText: string) => void,
  setTags: (tags: Tag[]) => void,
  setOrderBy: (orderBy: OrderBy) => void;
  setOrderDirection: (orderDirection: OrderDirection) => void,
  setPage: (page: number) => void,
  resetFilters: () => void
}

const defaultFilterState: FilterStateType = {
  searchText: "",
  tags: [],
  orderBy: {name: 'name', label: "Name"},
  orderDirection: OrderDirectionEnum.desc,
  page: 1,
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchText, setSearchText] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [orderBy, setOrderBy] = useState<OrderBy>({name: 'name', label: "Name"});
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(OrderDirectionEnum.desc);
  const [page, setPage] = useState<number>(1);

  
  const resetFilters = () => {
    setSearchText(defaultFilterState.searchText);
    setTags(defaultFilterState.tags);
    setOrderBy(defaultFilterState.orderBy);
    setOrderDirection(defaultFilterState.orderDirection);
    setPage(defaultFilterState.page);
  };

  const value = {
    searchText,
    setSearchText,
    tags,
    setTags,
    orderBy,
    setOrderBy,
    orderDirection,
    setOrderDirection,
    page,
    setPage,
    resetFilters
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
