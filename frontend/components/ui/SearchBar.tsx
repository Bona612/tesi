import React, { useState, useEffect } from 'react';
import { useFilters } from '@/context/FilterContext';
import { useDebounce } from '@/hooks/useDebounce'; // Adjust the import path to wherever you place the debounce hook

interface SearchBarProps {
  placeholder: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder }) => {
  const { searchText, setSearchText, setPage } = useFilters();
  const [inputValue, setInputValue] = useState(searchText);

  // Debounce the inputValue with a 1000ms delay
  const debouncedSearchText = useDebounce(inputValue, 500);

  useEffect(() => {
    // Always update the searchText, even if debouncedSearchText is an empty string
    setSearchText(debouncedSearchText);
    setPage(1); // Reset the page to 1 on search change
  }, [debouncedSearchText, setSearchText, setPage]);

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value); // Update the local state immediately
  }

  return (
    <div className="flex justify-center flex-grow">
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleOnChange}
        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default React.memo(SearchBar);
