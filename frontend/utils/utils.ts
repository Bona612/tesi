import { Attestation, OrderBy, orderByOptions, OrderDirectionEnum } from '@/types';
import { ethers } from 'ethers';


// export function ethToWei(eth: string): bigint {
//     const wei = ethers.parseEther(eth);
//     return wei;
// }

// export function weiToEth(wei: bigint): string {
//     const eth = ethers.formatEther(wei);
//     return eth;
// }

export function ethToWei(eth: number): bigint {
    const wei = ethers.parseEther(eth.toString());
    return wei;
}

export function weiToEth(wei: bigint): number {
    const eth = parseFloat(ethers.formatEther(wei));
    return eth;
}

export const orderDirectionMap: { [key: string]: OrderDirectionEnum } = {
    'desc': OrderDirectionEnum.desc,
    'asc': OrderDirectionEnum.asc
};

export const findOrderBy = (name: string): OrderBy => {
    return orderByOptions.find(option => option.name === name) || orderByOptions[0];
};

export function jsonToAttestation(attestationJSON: string): Attestation {
    const attestation: Attestation = JSON.parse(attestationJSON) as Attestation;
    return attestation;
}