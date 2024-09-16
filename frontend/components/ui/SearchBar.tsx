import React from 'react';
import styles from './SearchBar.module.css';
import { ApolloProvider, useQuery, gql, TypedDocumentNode, useSuspenseQuery, useBackgroundQuery, useLoadableQuery, LoadQueryFunction, OperationVariables } from '@apollo/client';
import { useFilters } from '@/context/FilterContext';


interface SearchBarProps {
  placeholder: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onChange }) => {
  const { setSearchText } = useFilters();

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = event.target.value;
    console.log(inputValue);
    setSearchText(event.target.value);
  }


  return (
    <div className="flex justify-center flex-grow"> {/*<div className={styles.searchContainer}>*/}
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleOnChange}
        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"// className={styles.searchInput}
      />
    </div>
  );
};

export default React.memo(SearchBar);