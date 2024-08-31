import { ethers, network } from "hardhat";
// import { developmentChains, networkConfig } from "../helper-hardhat.config";
// import { verify } from "../utils/verify";
import * as fs from "fs";
// import { storeImages, storeTokenUriMetadata } from "../utils/pinata";

import { config as dotenvConfig } from "dotenv";
// import { networks } from "../hardhat.config";    // è tipo un json

dotenvConfig();

const imagesLocation = "./images/"

let metadataTemplate = {
    name: "Diamond",
    description: "An authentic luxury product",
    creator: "",
    image: "",
    attributes: [
        {
            material: "diamond",
            colour: ["grey", "blue"],
            weight: "50g",
            pureness: 100,
        },
    ],
}

// Quando tokenURI è una stringa vuota allora bisogna abilitare l'upload su Pinata dalla variabile in .env
// Una volta fatto l'upload su Pinata dell'URI allora lo incolliamo qui e disabilitiamo l'upload per le volte successive
let tokenURI = ""

// let creator

module.exports = async function ({ getDeployer, deployments }) {
    const { deploy, log } = deployments
    const chainId = network.config.chainId // Ricaviamo l'id della rete attualmente in uso qunado viene lanciato lo script

    const { deployer } = await getNamedAccounts()

    // Get the IPFS hashes of our images
    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenURI = await handleTokenUris(deployer) // Funzione che farà l'upload su Pinata dei file (immagini e metadati) e ci restituirà gli URI
    }

    // Dobbiamo ricavare i parametri da passare al costruttore dello smart contract

    /* // Andiamo a leggere l'immagine SVG che intendiamo utilizzare per l'NFT
    const image = await fs.readFileSync("./images/something.svg", {
        encoding: "utf8",
    }) */

    //let arguments = [image]

    let arguments = [tokenURI]

    console.log("------------------------")
    const productNft = await deploy("ProductNft", {
        from: deployer,
        log: true,
        args: arguments,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (process.env.UPLOAD_TO_PINATA == "false") {
        console.log(`NFT token URI: ${tokenURI}`)
    }

    // Verifica del contratto su Etherscan (se stiamo deployando su una rete reale)
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifica del contratto ...")
        await verify(productNft.address, arguments)
    }
}

// Funzione per costruire il token URI
async function handleTokenUris(nftCreator) {
    let tokenUris = []
    const { responses: imageUploadResponses, files } = await storeImages(
        imagesLocation
    ) // Richiamiamo la funzione storeImages definita nello script uploadToPinata e passiamo il path al quale troviamo le immagini. La funzione ritorna una lista di hash dei file (responses) ottenuti dall'upload su Pinata e i file stessi

    // Facciamo un loop sulla lista dei responses: per ognuno andiamo a creare i metadati modificando il template definito sopra dopodiché si prosegue con l'upload dei metadati su Pinata
    for (imageUploadResponseIndex in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate } // Zucchero sintattico: metadataTemplate viene messa nella variabile tokenUriMetadata. Da quest'ultima, dunque, potremo fare accesso ai vari campi.

        // Andiamo a popolare il campo creator all'interno dei metadati
        tokenUriMetadata.creator = `${nftCreator}`

        // Creazione dell'URL per l'immagine
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}` // Il campo image dei metadati viene popolato con: estensione ipfs + hash ottenuto dall'upload dell'immagine su Pinata. IpfsHash è il risultato della pinFileToIPFS nel quale è contenuto l'hash in questione
        console.log(`Uploading ${tokenUriMetadata.name}...`)

        // store the JSON to Pinata/IPFS --> così come fatto per l'upload delle immagini andiamo a richiamare una funzione creata ad hoc nello script uploadToPinata
        const metadataUploadResponse = await storeTokenUriMetadata(
            tokenUriMetadata
        )

        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`) // Aggiungiamo nel vettore tokenUris con l'hash IPFS che punta ai metadati del token in questione. I metadati a loro volta puntano all'immagine del token.
    }

    console.log("Token URI Uploaded! It is:")
    console.log(tokenUris[0])
    return tokenUris[0]
}

module.exports.tags = ["all", "productnft", "main"]