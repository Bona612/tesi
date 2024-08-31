import type { Metadata } from "next";
import Head from 'next/head';
import { Inter } from "next/font/google";
import './globals.css'

import NavBar from "@/components/AppBar";
import NFTBox from "@/components/BaseNFT";
import ConnectButton from "@/components/ConnectButton";
import { StyledEngineProvider } from '@mui/material/styles';

import { Web3Modal } from '../context/web3modal'
import AppBar from "@/components/ui/appbar";
import { TagFilter } from "@/components/TagFilter";
import SearchBar from "@/components/ui/SearchBar";
import NavMenu from "@/components/NavMenu";
import { OrderByFilter } from "@/components/OrderByFilter";
import TagList from "@/components/TagListWithContext";
import NFTsHeader from "@/components/NFTsHeader";

import { ApolloProvider } from '@apollo/client';
import client from '../lib/apollo-client';

import { Toaster } from "@/components/ui/toaster"



export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

type Order = {
  by: string;
  label: string;
}

const orders: Order[] = [
  {
      by: "Name",
      label: "Name"
  },
  {
      by: "Alphabetical",
      label: "Alphabetical"
  }
];



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Other <head> tags like title, favicon, etc., can be added here */}
      </Head>
      <body className={inter.className}>
        <div>
          {/* <StyledEngineProvider injectFirst>
            <NavBar />
          </StyledEngineProvider> */}

          {/* <NavMenu /> */}
          <div>
            {/* <div className="flex m-4">
              <SearchBar placeholder="Search..." />
              <TagFilter />
              <OrderByFilter />
            </div>
            <div>
              <TagList></TagList>
            </div> */}
          </div>
          {/* <AppBar></AppBar>
          <TagsFilter></TagsFilter> */}
          <Web3Modal>
            <NavMenu />
            {/* <ApolloProvider client={client}> */}
            {children}
            {/* </ApolloProvider> */}
          </Web3Modal>
          <Toaster />
        </div>
      </body>
    </html>
  );
}