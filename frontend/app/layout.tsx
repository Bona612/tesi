import type { Metadata } from "next";

import { Inter } from "next/font/google";
import './globals.css'

import Structure from "@/components/Structure";
import { ApolloWrapper } from "./ApolloWrapper";



export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marketplace NFT - ERC6956",
  description: "",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Add meta tags or other head elements here */}
      </head>
      <body className={`${inter.className} flex-grow overflow-y-auto pb-16 md:pb-0`}>
        <div>
          <Structure>
            <ApolloWrapper>{children}</ApolloWrapper>
          </Structure>
        </div>
      </body>
    </html>
  );
}