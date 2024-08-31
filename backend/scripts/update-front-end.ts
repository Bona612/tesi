

// VERIFICARE SE SERVE QUALCHE PASSAGGIO IN PIù NEL CODICE


const { ethers, network } = require("hardhat")
const fs = require("fs")
require("dotenv").config()

// Ogni volta che facciamo il deploy di un contratto, a prescindere dalla rete utilizzata, andiamo ad aggiornare la cartella constants del front-end con le informazioni riguardo i contratti che ci possono tornare utili nel front-end

const FRONT_END_MARKETPLACE_ADDRESSES =
    "../nextjs-authenticity-nft/constants/marketplaceAddresses.json" // path fino al file del front-end in ci memorizzeremo le informazioni sugli indirizzi dei contratti
const FRONT_END_MARKETPLACE_ABI =
    "../nextjs-authenticity-nft/constants/marketplaceAbi.json"
const FRONT_END_PRODUCTNFT_ABI =
    "../nextjs-authenticity-nft/constants/productAbi.json"
const FRONT_END_PRODUCTNFT_ADDRESSES =
    "../nextjs-authenticity-nft/constants/productAddresses.json"
const FRONT_END_NETWORK_MAPPING =
    "../nextjs-authenticity-nft/constants/networkMapping.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end..")
        await updateContractAddresses()
        await updateAbi()
    }
}

async function updateContractAddresses() {
    const marketplace = await ethers.getContract("NftMarketplace")
    const productNft = await ethers.getContract("ProductNft")
    const chainId = network.config.chainId.toString()
    console.log(marketplace.address)
    console.log(productNft.address)

    // Leggiamo dal json del front-end relativo al contratto marketplace le informazioni attualmente presenti. Il file .json avrà la seguente struttura: id della rete --> indirizzo del contratto su quella rete
    const marketplaceAddresses = JSON.parse(
        fs.readFileSync(FRONT_END_MARKETPLACE_ADDRESSES, "utf8")
    ) //marketplaceAddresses sarà un oggetto JSON

    const productAddresses = JSON.parse(
        fs.readFileSync(FRONT_END_PRODUCTNFT_ADDRESSES, "utf8")
    )

    let networkMapping = JSON.parse(
        fs.readFileSync(FRONT_END_NETWORK_MAPPING, "utf8")
    )

    if (chainId in marketplaceAddresses) {
        // Se la rete che stiamo utilizzando esiste nel file json allora vediamo se l'indirizzo del contratto è già presente. In caso negativo lo andiamo ad aggiungere tramite la funzione push
        if (!marketplaceAddresses[chainId].includes(marketplace.address)) {
            marketplaceAddresses[chainId].push(marketplace.address)
        }
    } else {
        // Se nel file json non è presente l'entry relativa alla rete che stiamo utilizzando allora la andiamo a creare da zero e le associamo un array con l'indirizzo del contratto
        marketplaceAddresses[chainId] = [marketplace.address]
    }

    // Ripetiamo la stessa cosa per il contratto ProductNft
    if (chainId in productAddresses) {
        // Se la rete che stiamo utilizzando esiste nel file json allora vediamo se l'indirizzo del contratto è già presente. In caso negativo lo andiamo ad aggiungere tramite la funzione push
        if (!productAddresses[chainId].includes(productNft.address)) {
            productAddresses[chainId].push(productNft.address)
        }
    } else {
        // Se nel file json non è presente l'entry relativa alla rete che stiamo utilizzando allora la andiamo a creare da zero e le associamo un array con l'indirizzo del contratto
        productAddresses[chainId] = [productNft.address]
    }

    if (chainId in networkMapping) {
        if (
            !networkMapping[chainId]["NftMarketplace"].includes(
                marketplace.address
            )
        ) {
            networkMapping[chainId]["NftMarketplace"].push(marketplace.address)
        }
    } else {
        networkMapping[chainId] = { NftMarketplace: [marketplace.address] } // Nuovo inserimento: nel caso in cui la chiave chainId non è presente la aggiungiamo e le associamo una nuova entry con nome del contratto e indirizzo
    }

    // Andiamo a scrivere le modifiche appena apportate visto che dobbiamo andare modificare lo stesso file successivamente
    fs.writeFileSync(FRONT_END_NETWORK_MAPPING, JSON.stringify(networkMapping))

    networkMapping = JSON.parse(
        fs.readFileSync(FRONT_END_NETWORK_MAPPING, "utf8")
    )
    if (chainId in networkMapping) {
        if (
            networkMapping[chainId]["ProductNft"] &&
            !networkMapping[chainId]["ProductNft"].includes(productNft.address)
        ) {
            networkMapping[chainId]["ProductNft"].push(productNft.address)
        } else {
            networkMapping[chainId].ProductNft = [productNft.address] // Nuovo inserimento nel caso in cui la chiave chainId non è presente
        }
    } else {
        networkMapping[chainId] = { ProductNft: [productNft.address] } // Nuovo inserimento nel caso in cui la chiave chainId non è presente
    }

    // Infine andiamo a scrivere le modifiche apportate sui file json
    fs.writeFileSync(
        FRONT_END_MARKETPLACE_ADDRESSES,
        JSON.stringify(marketplaceAddresses)
    )

    fs.writeFileSync(
        FRONT_END_PRODUCTNFT_ADDRESSES,
        JSON.stringify(productAddresses)
    )

    fs.writeFileSync(FRONT_END_NETWORK_MAPPING, JSON.stringify(networkMapping))
}

async function updateAbi() {
    const marketplace = await ethers.getContract("NftMarketplace")

    // Andiamo a scrivere sul file json del front-end destinato all'abi
    fs.writeFileSync(
        FRONT_END_MARKETPLACE_ABI,
        marketplace.interface.format(ethers.utils.FormatTypes.json) // --> Sintassi per ricavare l'abi a partire dall'oggetto contratto (visto da documentazione hardhat). L'abi viene poi trasformato nel formato json
    )

    const productNft = await ethers.getContract("ProductNft")
    fs.writeFileSync(
        FRONT_END_PRODUCTNFT_ABI,
        productNft.interface.format(ethers.utils.FormatTypes.json)
    )
}

module.exports.tags = ["all", "frontend"]