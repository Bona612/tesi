'use client'


import * as React from "react"

import { Tag, Transaction } from "@/types/index";
import { ScrollArea } from "./ui/scroll-area";


interface NFTHistoryProps {
  transactions: Transaction[],
}


export default function NFTHistory({ transactions }: NFTHistoryProps) {
    // const { address, chainId, isConnected } = useWeb3ModalAccount()
    // const { walletProvider } = useWeb3ModalProvider()


    return (
        <ScrollArea className="h-72 w-48 rounded-md border">
          <div className="p-4">
            {/* <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4> */}
            {transactions.map((transaction) => (
              <div key={transaction.id} className="text-sm">
                {transaction.id}
              </div>
            ))}
          </div>
        </ScrollArea>
    )
}