"use client"

// app/form/page.tsx
import React from 'react';
import { Container, Typography } from '@mui/material';
import Home from "@/app/page";
import NFTForm from "@/components/NFTForm";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { FilterProvider } from '@/context/FilterContext';



interface TransactionReceipt {
    events: Array<{ args: { tokenId: string } }>;
}

interface Transaction {
    wait: (confirmations?: number) => Promise<TransactionReceipt>;
}


const FormPage: React.FC = () => {
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()
    console.log(isConnected)
    console.log(address)


    return (
        <div>
            <FilterProvider>
                <NFTForm />
            </FilterProvider>
        </div>
    );
};

export default FormPage;