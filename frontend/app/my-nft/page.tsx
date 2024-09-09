'use client';

import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import BaseNFTBox from '@/components/BaseNFT';
import ListedNFTBox from '@/components/ListedNFT';
import ConnectButton from '@/components/ConnectButton';
// import NFTsHeader from '@/components/NFTsHeader';

// import { RelayEnvironmentProvider } from '@/components/RelayEnvironmentProvider';
import { fetchGraphQLQuery } from '@/relay/fetchGraphQLQuery';
import { graphql } from 'relay-runtime';
// import { RelayRecordMapPublisher } from '@/components/RelayRecordMapPublisher';
// import type { page_RootLayoutQuery, page_RootLayoutQuery$variables } from '@/app/marketplace/__generated__/page_RootLayoutQuery.graphql';
import ErrorBoundary from '@/components/ErrorBoundary';
import NFTsHeader from '@/components/NFTsHeader';
import { SkeletonCard } from '@/components/SkeletonCard';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

import { Suspense, useTransition  } from 'react';
import NFTList from '@/components/NFTList';

// Import everything needed to use the `useQuery` hook
import { ApolloProvider, useQuery, gql, TypedDocumentNode, useSuspenseQuery, useBackgroundQuery } from '@apollo/client';
import { GET_OWNER_NFTS } from "@/apollo/subgraphQueries"
import client from "@/lib/apollo-client";
import Marketplace from '@/components/Marketplace';
import MarketplaceStructure from '@/components/MarketplaceStructure';
import MyNFTStructure from '@/components/MyNFTStructure';
import { FilterProvider } from '@/context/FilterContext';


export default function ResponsiveGrid() {
  // const { address, chainId, isConnected } = useWeb3ModalAccount()
  // const { walletProvider } = useWeb3ModalProvider()

  return (
    <div>
      <FilterProvider>
        <ApolloProvider client={client}>
          <MyNFTStructure />
        </ApolloProvider>
      </FilterProvider>
    </div>
  );
}

// // 'use client'

// import * as React from 'react';
// import { Suspense } from 'react';
// import { experimentalStyled as styled } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Unstable_Grid2';
// import BaseNFTBox from '@/components/BaseNFT';
// import { NFTList }from '@/components/NFTList';

// import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
// import { BrowserProvider, Contract, Eip1193Provider, ethers, formatUnits } from 'ethers'
// import { ERC6956Full__factory } from '@/typechain/factories/contracts/ERC6956Full__factory';
// import { ERC6956Full } from '@/typechain/contracts/ERC6956Full';
// import ERC6956Full_address from "../../contractsData/ERC6956Full_address.json";

// import { RelayEnvironmentProvider } from '@/components/RelayEnvironmentProvider';
// import { fetchGraphQLQuery } from '@/relay/fetchGraphQLQuery';
// import { graphql } from 'relay-runtime';
// import { RelayRecordMapPublisher } from '@/components/RelayRecordMapPublisher';
// import type { page_RootLayoutWithAddressQuery, page_RootLayoutWithAddressQuery$variables } from '@/app/my-nft/__generated__/page_RootLayoutWithAddressQuery.graphql';
// import ErrorBoundary from '@/components/ErrorBoundary';
// import NFTsHeader from '@/components/NFTsHeader';
// import { SkeletonCard } from '@/components/SkeletonCard';
// import { string } from 'zod';

// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination"


// const pageLayoutWithAddressQuery = graphql`
//     query page_RootLayoutWithAddressQuery($ownerAddress: ID!, $first: Int, $skip: Int) @raw_response_type {
//         ...NFTListWithAddress_query @arguments(ownerAddress: $ownerAddress, first: $first, skip: $skip)
//     }
// `;


// // IN QUESTA PAGINA QUELLO CHE DOVRò FARE è USARE LA balancOf DAL PROPRIO ADDRESS
// // USANDO L'ADDRESS DEL CONTRATTO USATO DA ERC6956Full (O ERC6956)
// // DOPODICHè SEMPLICEMENTE MOSTRIAMO TUTTI I DATI
// // PRESI (SE NON HO CAPITO MALE) DA Pinata (IL NOSTRO IPFS PROVIDER)
// // ANDRANNO FATTI CONTROLLI SE L'NFT è IN VENDITA O NO

// const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//   console.log(event)
// };

// // nftArray sarà tutti gli nft di questo tipo CHE SONO DI PROPRIETà DELLO USER CONNESSO
// const nftArray = [{'nft': 'ciao'}, {'nft': 'ciao'}, {'nft': 'ciao'}, {'nft': 'ciao'}];

// export default async function ResponsiveGrid() {
//   // const { address, chainId, isConnected } = useWeb3ModalAccount()
//   // const { walletProvider } = useWeb3ModalProvider()

//   // console.log("address: ", address)
//   // const owner: NFTsContainerProps = {
//   //   owner: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
//   // };

//   // async function getTokenList() {
//   //   try {
//   //       // Ensure the user is connected
//   //       if (!isConnected) throw new Error('User disconnected');
        
//   //       // Set up the ethers provider
//   //       const ethersProvider = new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider);
//   //       console.log("provider");
//   //       console.log(ethersProvider);

//   //       // // Get the block number
//   //       // const blockNumber = await ethersProvider.getBlockNumber();
//   //       // console.log("Latest block number:", blockNumber);
        
//   //       // Get the signer from the provider
//   //       const signer = await ethersProvider.getSigner();
//   //       console.log("signer");
//   //       console.log(signer);

//   //       // // Get the current nonce (transaction count)
//   //       const currentNonce = await ethersProvider.getTransactionCount(await signer.getAddress());
//   //       console.log("Latest transaction:", currentNonce);
        
//   //       // The Contract object
//   //       // const ercContract = new ethers.Contract(ERC6956Full_address.address, ERC6956Full.abi, signer) as ERC6956FullContract;
//   //       // Use the factory to create the contract instance
//   //       const ercContract: ERC6956Full = ERC6956Full__factory.connect(ERC6956Full_address.address, signer);
//   //       console.log("ercContract");
//   //       console.log(ercContract);

//   //       // Check if the address is valid
//   //       if (!ethers.isAddress(await signer.getAddress())) {
//   //           throw new Error('Invalid address');
//   //       }

//   //       console.log("control okay")

//   //       const ercContractWithSigner = ercContract.connect(signer);
//   //       console.log(ercContract)
//   //       console.log(await signer.getAddress())
//   //       // Call the ERC6956 contract's tokensOfOwner function to get the list of tokens
//   //       const numTokensOwned = await ercContract.balanceOf(await signer.getAddress());
//   //       console.log(`Number of tokens owned by ${await signer.getAddress()}:`, numTokensOwned);

//   //       // Loop through all tokens owned by ownerAddress
//   //       const tokenIds = [];
//   //       for (let i = 0; i < numTokensOwned; i++) {
//   //         const tokenId = await ercContract.tokenOfOwnerByIndex(await signer.getAddress(), i);
//   //         tokenIds.push(tokenId);
//   //       }

//   //       console.log(`Tokens owned by ${await signer.getAddress()}:`, tokenIds);
//   //   }
//   //   catch (error) {
//   //     console.error('Error:', error);
//   //   }
//   // }

//   // getTokenList()

//   // const ownerAddress = address as string
//   const ownerAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
//   let currentPage = 1;
//   const nftsPerPage = 3;
//   const first = nftsPerPage;
//   let skip = nftsPerPage * (currentPage - 1);
//   const variables: page_RootLayoutWithAddressQuery$variables = {ownerAddress: ownerAddress, first: first, skip: skip}

//   // const { data, recordMap, operationDescriptor } = await fetchGraphQLQuery<page_RootLayoutQuery>(pageLayoutQuery, {});
//   const { data, recordMap, operationDescriptor } = await fetchGraphQLQuery<page_RootLayoutWithAddressQuery>(pageLayoutWithAddressQuery, variables);
//   console.log("fetchGraphQLQuery call done");

  
//   return (
//     <div>
//       <NFTsHeader onChange={onChange} />
//         <RelayEnvironmentProvider>
//           <RelayRecordMapPublisher recordMap={recordMap} operationDescriptor={operationDescriptor}>
//               <div className="App">
//                 <ErrorBoundary fallback={<div>Error loading data</div>}>
//                   <Suspense fallback={<SkeletonCard></SkeletonCard>}>
//                     <NFTList query={data} ownerAddress={ownerAddress} />
//                     {true &&
//                       <Pagination>
//                           <PaginationContent>
//                               <PaginationItem>
//                                   <PaginationPrevious href="#" />
//                               </PaginationItem>

//                               <PaginationItem>
//                                   <PaginationLink href="#" isActive>1</PaginationLink>
//                               </PaginationItem>
//                               <PaginationItem>
//                                   <PaginationLink href="#">2</PaginationLink>
//                               </PaginationItem>
//                               <PaginationItem>
//                                   <PaginationLink href="#">3</PaginationLink>
//                               </PaginationItem>
//                               <PaginationItem>
//                                   <PaginationEllipsis />
//                               </PaginationItem>
//                               <PaginationItem>
//                                   <PaginationNext href="#" />
//                               </PaginationItem>
//                           </PaginationContent>
//                       </Pagination>
//                     }
//                   </Suspense>
//                 </ErrorBoundary>
//               </div>
//           </RelayRecordMapPublisher>
//         </RelayEnvironmentProvider>
//         {/* <Tags/> */}
//         {/* <Box sx={{ flexGrow: 1 }}>
//           <NFTsContainer owner={owner.owner} />
//             <Grid container rowSpacing={{ xs: 1, sm: 2, md: 3 }} spacing={{ xs: 2, sm: 3, md: 4 }} columns={{ xs: 1, sm: 8, md: 12 }} className="grid-item">
//                 {nftArray.map((nft, index) => (
//                 <Grid xs={1} sm={4} md={4} key={index}>
//                     <BaseNFTBox />
//                 </Grid>
//                 ))}
//           </Grid>
//         </Box> */}
//     </div>
//   );
// }