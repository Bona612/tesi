"use client";

import NFTInfoStructure from '@/components/NFTInfoStructure';


interface PageParams {
  params: {
    tokenId: string,
  }
};



export default function Page({ params }: PageParams) {

  const { tokenId } = params;

  return (
    <div>
      <NFTInfoStructure tokenId={tokenId} />
    </div>
  );
};
