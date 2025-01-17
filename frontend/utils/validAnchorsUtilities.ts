import fs from 'fs';
import path from 'path';


const filePath = path.resolve(process.env.DATA_FILE_PATH!);



export function getValidAnchorsUtility(): string[] {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

export function getValidAnchorsForMerkleTreeUtility(): string[][] {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf-8');
    const anchors: string[] = JSON.parse(data);
    const anchorsForMerkleTree = anchors.map(anchor => [anchor]);
    // Convert each string to an array containing that string
    return anchorsForMerkleTree;
}