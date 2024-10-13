"use client";

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Anchor, Attestation } from "@/types";
import { Button } from "./ui/button";
import { useEffect, useRef } from "react";
import { useMediaQueries } from "@/hooks/useMediaQuery";
import { ScrollArea } from "./ui/scroll-area";


interface OffChainDataShowerProps {
    anchor: string;
    metadataURI: string;
    imageURI: string;
}


export function OffChainDataShower({anchor, metadataURI, imageURI}: OffChainDataShowerProps) {
    // const textareaRef1 = useRef<HTMLTextAreaElement>(null);
    // const textareaRef2 = useRef<HTMLTextAreaElement>(null);
    // const textareaRef3 = useRef<HTMLTextAreaElement>(null);
    
    // useEffect(() => {
    //     console.log("CHIAMATO1");
    //     const textarea = textareaRef1.current;

    //     const adjustHeight = () => {
    //         if (textarea) {
    //             textarea.style.height = 'auto'; // Reset height to auto
    //             const height = textarea.scrollHeight;
                
    //             // Get padding from the className
    //             const classNames = textarea.className.split(" ");
    //             const paddingClasses = classNames.filter(cls => cls.startsWith('py-'));
    //             const number = paddingClasses[0].split("-")[1]
    //             const classPadding = parseFloat(number);
    //             console.log(classPadding);

    //             // Calculate the new height (scrollHeight + total padding)
    //             const newHeight = height + (classPadding * 4);

    //             // Set the height to the calculated height
    //             textarea.style.height = `${newHeight}px`;
    //         }
    //     };
    
    //     // Adjust height on initial render and when attestationJSON changes
    //     adjustHeight();
    
    //     // Listen for window resize events and adjust textarea height
    //     const handleResize = () => {
    //         adjustHeight();
    //     };
    
    //     window.addEventListener('resize', handleResize);
    
    //     // Cleanup the event listener on component unmount
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []); // Depend on attestationJSON and handle resize events
    // useEffect(() => {
    //     console.log("CHIAMATO2");
    //     const textarea = textareaRef2.current;

    //     const adjustHeight = () => {
    //         if (textarea) {
    //             textarea.style.height = 'auto'; // Reset height to auto
    //             const height = textarea.scrollHeight;
                
    //             // Get padding from the className
    //             const classNames = textarea.className.split(" ");
    //             const paddingClasses = classNames.filter(cls => cls.startsWith('py-'));
    //             const number = paddingClasses[0].split("-")[1]
    //             const classPadding = parseFloat(number);
    //             console.log(classPadding);

    //             // Calculate the new height (scrollHeight + total padding)
    //             const newHeight = height + (classPadding * 4);

    //             // Set the height to the calculated height
    //             textarea.style.height = `${newHeight}px`;
    //         }
    //     };
    
    //     // Adjust height on initial render and when attestationJSON changes
    //     adjustHeight();
    
    //     // Listen for window resize events and adjust textarea height
    //     const handleResize = () => {
    //         adjustHeight();
    //     };
    
    //     window.addEventListener('resize', handleResize);
    
    //     // Cleanup the event listener on component unmount
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []); // Depend on attestationJSON and handle resize events
    // useEffect(() => {
    //     console.log("CHIAMATO3");
    //     const textarea = textareaRef3.current;

    //     const adjustHeight = () => {
    //         if (textarea) {
    //             textarea.style.height = 'auto'; // Reset height to auto
    //             const height = textarea.scrollHeight;
                
    //             // Get padding from the className
    //             const classNames = textarea.className.split(" ");
    //             const paddingClasses = classNames.filter(cls => cls.startsWith('py-'));
    //             const number = paddingClasses[0].split("-")[1]
    //             const classPadding = parseFloat(number);
    //             console.log(classPadding);

    //             // Calculate the new height (scrollHeight + total padding)
    //             const newHeight = height + (classPadding * 4);

    //             // Set the height to the calculated height
    //             textarea.style.height = `${newHeight}px`;
    //         }
    //     };
    
    //     // Adjust height on initial render and when attestationJSON changes
    //     adjustHeight();
    
    //     // Listen for window resize events and adjust textarea height
    //     const handleResize = () => {
    //         adjustHeight();
    //     };
    
    //     window.addEventListener('resize', handleResize);
    
    //     // Cleanup the event listener on component unmount
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []); // Depend on attestationJSON and handle resize events
    

    // return (
    //     <>
    //         {/* {attestation && */}
    //             <div className="grid w-full">
    //                 <Label htmlFor="message">OffChain Data:</Label>
    //                 <Textarea id="message" ref={textareaRef1} value={anchor} className="resize-none h-auto" readOnly />
    //                 <Textarea id="message" ref={textareaRef2} value={metadataURI} className="resize-none h-auto" readOnly />
    //                 <Textarea id="message" ref={textareaRef3} value={imageURI} className="resize-none h-auto" readOnly />
    //             </div>
    //         {/* } */}
    //     </>
    // )
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