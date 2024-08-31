import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { AttestedTransferLimitUpdatePolicy } from "../../test/commons"; // NULLADDR
import { ethers } from "ethers";
import { createMerkleTree, getMerkleTreeRoot } from "../../utils/merkleTreeUtilities";
import dotenv from 'dotenv';
dotenv.config();

const NAME: string = "Asset-Bound NFT test";
const SYMBOL: string = "ABNFT";
const POLICY: AttestedTransferLimitUpdatePolicy = AttestedTransferLimitUpdatePolicy.FLEXIBLE;
const ONE_GWEI: bigint = 1_000_000_000n;
const deployerAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

const BASE_URI: string = process.env.NEXT_PUBLIC_GATEWAY_URL__BASE_URI || "https://";

/*
    The callback passed to `buildModule()` provides a module builder object `m`
    as a parameter. Through this builder object, you access the Module API.
    For instance, you can deploy contracts via `m.contract()`.
*/
const ERC6956Module = buildModule("ERC6956Module", (m) => {
    /*
    Instead of named accounts, you get access to the configured accounts
    through the `getAccount()` method.
    */
    const deployer = m.getAccount(0);
    const tokenOwner = m.getAccount(1);

    const name = m.getParameter("name", NAME);
    const symbol = m.getParameter("symbol", SYMBOL);
    const baseURI = m.getParameter("baseURI", BASE_URI)
    // const policy = m.getParameter("policy", POLICY);
    // const amount = m.getParameter("amount", ONE_GWEI);
    // const signer = ethers.provider.getSigner(deployerAddress);

    /*
        Deploy `Token` by calling `contract()` with the constructor arguments
        as the second argument. The account to use for the deployment transaction
        is set through `from` in the third argument, which is an options object.
    */
    const erc6956 = m.contract("ERC6956", [name, symbol])//, {
    //     from: deployer,
    // });

    /*
        The call to `m.contract()` returns a future that can be used in other `m.contract()`
        calls (e.g. as a constructor argument, where the future will resolve to the
        deployed address), but it can also be returned from the module. Contract
        futures that are returned from the module can be leveraged in Hardhat tests
        and scripts, as will be shown later.
    */

    // QUESTA PARTE VA VERIFICATA, SICURAMENTE mantainer and oracle è MEGLIO SE VENGONO SETTATI QUI
    // MENTRE PER updateValidAnchors LA COSA è DA VERIFICARE
    const mantainerAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    m.call(erc6956, "updateMaintainer", [mantainerAddress, true]);

    const oracleAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    m.call(erc6956, "updateOracle", [oracleAddress, true]);

    console.log("baseURI: ", baseURI);
    m.call(erc6956, "updateBaseURI", [baseURI]);

    // const dummyAnchor = "0x5f91a71cff8405364143a67fe7ff7183803bcb9e9a1c0c7ed2605970b319b028";
    // const anchor = "";
    // const merkleTree = createMerkleTree([[dummyAnchor], [anchor]]);
    // const merkleRoot = getMerkleTreeRoot(merkleTree);
    // m.call(erc6956, "updateValidAnchors", [merkleRoot]);
    

    return { erc6956 };
});

export default ERC6956Module;


// import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
// import { ERC6956Full } from "../../typechain"; // Adjust the path based on your project structure

// export default defineModule((builder: ModuleBuilder) => {
//   const deployer = builder.getSigner("deployer");

//   const limitUpdatePolicy = "0x..."; // Example policy value, this should be passed as a parameter if dynamic

//   const abnftContract = builder.contract("ERC6956Full", {
//     from: deployer,
//     args: ["Asset-Bound NFT test", "ABNFT", limitUpdatePolicy],
//   });

//   builder.execute(deployer, abnftContract, "updateMaintainer", {
//     args: [deployer.address, true],
//   });

//   builder.execute(deployer, abnftContract, "updateGlobalAttestationLimit", {
//     args: [100], // Example limit value, should be parameterized if dynamic
//   });

//   // Add other setup steps as necessary

//   return { abnftContract };
// });
