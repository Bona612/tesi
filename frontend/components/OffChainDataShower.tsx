"use client";

import { ScrollArea } from "./ui/scroll-area";


interface OffChainDataShowerProps {
    anchor: string;
    metadataURI: string;
    imageURI: string;
}


export function OffChainDataShower({anchor, metadataURI, imageURI}: OffChainDataShowerProps) {
    return (
        <div>
            <h4 className="mb-4 text-sm font-medium leading-none"><strong>Off-chain data:</strong></h4>
            <ScrollArea className="h-auto w-full rounded-md border p-2 sm:p-4">
                <div className="overflow-x-auto">
                    <div className="flex flex-col space-y-4">
                        <div key={`${anchor}`} className="text-sm whitespace-nowrap overflow-x-auto hide-scrollbar">
                            <strong>Anchor: </strong> {anchor}<br />
                            <strong>Metadata URI: </strong><a href={metadataURI} target="_blank" rel="noopener noreferrer" className="no-underline hover:underline"> {metadataURI} </a><br />
                            <strong>Image URI: </strong><a href={imageURI} target="_blank" rel="noopener noreferrer" className="no-underline hover:underline"> {imageURI} </a><br />
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}