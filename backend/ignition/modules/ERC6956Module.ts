import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import dotenv from 'dotenv';
dotenv.config();

const NAME: string = "Asset-Bound NFT test";
const SYMBOL: string = "ABNFT";

const BASE_URI: string = process.env.NEXT_PUBLIC_GATEWAY_URL__BASE_URI || "";

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

    const name = m.getParameter("name", NAME);
    const symbol = m.getParameter("symbol", SYMBOL);
    const baseURI = m.getParameter("baseURI", BASE_URI);

    /*
        Deploy `Token` by calling `contract()` with the constructor arguments
        as the second argument. The account to use for the deployment transaction
        is set through `from` in the third argument, which is an options object.
    */
    const erc6956 = m.contract("ERC6956", [name, symbol], { from: deployer });

    /*
        The call to `m.contract()` returns a future that can be used in other `m.contract()`
        calls (e.g. as a constructor argument, where the future will resolve to the
        deployed address), but it can also be returned from the module. Contract
        futures that are returned from the module can be leveraged in Hardhat tests
        and scripts, as will be shown later.
    */

    m.call(erc6956, "updateMaintainer", [deployer, true]);

    m.call(erc6956, "updateOracle", [deployer, true]);

    m.call(erc6956, "updateBaseURI", [baseURI]);

    return { erc6956 };
});

export default ERC6956Module;