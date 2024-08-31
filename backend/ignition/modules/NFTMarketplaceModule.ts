import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ONE_GWEI: bigint = 1_000_000_000n;

const NFTMarketplaceModule = buildModule("NFTMarketplaceModule", (m) => {
    const amount = m.getParameter("amount", ONE_GWEI);

    const nftmarketplace = m.contract("NFTMarketplace", [/* costruttore */]);
    // , {
    //     value: amount, /* third argument is passed ETH */
    // }

    //m.call(token, "transfer", [receiver, amount]);
    // The first argument is the Future object for the contract you want to call, the second one the function name, and the third one is an array of arguments. Once again, the array of arguments can contain other Future objects and Hardhat Ignition will figure out how to resolve them during execution.

    return { nftmarketplace };
});

export default NFTMarketplaceModule;