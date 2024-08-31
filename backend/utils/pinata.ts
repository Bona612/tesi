

//  DA RIVEDERE, PER FAR UPLOAD SU PINATA IPFS, UTILE PROBABILMENTE PIù NEL FRONT-END

const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs") // Import per leggere i file
require("dotenv").config() // Import del file .env

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret) // Quando istanziamo l'SDK di Pinata dobbiamo passare la chiave API e l'API secret che abbiamo creato sul sito

// Creiamo una funzione alla quale passiamo il path delle immagini del nostro random NFT. E' necessario installare il package "path" da linea di comando.
async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath) // Otteniamo il full path
    const files = fs.readdirSync(fullImagesPath) // Funzione che legge l'intera directory che si trova al path che passiamo e ci restituisce i file contenuti
    let responses = [] // Array nel quale andremo a memorizzare le risposte dal server di Pinata

    console.log("Uploading NFT image to Pinata...")

    // Per ogni elemento della variabile files (cioè per ogni immagine) andiamo a creare uno stream di lettura tramite cui vengono prelevati tutti i dati e i bytes dell'immagine.
    // Dopodiché passiamo lo stream del file ad un'opportuna funzione di Pinata
    for (fileIndex in files) {
        console.log(`Working on ${fileIndex}...`)
        const readableStreamForFile = fs.createReadStream(
            `${fullImagesPath}/${files[fileIndex]}`
        )
        // Creiamo una variabile con le opzioni da passare successivamente alla chiamata a Pinata. A quanto pare se non specifichiamo queste opzioni con il nome del file dà errore
        const options = {
            pinataMetadata: {
                name: files[fileIndex],
            },
        }
        try {
            // Per effettuare la chiamata API a Pinata è necessario creare una API key sul loro sito; dopodiché sarà possibile utilizzare l'SDK e richiamare le funzioni di Pinata
            const response = await pinata.pinFileToIPFS(
                readableStreamForFile,
                options
            ) // Andiamo a fare il pin del file su IPFS passando lo stream di lettura e le opzioni
            responses.push(response) // Aggiungiamo la risposta all'array responses
        } catch (error) {
            console.log(error)
        }
    }
    return { responses, files } // Ritorniamo le risposte dell'upload dei file su IPFS tramite Pinata e i file stessi.
    // La funzione pinFileToIPFS ritorna l'hash del file
}

// Funzione per fare l'upload dei metadati del token su Pinata/IPFS.
async function storeTokenUriMetadata(metadata) {
    try {
        // Simile a quanto fatto prima, cambia solo la funzione di Pinata che andiamo a richiamare
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}

module.exports = { storeImages, storeTokenUriMetadata } // Esportiamo le funzioni per fare l'upload delle immagini e dei metadati del token