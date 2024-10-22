// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol"; // Import necessario per poter richiamare alcune funzioni che manipolano gli NFT, tra cui la funzione di approvazione per lavorare con un NFT e la funzione per trasferire un NFT
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol"; //Import necessario per il modifier nonReentrant
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

// Contratto che gestisce la compravendita di NFT. Ereditiamo da ReentrancyGuard per alcune funzionalità di sicurezza e dall'interfaccia AutomationCompatible per introdurre dell'automazione nelle funzioni
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IERC6956.sol";


error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error NotListed(address nftAddress, uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NotOwner();
error AlreadyOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();
error NotToRedeem();


contract NFTMarketplace is ReentrancyGuard, Ownable {
    struct Listing {
        address seller;
        uint256 price;
    }

    struct Transaction {
        address seller;
        address buyer;
    }

    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => mapping(uint256 => Transaction)) private s_toBeRedeemed;
    mapping(address => uint256) private s_proceeds;

    event ItemListed(
        address indexed nftAddress,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    event ItemCanceled(
        address indexed nftAddress,
        uint256 indexed tokenId,
        address indexed seller
    );

    event ItemBought(
        address indexed nftAddress,
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price
    );

    event ItemRedeemed(
        address indexed nftAddress,
        uint256 indexed tokenId, 
        address indexed buyer
    );

    constructor() Ownable(msg.sender) {
        // _transferOwnership(msg.sender);
    }


    // Function modifiers
    modifier notListed(
            address nftAddress,
            uint256 tokenId,
            address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    modifier isNotOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender == owner) {
            revert AlreadyOwner();
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NotListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isToRedeem(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        Transaction memory toBeRedeemed = s_toBeRedeemed[nftAddress][tokenId];
        if (toBeRedeemed.buyer != msg.sender) {
            revert NotToRedeem();
        }
        _;
    }


    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(nftAddress, tokenId, msg.sender)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert PriceMustBeAboveZero();
        }
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }
        s_listings[nftAddress][tokenId] = Listing(msg.sender, price);
        emit ItemListed(nftAddress, tokenId, msg.sender, price);
    }
    
    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        isListed(nftAddress, tokenId)
        nonReentrant
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (newPrice == 0) {
            revert PriceMustBeAboveZero();
        }

        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemListed(nftAddress, tokenId, msg.sender, newPrice);
    }
    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCanceled(nftAddress, tokenId, msg.sender);
    }


    // function withdrawProceeds() external {
    //     uint256 proceeds = s_proceeds[msg.sender];
    //     if (proceeds <= 0) {
    //         revert NoProceeds();
    //     }
    //     s_proceeds[msg.sender] = 0;

    //     (bool success, ) = payable(msg.sender).call{value: proceeds}("");
    //     require(success, "Transfer failed");
    // }

    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        isListed(nftAddress, tokenId)
        isNotOwner(nftAddress, tokenId, msg.sender)
        nonReentrant
    {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if (msg.value < listedItem.price) {
            revert PriceNotMet(nftAddress, tokenId, listedItem.price);
        }

        // Invece di usare il push method, semplicemente facciamo pagamento normale
        s_proceeds[listedItem.seller] += msg.value;
        // Transfer ETH to the seller
        payable(listedItem.seller).transfer(msg.value);

        s_toBeRedeemed[nftAddress][tokenId] = Transaction(listedItem.seller, msg.sender);
        delete (s_listings[nftAddress][tokenId]);
        
        emit ItemBought(nftAddress, tokenId, msg.sender, listedItem.price);
    }


    function redeemItem(address nftAddress, uint256 tokenId, bytes memory attestation, bytes memory data)
        public
        nonReentrant 
        isToRedeem(nftAddress, tokenId, msg.sender)
    {
        Transaction storage toBeRedeemed = s_toBeRedeemed[nftAddress][tokenId];
        require(toBeRedeemed.buyer == msg.sender, "You are not the buyer of this token");

        IERC6956(nftAddress).transferAnchor(attestation, data);

        delete s_toBeRedeemed[nftAddress][tokenId];

        emit ItemRedeemed(nftAddress, tokenId, msg.sender);
    }

    function redeemItem(address nftAddress, uint256 tokenId, bytes memory attestation)
        public
        nonReentrant 
        isToRedeem(nftAddress, tokenId, msg.sender)
    {
        return redeemItem(nftAddress, tokenId, attestation, "");
    }

    // function getProceeds(address seller) external view returns (uint256) {
    //     return s_proceeds[seller];
    // }
}
