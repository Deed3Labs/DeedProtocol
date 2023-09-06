// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BuyerNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Custom struct to hold Buyer-specific data
    struct BuyerData {
        uint256 totalPaid;
        bool isFinancingComplete;
        bool isUnderDefault;
    }

    // Mapping from token ID to BuyerData
    mapping(uint256 => BuyerData) public buyerData;

    // Events to log important changes and actions
    event TotalPaidUpdated(uint256 tokenId, uint256 newTotalPaid);
    event FinancingStatusUpdated(uint256 tokenId, bool isFinancingComplete);
    event DefaultStatusUpdated(uint256 tokenId, bool isUnderDefault);

    constructor() ERC721("BuyerNFT", "B-NFT") {}

    // Create a new BuyerNFT token
    function mintNFT(address buyer, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        _mint(buyer, tokenId);
        _setTokenURI(tokenId, tokenURI);

        BuyerData memory newBuyerData = BuyerData(0, false, false);
        buyerData[tokenId] = newBuyerData;

        return tokenId;
    }

    // Update the total amount paid by the buyer
    function updateTotalPaid(uint256 tokenId, uint256 amountPaid) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        buyerData[tokenId].totalPaid += amountPaid;

        emit TotalPaidUpdated(tokenId, buyerData[tokenId].totalPaid);
    }

    // Mark the financing as complete for a specific token ID
    function markFinancingComplete(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(!buyerData[tokenId].isFinancingComplete, "Financing is already complete");

        buyerData[tokenId].isFinancingComplete = true;

        emit FinancingStatusUpdated(tokenId, true);
    }

    // Mark the token as under default
    function markAsDefault(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(!buyerData[tokenId].isUnderDefault, "Token is already under default");

        buyerData[tokenId].isUnderDefault = true;

        emit DefaultStatusUpdated(tokenId, true);
    }

    // Custom logic for transferring tokens that updates internal state as well
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public override {
        super.safeTransferFrom(from, to, tokenId, _data);
        // Transfer doesn't change any specific state in BuyerNFT but you can add any additional logic here if necessary
    }
}
