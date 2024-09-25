// contexts/NFTGridContext.js
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useMediaQueries } from '../hooks/useMediaQuery';


interface FilterStateType {
    nftPerRow: number
}

interface NFTperRowContextType extends FilterStateType {
    setNftPerRow: (nftPerRow: number) => void
}

const defaultFilterState: FilterStateType = {
    nftPerRow: 3
};


const NFTperRowContext = createContext<NFTperRowContextType | undefined>(undefined);

export const NFTperRowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const screenSize = useMediaQueries(); // Get the current screen size
  const [nftPerRow, setNftPerRow] = useState(3); // Default value

  useEffect(() => {
    switch (screenSize) {
      case 'extralarge':
        setNftPerRow(4); // Extra large screens show 5 NFTs per row
        break;
      case 'large':
        setNftPerRow(3); // Large screens show 4 NFTs per row
        break;
      case 'medium':
        setNftPerRow(2); // Medium screens show 3 NFTs per row
        break;
      case 'small':
        setNftPerRow(1); // Small screens show 2 NFTs per row
        break;
      default:
        setNftPerRow(3); // Default to 3 NFTs per row
        break;
    }
  }, [screenSize]);

  return (
    <NFTperRowContext.Provider value={{ nftPerRow, setNftPerRow }}>
      {children}
    </NFTperRowContext.Provider>
  );
};

export const useNFTperRow = () => {
    const context = useContext(NFTperRowContext);
    if (!context) {
      throw new Error('useNFTperRow must be used within a NFTperRowProvider');
    }
    return context;
};