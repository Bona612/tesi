import React from "react";
import Image from "next/image";
import NFTBox from "@/components/BaseNFT";
import ConnectButton from "@/components/ConnectButton";
import BaseNFTBox from "@/components/BaseNFT";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

export default function HomePage() {
  
    return (
      <div className="flex items-center justify-center min-h-screen xl:px-24 px-10">
        <div className="my-12">
          <p>
            View the GitHub repository:{" "}
            <Link href="https://github.com/Bona612/tesi">https://github.com/Bona612/tesi</Link>
          </p>
          <p>
            Check out the Wokwi project:{" "}
            <Link href="https://wokwi.com/projects/408504547254311937">https://wokwi.com/projects/408504547254311937</Link>
          </p>
        </div>
      </div>
    );
}