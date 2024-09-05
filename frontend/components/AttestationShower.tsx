"use client";

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Attestation } from "@/types";
import { Button } from "./ui/button";
import { useEffect, useRef } from "react";


interface AttestationProps {
    attestation: Attestation;
}

function attestationToJSON(attestation: Attestation): string {
    if (!attestation) {
        return "";
    }

    // const attestationJSON = JSON.stringify(attestation, null, "\t");
    const attestationJSON = JSON.stringify(attestation);
    const attestationJSON_woutQuote = attestationJSON.replace(/\"/g, '');
    const attestationValues = attestationJSON_woutQuote.replace(/[\{\}]/g, '').replace(/,/g, '\n');

    console.log(attestationValues);
    return attestationValues;
}

export function AttestationShower({attestation}: AttestationProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const attestationJSON = attestationToJSON(attestation);
    
    useEffect(() => {
        const textarea = textareaRef.current;

        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to auto
            // con 10 funziona
            const height = textarea.scrollHeight + 1
            textarea.style.height = `${height}px`; // Set height to scrollHeight
        }
    }, [attestationJSON]); // Depend on attestationJSON to update height on content change


    return (
        <>
            {attestation &&
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="message">Attestation:</Label>
                    <Textarea id="message" ref={textareaRef} value={attestationJSON} className="resize-none h-auto" readOnly />
                    {/* <Button>Send message</Button> */}
                </div>
            }
        </>
    )
}