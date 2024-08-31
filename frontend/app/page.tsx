import React from "react";
import Image from "next/image";
import NFTBox from "@/components/BaseNFT";
import ConnectButton from "@/components/ConnectButton";
import BaseNFTBox from "@/components/BaseNFT";

export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

export default function HomePage() {
  
    return (
      <div className="xl:px-24 px-10">
        <div className="my-12">
            {/* <BaseNFTBox nft={{
              id: "1",
              tokenId: 1,
              anchor: "1",
              metadataURI: {title: "titolo", description: "descrizione", imageURI: "https://dummyimage.com/300.png/09f/fff"},
              tags: ["Tag 1"]
            }} /> */}
        </div>
      </div>
    );
  }