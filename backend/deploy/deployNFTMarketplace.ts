const { network } = require("hardhat") // Importiamo la variabile network dalla quale possiamo estrarre alcune informazioni sulla rete che stiamo utilizzando
const { developmentChains } = require("../helper-hardhat.config.js")
const { verify } = require("../utils/verify.js")
const { networks } = require("../hardhat.config.js")

/* // Se siamo su una testenet (e.g. Sepolia) il deployer sarà l'account che abbiamo indicato tra i parametri di rete in hardhat.config.js
// Altrimenti il deployer sarà l'account con nome deployer prelevato da i NamedAccounts
if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
) {
    const deployer = networks.sepolia.accounts[0]
} else {
    const { deployer } = await getNamedAccounts()
} */

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("------------------------")
    let args = [120] // Argomenti per il costruttore: dobbiamo definire il tempo di recesso di un prodotto. Per fare un test los ettiamo a 2 minuti ( 120 secondi)
    const nftMarketplace = await deploy("NftMarketplace", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verifica del contratto (se non siamo su una rete di sviluppo locale)
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifica del contratto ...")
        await verify(nftMarketplace.address, args)
    }

    log("-------------------------")
}

module.exports.tags = ["all", "marketplace", "main"]