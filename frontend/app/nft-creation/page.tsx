"use client"

import React from 'react';
import NFTForm from "@/components/NFTForm";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { FilterProvider } from '@/context/FilterContext';



interface TransactionReceipt {
    events: Array<{ args: { tokenId: string } }>;
}


const FormPage: React.FC = () => {
    return (
        <div>
            <FilterProvider>
                <NFTForm />
            </FilterProvider>
        </div>
    );
};

export default FormPage;