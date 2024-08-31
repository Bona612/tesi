import { assert, expect } from "chai";
// import { network, deployments, ethers, getNamedAccounts } from "hardhat";
// import { developmentChains } from "../../hardhat.config";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { Contract } from "ethers";
import { ethers, ignition } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { ethers } from "ethers";
import { createHash } from 'node:crypto';
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { ERC6956Authorization, ERC6956Role, merkleTestAnchors, NULLADDR, createAttestation, AttestedTransferLimitUpdatePolicy, createAttestationWithData } from "./commons";
import { IERC6956AttestationLimitedInterfaceId, IERC6956InterfaceId, IERC6956FloatableInterfaceId, IERC6956ValidAnchorsInterfaceId } from "./commons";
import { ERC6956Full, NFTMarketplace } from '../typechain';
import { ContractFactory } from 'ethers';
import ERC6956FullModule from "../ignition/modules/ERC6956FullModule";
import NFTMarketplaceModule from "../ignition/modules/NFTMarketplaceModule";



// DA RIVEDERE QUASI TUTTO
// IL SENSO è CHE ProductNFT SAREBBE IL TOKEN DA CREARE, MA SAREBBE ERC6956
// QUINDI IN TEORIA DOVREBBE ESSERE SUFFICIENTE CREARE LA SCHERMATA DI CREAZIONE DEL NFT PASSANDO ATTESTATION
// PER IL LISTING TUTTO NORMALE (VEDERE SE IMPLEMENTARE IL LOCK IN QUEL PERIODO)
// PER IL BUY, SEMPLICEMENTE VERRà FATTO UN PASSAGGIO DI ANCORA TRAMITE ATTESTAZIONE
// PROBABILMENTE QUESTO ULTIMO PASSAGGIO SARà DA FARE CON UN REDEEM DEL TOKEN CHE ATTESTA IL TRASFERIMENTO TRAMITE NUOVA ATTESTAIONE
// OPPURE CON FLOATING

// QUINDI IL TESTING ANDRà FATTO SU QUESTE POSSIBILITà
// OVVERO CREAZIONE DI UN NFT NEL MARKETPLACE
// LISTING
// BUYING




// !developmentChains.includes(hre.network.name)
//     ? describe.skip // Se non siamo su una rete di sviluppo locale ignoriamo questi test
//     :
describe("Nft Marketplace Tests", function () {
    const PRICE = ethers.parseEther("0.001");
    const TOKEN_ID = 1;

    // Fixture to deploy the abnftContract contract and assign roles.
    // Besides owner there's user, minter and burner with appropriate roles.
    // async function deployAbNftFixture() {
    //     // Contracts are deployed using the first signer/account by default
    //     const [owner, maintainer, oracle, alice, bob, mallory, hacker, carl, gasProvider ] = await hre.ethers.getSigners();

    //     console.log("owner");
    //     console.log(owner);
    //     console.log("alice");
    //     console.log(alice);
    //     console.log("bob");
    //     console.log(bob);
    //     console.log('oracle')
    //     console.log(await oracle.getAddress())

    //     const AbNftContract: ContractFactory = await hre.ethers.getContractFactory("ERC6956");
    //     const MarketContract: ContractFactory = await hre.ethers.getContractFactory("NFTMarketplace");
    //     // const burnAuthorization = ERC6956Authorization.ALL;
    //     // const approveAuthorization = ERC6956Authorization.ALL;

    //     const abnftContract = (await AbNftContract.connect(owner).deploy("Asset-Bound NFT test", "ABNFT")) as ERC6956Full;
    //     const marketContract = (await MarketContract.connect(owner).deploy()) as NFTMarketplace;
        
    //     await abnftContract.connect(owner).updateMaintainer(maintainer.address, true);

    //     await expect(abnftContract.connect(maintainer).updateOracle(oracle.address, true))
    //     .to.emit(abnftContract, "OracleUpdate")
    //     .withArgs(oracle.address, true);


    //     return { abnftContract, marketContract, owner, maintainer, oracle, alice, bob, mallory, hacker, carl, gasProvider };
    // }
    async function deployAbNftFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, maintainer, oracle, alice, bob, mallory, hacker, carl, gasProvider ] = await ethers.getSigners();
    
        
        const { erc6956full: abnftContract } = await ignition.deploy(ERC6956FullModule);
        const { nftmarketplace: marketContract } = await ignition.deploy(NFTMarketplaceModule);
    
        const abnftContract_owner = abnftContract.connect(owner) as ERC6956Full;
        const abnftContract_mantainer = abnftContract.connect(maintainer) as ERC6956Full;
        
        // const AbNftContract: ContractFactory = await hre.ethers.getContractFactory("ERC6956");
        // const burnAuthorization = ERC6956Authorization.ALL;
        // const approveAuthorization = ERC6956Authorization.ALL;
    
        // const abnftContract = (await AbNftContract.connect(owner).deploy("Asset-Bound NFT test", "ABNFT")) as ERC6956;
        abnftContract_owner.updateMaintainer(maintainer.address, true);
    
        await expect(abnftContract_mantainer.updateOracle(oracle.address, true))
          .to.emit(abnftContract, "OracleUpdate")
          .withArgs(oracle.address, true);
    
        // Create Merkle Tree
        const merkleTree = StandardMerkleTree.of(merkleTestAnchors, ["bytes32"]);
    
        return { abnftContract, marketContract, merkleTree, owner, maintainer, oracle, alice, bob, mallory, hacker, carl, gasProvider };
    }

    // async function deployABTandMintTokenToAlice() {
    //     // Contracts are deployed using the first signer/account by default
    //     const {abnftContract, marketContract, merkleTree, owner, maintainer, oracle, alice, bob, mallory, hacker, carl, gasProvider} = await deployAbNftFixture();

    //     const anchor = merkleTestAnchors[0][0];
    //     const mintAttestationAlice = await createAttestation(alice.address, anchor, oracle); // Mint to alice
        
    //     const abnftContract_alice = abnftContract.connect(alice) as ERC6956Full;
    //     const abnftContract_gasProvider = abnftContract.connect(gasProvider) as ERC6956Full;

    //     await expect(abnftContract_gasProvider["transferAnchor(bytes)"](mintAttestationAlice))
    //     .to.emit(abnftContract, "Transfer") // Standard ERC721 event
    //     .withArgs(NULLADDR, alice.address, 1);

    //     console.log(await marketContract.getAddress());
    //     // Il proprietario dell'NFT deve approvare il marketplace a trasferire l'NFT per suo conto in caso di vendita
    //     await abnftContract_alice.approve(marketContract.getAddress(), TOKEN_ID);

    //     return { abnftContract, marketContract, owner, maintainer, oracle, mintAttestationAlice, anchor, alice, bob, mallory, hacker, carl, gasProvider };
    // }

    async function deployAbNftAndMintTokenToAliceFixture() {
        // Contracts are deployed using the first signer/account by default
        const {abnftContract, marketContract, merkleTree, owner, maintainer, oracle, alice, bob, mallory, hacker, carl, gasProvider} = await deployAbNftFixture();
      
        const anchor = merkleTestAnchors[0][0];
        const [mintAttestationAlice, dataAlice] = await createAttestationWithData(alice.address, anchor, oracle, merkleTree); // Mint to alice
    
        const abnftContract_maintainer = abnftContract.connect(maintainer) as ERC6956Full;
        const abnftContract_gasProvider = abnftContract.connect(gasProvider) as ERC6956Full;
    
        await abnftContract_maintainer.updateValidAnchors(merkleTree.root);
    
        const expectedTokenId = 1;
        await expect(abnftContract_gasProvider["createAnchor(bytes,string,bytes)"](mintAttestationAlice, "", dataAlice))
        .to.emit(abnftContract, "Transfer") // Standard ERC721 event
        .withArgs(NULLADDR, alice.address, expectedTokenId)
    
        return { abnftContract, marketContract, merkleTree, owner, maintainer, oracle, mintAttestationAlice, anchor, alice, bob, mallory, hacker, carl, gasProvider };
    }


    // beforeEach(async function () {
    //     const accounts = await hre.ethers.getSigners();
    //     deployer = accounts[0];
    //     user = accounts[1];
    //     // const [owner, maintainer, oracle, alice, bob, mallory, hacker, carl, gasProvider ] = await hre.ethers.getSigners();

    //     enum AttestationLimitPolicy {
    //         IMMUTABLE,
    //         INCREASE_ONLY,
    //         DECREASE_ONLY,
    //         FLEXIBLE
    //     }


    //     /* deploy the marketplace */
    //     const Market = await hre.ethers.getContractFactory("NFTMarketplace");
    //     const market = await Market.deploy(0);
    //     await market.waitForDeployment();
    //     const marketAddress = await market.getAddress();

    //     const [owner, maintainer, oracle, alice, bob, mallory, hacker, carl, gasProvider ] = await hre.ethers.getSigners();

    //     // /* deploy the NFT contract */
    //     // const NFT = await hre.ethers.getContractFactory("ProductNFT");
    //     // const nft = await NFT.deploy("ProductNFT test", "NFT", AttestedTransferLimitUpdatePolicy.FLEXIBLE, marketAddress);
    //     // await nft.waitForDeployment();
    //     // const nftContractAddress = await nft.getAddress();

    //     const listingPrice = await market.getListingPrice();
    //     const auctionPrice = hre.ethers.parseUnits('1', 'ether');

    //     // const ProductNft = await hre.ethers.getContractFactory("ProductNFT");
    //     // const productNft = await ProductNft.connect(owner).deploy("Asset-Bound NFT test", "ABNFT", AttestationLimitPolicy.FLEXIBLE, "0");

    //     // console.log(deployer);
    //     // console.log(user);

    //     //   await hre.deployments.fixture(["main"]); //Eseguiamo tutti gli script nella cartella deploy che hanno il tag "main"
    //     // nftMarketplace = await hre.ethers.getContractAt("NFTMarketplace", deployer); // La getContract preleva lo smart contract specificato utilizzando di default l'account 0 (che corrisponde a quello che abbiamo chiamato deployer)
    //     // productNft = await hre.ethers.getContractAt("ProductNFT", deployer);

    //     // console.log("start minting");
    //     // // await productNft.mintNft();
    //     // await expect(nft.mintNft()).to.be.revertedWith("ProductNft__NotOwner");
    //     // // .to.emit(productNft, "MintedNFT")
    //     // console.log("mint gone");
    // });




    it("SHOULD allow mint and transfer with valid attestations, and listing and buying", async function() {
        const { abnftContract, marketContract, merkleTree, owner, oracle, mintAttestationAlice, anchor, alice, bob, hacker, gasProvider } = await loadFixture(deployAbNftAndMintTokenToAliceFixture);      
  
        const [attestationBob, dataBob] = await createAttestationWithData(bob.address, anchor, oracle, merkleTree); // Mint to alice
        
        const abnftContract_gasProvider = abnftContract.connect(gasProvider) as ERC6956Full;
        const abnftContract_bob = abnftContract.connect(bob) as ERC6956Full;
        const abnftContract_hacker = abnftContract.connect(hacker) as ERC6956Full;

        const marketContract_bob = marketContract.connect(bob) as NFTMarketplace;
        const marketContract_alice = marketContract.connect(alice) as NFTMarketplace;
        const marketContract_hacker = marketContract.connect(hacker) as NFTMarketplace;
        const marketContract_gasProvider = marketContract.connect(gasProvider) as NFTMarketplace;


        await expect(marketContract_gasProvider["redeemItem(address,uint256,bytes,bytes)"](
            abnftContract.getAddress(),
            TOKEN_ID,
            attestationBob,
            dataBob
        )).to.revertedWithCustomError(marketContract, "NotToRedeem");

        await expect(abnftContract_gasProvider["transferAnchor(bytes,bytes)"](attestationBob, dataBob))
        .to.emit(abnftContract, "Transfer") // Standard ERC721 event
        .withArgs(alice.address, bob.address, 1)
        .to.emit(abnftContract, "AnchorTransfer")
        .withArgs(alice.address, bob.address, anchor, 1);

        // Il proprietario dell'NFT deve approvare il marketplace a trasferire l'NFT per suo conto in caso di vendita
        await abnftContract_bob.approve(marketContract.getAddress(), TOKEN_ID);

        // Token is now at bob... so alice may hire a hacker quickly and reuse her attestation to get 
        // the token back from Bob ... which shall of course not work
        await expect(abnftContract_hacker["transferAnchor(bytes)"](mintAttestationAlice))
        .to.revertedWith("ERC6956-E9") // Standard ERC721 event


        const address = await abnftContract.getAddress();
        const market_address = await marketContract.getAddress();

        console.log("ERC6956 address");
        console.log(address);
        console.log("marketplace address");
        console.log(market_address);

        await expect(marketContract_bob.listItem(
            address,
            TOKEN_ID,
            PRICE
        )).to.emit(marketContract, "ItemListed"); // Il proprietario (siamo ancora connessi con il deployer) mette in vendita il prodotto

        await expect(marketContract_bob.listItem(
            address,
            TOKEN_ID,
            PRICE
        )).to.revertedWithCustomError(marketContract, "AlreadyListed");

        await expect(marketContract_bob.buyItem(
            abnftContract.getAddress(),
            TOKEN_ID,
            {
                value: PRICE,  // This field sends the specified Ether amount
            }
        )).to.revertedWithCustomError(marketContract, "AlreadyOwner")

        // Ci connettiamo con l'account user per acquistare il prodotto
        await expect(marketContract_alice.buyItem(
            abnftContract.getAddress(),
            TOKEN_ID
        )).to.revertedWithCustomError(marketContract, "PriceNotMet")
        .withArgs(abnftContract.getAddress(), TOKEN_ID, PRICE);

        await expect(marketContract_alice.buyItem(
            abnftContract.getAddress(),
            TOKEN_ID,
            {
                value: PRICE,  // This field sends the specified Ether amount
            }
        )).to.emit(marketContract, "ItemBought")
        .withArgs(abnftContract.getAddress(), TOKEN_ID, alice.address, PRICE);

        const [new_attestationAlice, new_dataAlice] = await createAttestationWithData(alice.address, anchor, oracle, merkleTree, 1); // Mint to alice
        
        // await expect(abnftContract_gasProvider["transferAnchor(bytes,bytes)"](new_attestationAlice, new_dataAlice))
        // .to.emit(abnftContract, "Transfer") // Standard ERC721 event
        // .withArgs(bob.address, alice.address, 1)
        // .to.emit(abnftContract, "AnchorTransfer")
        // .withArgs(bob.address, alice.address, anchor, 1);
        await expect(marketContract_hacker["redeemItem(address,uint256,bytes,bytes)"](
            abnftContract.getAddress(),
            TOKEN_ID,
            new_attestationAlice,
            new_dataAlice
        )).to.revertedWithCustomError;
        
        await expect(marketContract_alice["redeemItem(address,uint256,bytes,bytes)"](
            abnftContract.getAddress(),
            TOKEN_ID,
            new_attestationAlice,
            new_dataAlice
        )).to.emit(abnftContract, "Transfer") // Standard ERC721 event
        .withArgs(bob.address, alice.address, 1)
        .and.to.emit(abnftContract, "AnchorTransfer")
        .withArgs(bob.address, alice.address, anchor, 1)
        .and.to.emit(marketContract, "ItemRedeemed")
        .withArgs(abnftContract.getAddress(), TOKEN_ID, alice.address);

        // Controlliamo che sia cambiato il proprietario dell'NFT
        const newOwner = await abnftContract.ownerOf(TOKEN_ID); // Gli NFT costruiti sullo standard ERC721 hanno sempre la funzione ownerOf

        // // Controlliamo che il venditore (deployer) sia stato pagato
        // const deployerProceeds = await nftMarketplace.getProceeds(deployer.address);

        console.log(newOwner.toString());
        console.log(alice.address);
        // Assert
        assert(newOwner.toString() == alice.address);
        // assert(deployerProceeds.toString() == PRICE.toString());
      }) 

    // it("list NFT to buy it", async function () {
    //     const address = await productNft.getAddress();
    //     await nftMarketplace.listItem(
    //         address,
    //         TOKEN_ID,
    //     ); // Il proprietario (siamo ancora connessi con il deployer) mette in vendita il prodotto

    //     const userConnectedNftMarketplace = nftMarketplace.connect(user); // Ci connettiamo con l'account user per acquistare il prodotto

    //     await userConnectedNftMarketplace.buyItem(
    //         productNft.getAddress(),
    //         TOKEN_ID,
    //     );

    //     console.log(TOKEN_ID);
    //     // Controlliamo che sia cambiato il proprietario dell'NFT
    //     const newOwner = await productNft.ownerOf(TOKEN_ID); // Gli NFT costruiti sullo standard ERC721 hanno sempre la funzione ownerOf

    //     // // Controlliamo che il venditore (deployer) sia stato pagato
    //     // const deployerProceeds = await nftMarketplace.getProceeds(deployer.address);

    //     // Assert
    //     assert(newOwner.toString() == user.address);
    //     // assert(deployerProceeds.toString() == PRICE.toString());
    // });

    it("exclusively items that haven't been listed yet", async function () {
        const { abnftContract, marketContract, merkleTree, owner, oracle, mintAttestationAlice, anchor, alice, bob, hacker, gasProvider } = await loadFixture(deployAbNftAndMintTokenToAliceFixture);      
  
        const [attestationBob, dataBob] = await createAttestationWithData(bob.address, anchor, oracle, merkleTree); // Mint to alice
        
        const abnftContract_gasProvider = abnftContract.connect(gasProvider) as ERC6956Full;
        const abnftContract_bob = abnftContract.connect(bob) as ERC6956Full;
        const abnftContract_hacker = abnftContract.connect(hacker) as ERC6956Full;

        const marketContract_bob = marketContract.connect(bob) as NFTMarketplace;
        const marketContract_alice = marketContract.connect(alice) as NFTMarketplace;

        await expect(abnftContract_gasProvider["transferAnchor(bytes,bytes)"](attestationBob, dataBob))
        .to.emit(abnftContract, "Transfer") // Standard ERC721 event
        .withArgs(alice.address, bob.address, 1)
        .to.emit(abnftContract, "AnchorTransfer")
        .withArgs(alice.address, bob.address, anchor, 1);

        // Il proprietario dell'NFT deve approvare il marketplace a trasferire l'NFT per suo conto in caso di vendita
        await abnftContract_bob.approve(marketContract.getAddress(), TOKEN_ID);

        // Token is now at bob... so alice may hire a hacker quickly and reuse her attestation to get 
        // the token back from Bob ... which shall of course not work
        await expect(abnftContract_hacker["transferAnchor(bytes)"](mintAttestationAlice))
        .to.revertedWith("ERC6956-E9") // Standard ERC721 event


        const address = await abnftContract.getAddress();
        const market_address = await marketContract.getAddress();

        console.log("ERC6956 address");
        console.log(address);
        console.log("marketplace address");
        console.log(market_address);

        
        await expect(marketContract_bob.updateListing(
            address,
            TOKEN_ID,
            PRICE
        )).to.be.revertedWithCustomError(
            marketContract,
            "NotListed"
        );

        await expect(marketContract_bob.listItem(
            address,
            TOKEN_ID,
            0
        )).to.be.revertedWithCustomError(
            marketContract,
            "PriceMustBeAboveZero"
        );

        await expect(marketContract_bob.listItem(
            address,
            TOKEN_ID,
            PRICE
        )).to.emit(marketContract, "ItemListed"); // Il proprietario (siamo ancora connessi con il deployer) mette in vendita il prodotto

        await expect(marketContract_bob.updateListing(
            address,
            TOKEN_ID,
            PRICE
        )).to.emit(marketContract, "ItemListed");

        await expect(marketContract_bob.cancelListing(
            address,
            TOKEN_ID
        )).to.emit(marketContract, "ItemCanceled")
        .withArgs(address, TOKEN_ID, bob.address);
        
        await expect(marketContract_bob.listItem(
            address,
            TOKEN_ID,
            PRICE
        )).to.emit(marketContract, "ItemListed");

        await expect(
            marketContract_bob.listItem(
                address,
                TOKEN_ID,
                PRICE
            )
        ).to.be.revertedWithCustomError(
            marketContract,
            "AlreadyListed"
        );
    });
});