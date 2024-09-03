import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Attestation } from "@/types";


interface AttestationProps {
    attestation: Attestation;
}

function attestationToJSON(attestation: Attestation): string {
    const attestationJSON = JSON.stringify(attestation);
    return attestationJSON;
}

export function AttestationShower({attestation}: AttestationProps) {
    const attestationJSON = attestationToJSON(attestation);
    
    return (
        <>
            {attestation &&
                <div>
                    <Label htmlFor="message">Attestation:</Label>
                    <Textarea value={attestationJSON} className="resize-none" readOnly />
                </div>
            }
        </>
    )
}