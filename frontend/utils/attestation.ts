import { Attestation } from "@/types";


export const signAttestationAPI = async (data: {attestation: Attestation}) => { 
    try {
        const response = await fetch('/api/signAttestation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        const result = await response.json();

        return result;
    }
    catch (error) {
        console.error('Error sending data:', error);
        return error;
    }
};

export const merkleTreeAPI = async (data: {anchor: string}) => { 
    try {
        const apiUrl = '/api/merkleTree?anchor=' + data.anchor;
        const response = await fetch(apiUrl, {
          method: 'GET',
        });
    
        const result = await response.json();

        return result;
    }
    catch (error) {
        console.error('Error sending data:', error);
        return error;
    }
};