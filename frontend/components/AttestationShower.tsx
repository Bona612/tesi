"use client";

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Anchor, Attestation } from "@/types";
import { Button } from "./ui/button";
import { useEffect, useRef } from "react";
import { useMediaQueries } from "@/hooks/useMediaQuery";


interface AttestationProps {
    attestation: Anchor;
}

function attestationToJSON(attestation: Anchor): string {
    if (!attestation) {
        return "";
    }

    // const attestationJSON = JSON.stringify(attestation, null, "\t");
    const attestationJSON = JSON.stringify(attestation);
    const attestationJSON_woutQuote = attestationJSON.replace(/\"/g, '');
    const attestationValues = attestationJSON_woutQuote.replace(/[\{\}]/g, '').replace(/,/g, '\n').replace(/:/g, ': ');

    console.log(attestationValues);
    return attestationValues;
}

export function AttestationShower({attestation}: AttestationProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const attestationJSON = attestationToJSON(attestation);
    
    useEffect(() => {
        console.log("CHIAMATO");
        const textarea = textareaRef.current;

        const adjustHeight = () => {
            if (textarea) {
                textarea.style.height = 'auto'; // Reset height to auto
                const height = textarea.scrollHeight;
                
                // Get padding from the className
                const classNames = textarea.className.split(" ");
                const paddingClasses = classNames.filter(cls => cls.startsWith('py-'));
                const number = paddingClasses[0].split("-")[1]
                const classPadding = parseFloat(number);
                console.log(classPadding);

                // Calculate the new height (scrollHeight + total padding)
                const newHeight = height + (classPadding * 4);

                // Set the height to the calculated height
                textarea.style.height = `${newHeight}px`;
            }
        };
    
        // Adjust height on initial render and when attestationJSON changes
        adjustHeight();
    
        // Listen for window resize events and adjust textarea height
        const handleResize = () => {
            adjustHeight();
        };
    
        window.addEventListener('resize', handleResize);
    
        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [attestationJSON]); // Depend on attestationJSON and handle resize events
    

    return (
        <>
            {attestation &&
                <div className="grid w-full">
                    {/* <Label htmlFor="message">Attestation</Label> */}
                    <Textarea id="message" ref={textareaRef} value={attestationJSON} className="resize-none h-auto" readOnly />
                </div>
            }
        </>
    )
}