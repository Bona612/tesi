'use client';

import { Web3Modal } from '@/context/web3modal';
import * as React from 'react';
import NavMenu from './NavMenu';
import { Toaster } from './ui/toaster';
import { WalletProvider } from '@/context/WalletContext';


export default function Structure({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {


  return (
    <div>
        <Web3Modal>
            <WalletProvider>
                <NavMenu />
                {children}
            </WalletProvider>
        </Web3Modal>
        <Toaster />
    </div>
  );
}
