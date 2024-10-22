import { assert, expect } from "chai";
import { ethers, ignition } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { merkleTestAnchors, NULLADDR, createAttestationWithData } from "./commons";
import { ERC6956Full, NFTMarketplace } from '../typechain';
import ERC6956FullModule from "../ignition/modules/ERC6956FullModule";
import NFTMarketplaceModule from "../ignition/modules/NFTMarketplaceModule";


describe("NFT Marketplace Tests", function () {
    const PRICE = ethers.parseEther("0.001");
    const TOKEN_ID = 1;

    async function deployAbNftFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, maintainer, oracle, alice, bob, mallory, hacker, carl, gasProvider ] = await ethers.getSigners();
    
        
        const { erc6956full: abnftContract } = await ignition.deploy(ERC6956FullModule);
        const { nftmarketplace: marketContract } = await ignition.deploy(NFTMarketplaceModule);
    
        const abnftContract_owner = abnftContract.connect(owner) as ERC6956Full;
        const abnftContract_mantainer = abnftContract.connect(maintainer) as ERC6956Full;
        
        abnftContract_owner.updateMaintainer(maintainer.address, true);
    
        await expect(abnftContract_mantainer.updateOracle(oracle.address, true))
          .to.emit(abnftContract, "OracleUpdate")
          .withArgs(oracle.address, true);
    
        // Create Merkle Tree
        const merkleTree = StandardMerkleTree.of(merkleTestAnchors, ["bytes32"]);
    
        return { abnftContract, marketContract, merkleTree, owner, maintainer, oracle, alice, bob, mallory, hacker, carl, gasProvider };
    }

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


    it("SHOULD allow listing and buying", async function() {
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
        .withArgs(alice.address, bob.address, anchor, 1, "https://gold-magnificent-stork-310.mypinata.cloud/ipfs/");

        // Il proprietario dell'NFT deve approvare il marketplace a trasferire l'NFT per suo conto in caso di vendita
        await abnftContract_bob.approve(marketContract.getAddress(), TOKEN_ID);

        // Token is now at bob... so alice may hire a hacker quickly and reuse her attestation to get 
        // the token back from Bob ... which shall of course not work
        await expect(abnftContract_hacker["transferAnchor(bytes)"](mintAttestationAlice))
        .to.revertedWith("ERC6956-E9") // Standard ERC721 event


        const address = await abnftContract.getAddress();
        const market_address = await marketContract.getAddress();

        await expect(marketContract_alice.listItem(
            address,
            TOKEN_ID,
            PRICE
        )).to.revertedWithCustomError(marketContract, "NotOwner");

        await expect(marketContract_bob.listItem(
            address,
            TOKEN_ID,
            ethers.parseEther("0")
        )).to.revertedWithCustomError(marketContract, "PriceMustBeAboveZero");

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

        await expect(marketContract_bob.updateListing(
            address,
            TOKEN_ID,
            ethers.parseEther("0")
        )).to.revertedWithCustomError(marketContract, "PriceMustBeAboveZero");

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
        .withArgs(bob.address, alice.address, anchor, 1, "https://gold-magnificent-stork-310.mypinata.cloud/ipfs/")
        .and.to.emit(marketContract, "ItemRedeemed")
        .withArgs(abnftContract.getAddress(), TOKEN_ID, alice.address);

        // Controlliamo che sia cambiato il proprietario dell'NFT
        const newOwner = await abnftContract.ownerOf(TOKEN_ID); // Gli NFT costruiti sullo standard ERC721 hanno sempre la funzione ownerOf

        // Assert
        assert(newOwner.toString() == alice.address);
    }) 


    it("SHOULD allow listing of NFT and cancel listing", async function () {
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
        .withArgs(alice.address, bob.address, anchor, 1, "https://gold-magnificent-stork-310.mypinata.cloud/ipfs/");

        // Il proprietario dell'NFT deve approvare il marketplace a trasferire l'NFT per suo conto in caso di vendita
        await abnftContract_bob.approve(marketContract.getAddress(), TOKEN_ID);

        // Token is now at bob... so alice may hire a hacker quickly and reuse her attestation to get 
        // the token back from Bob ... which shall of course not work
        await expect(abnftContract_hacker["transferAnchor(bytes)"](mintAttestationAlice))
        .to.revertedWith("ERC6956-E9") // Standard ERC721 event


        const address = await abnftContract.getAddress();
        const market_address = await marketContract.getAddress();

        
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
    });
    it("SHOULDN'T allow listing of NFT when already listed", async function () {
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
        .withArgs(alice.address, bob.address, anchor, 1, "https://gold-magnificent-stork-310.mypinata.cloud/ipfs/");

        // Il proprietario dell'NFT deve approvare il marketplace a trasferire l'NFT per suo conto in caso di vendita
        await abnftContract_bob.approve(marketContract.getAddress(), TOKEN_ID);

        // Token is now at bob... so alice may hire a hacker quickly and reuse her attestation to get 
        // the token back from Bob ... which shall of course not work
        await expect(abnftContract_hacker["transferAnchor(bytes)"](mintAttestationAlice))
        .to.revertedWith("ERC6956-E9") // Standard ERC721 event


        const address = await abnftContract.getAddress();
        const market_address = await marketContract.getAddress();

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