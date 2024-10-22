'use client'


import * as React from "react";
import { Transaction } from "@/types/index";
import { ScrollArea } from "./ui/scroll-area";


function formatTimestamp(timestamp: bigint) {
  const date = new Date(Number(timestamp) * 1000); // Assuming timestamp is in seconds
  return date.toLocaleString("en-US", {
    timeZone: "UTC", // Normalizing to UTC to avoid inconsistencies
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

interface NFTHistoryProps {
  transactions?: Transaction[];
}

export default function NFTHistory({ transactions = [] }: NFTHistoryProps) {

  return (
    <div>
      <h4 className="mb-4 text-sm font-medium leading-none"><strong>Transaction History</strong></h4>
      <ScrollArea className="h-auto w-full rounded-md border p-2 sm:p-4">
        <div className="overflow-x-auto">
          {transactions.length > 0 ? (
              <div className="flex flex-col space-y-4">
                {transactions.map((transaction, index) => (
                  <div key={`${transaction.id}`} className="text-sm whitespace-nowrap overflow-x-auto hide-scrollbar">
                    <>
                      <strong>Transaction ID: </strong> {transaction.id}<br />
                      <strong>From: </strong> {transaction.from.id}<br />
                      <strong>To: </strong> {transaction.to.id}<br />
                      <strong>Token: </strong> {transaction.token.id}<br />
                      <strong>Date: </strong> {formatTimestamp(transaction.timestamp)}<br />
                    </>
                  </div>
                ))}
              </div>
          ) : (
            <div className="text-sm text-gray-500">No transactions found</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
