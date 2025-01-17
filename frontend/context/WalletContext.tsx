import { createContext, ReactNode, useContext } from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';


interface FilterStateType {
  address: string | undefined
}

interface NFTperRowContextType extends FilterStateType {
}

const defaultFilterState: FilterStateType = {
  address: undefined
};


const WalletContext = createContext<NFTperRowContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { address, isConnected } = useWeb3ModalAccount();

  return (
    <WalletContext.Provider value={{ address }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
