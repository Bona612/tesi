import { Attestation } from "@/types";
import { ethers } from "ethers";

export const signAttestationAPI = async (data: {attestation: Attestation}) => { 
    console.log(data);
    try {
        const response = await fetch('/api/signAttestation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        const result = await response.json();
        console.log('Response from API:', result);

        return result;
    }
    catch (error) {
        console.error('Error sending data:', error);
        return error;
    }
};

export const merkleTreeAPI = async (data: {anchor: string}) => { 
    console.log(data);
    try {
        const apiUrl = '/api/merkleTree?anchor=' + data.anchor;
        const response = await fetch(apiUrl, {
          method: 'GET',
        });
    
        const result = await response.json();
        console.log('Response from API:', result);

        return result;
    }
    catch (error) {
        console.error('Error sending data:', error);
        return error;
    }
};