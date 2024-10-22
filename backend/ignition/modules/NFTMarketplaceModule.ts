import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const NFTMarketplaceModule = buildModule("NFTMarketplaceModule", (m) => {
    const deployer = m.getAccount(0);


    const nftmarketplace = m.contract("NFTMarketplace", [/* costruttore */], { from: deployer });
    return { nftmarketplace };
});

export default NFTMarketplaceModule;