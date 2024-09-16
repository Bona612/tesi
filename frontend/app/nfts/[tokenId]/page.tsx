"use client";

import { NFT, NFT_Owner, Tag, Transaction } from "@/types/index";

import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { Metadata } from "@/types/index";
import BackButton from '@/components/BackButton';
import { GetServerSideProps } from 'next';
import { GET_NFT } from "@/apollo/subgraphQueries"
import client from "@/lib/apollo-client";
import ErrorBoundary from '@/components/ErrorBoundary';
import { ApolloProvider, useQuery, gql, TypedDocumentNode, useSuspenseQuery, useBackgroundQuery } from '@apollo/client';
import NFTInfoStructure from '@/components/NFTInfoStructure';
import { FilterProvider } from '@/context/FilterContext';




interface PageParams {
  params: {
    tokenId: string,
  }
};


// async function getTokenURI(tokenId: string) {
//   let tokenURI: string = "";

//   try {
//       const ethersProvider = new ethers.JsonRpcProvider('http://localhost:8545');
//       const ercContract = new ethers.Contract(ERC6956Full_address.address, ERC6956Full.abi, ethersProvider);

//       // const ercContract: ERC6956Full = ERC6956Full__factory.connect(ERC6956Full_address.address, signer);
//       console.log("ercContract");
//       console.log(ercContract);

//       const nonce = 2
//       // Prepare your transaction parameters
//       const txParams = {
//           maxFeePerGas: 703230725 * 2
//           // other parameters as needed
//       };

//       tokenURI = await ercContract.tokenURI(tokenId);
//       console.log("uri for tokenId: ", tokenURI);
//   } catch (error) {
//       console.error('Error:', error);
//   }

//   return tokenURI;
// }

// async function getTokenMetadata(tokenURI: string) {
//   return {} as NFT;
// }

// async function getNFTMetadata(metadataURI: string) {
//   let NFTMetadata: Metadata = {} as Metadata;

//   // chiamata a pinata
//   // NFTMetadata = await getIPFSContent(metadataURI);

//   return NFTMetadata;
// }



export default function Page({ params }: PageParams) {
// const Page = ({ tokenId }: TokenPageProps) => {
// const TokenPageContainer: FC<{ tokenId: string }> = async ({ tokenId }: TokenPageProps) => {
  // const [nft, setNft] = useState<NFT>({} as NFT);
  // const [nftMetadata, setNftMetadata] = useState<Metadata>({} as Metadata);


  // const { address, chainId, isConnected } = useWeb3ModalAccount()
  // const { walletProvider } = useWeb3ModalProvider()
  // console.log(walletProvider)

  const { tokenId } = params
  console.log(tokenId)
  // const nft = await getStartData(tokenId);

  return (
    <div>
      {/* <FilterProvider> */}
        {/* <ApolloProvider client={client}> */}
          <NFTInfoStructure tokenId={tokenId} />
        {/* </ApolloProvider> */}
      {/* </FilterProvider> */}
    </div>
  );
};

// export default Page;
// address={address} isConnected={isConnected} walletProvider={walletProvider}