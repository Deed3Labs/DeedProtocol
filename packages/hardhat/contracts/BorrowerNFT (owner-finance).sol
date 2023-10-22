// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// EIP-2981 Interface for royalties
interface IERC2981 {
    function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount);
}

contract BuyerNFT is ERC721URIStorage, Ownable, IERC2981 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public platformWallet;  // Wallet address to receive platform fees
    uint256 public constant PLATFORM_FEE = 500;  // 5% in basis points

    struct BuyerData {
        uint256 totalPaid;
        bool isFinancingComplete;
        bool isUnderDefault;
    }

    mapping(uint256 => BuyerData) public buyerData;

    event TotalPaidUpdated(uint256 tokenId, uint256 newTotalPaid);
    event FinancingStatusUpdated(uint256 tokenId, bool isFinancingComplete);
    event DefaultStatusUpdated(uint256 tokenId, bool isUnderDefault);

    constructor(address _platformWallet) ERC721("BuyerNFT", "B-NFT") {
        platformWallet = _platformWallet;
    }

    function mintNFT(address buyer, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        _mint(buyer, tokenId);
        _setTokenURI(tokenId, tokenURI);

        BuyerData memory newBuyerData = BuyerData(0, false, false);
        buyerData[tokenId] = newBuyerData;

        return tokenId;
    }

    function updateTotalPaid(uint256 tokenId, uint256 amountPaid) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        buyerData[tokenId].totalPaid += amountPaid;

        emit TotalPaidUpdated(tokenId, buyerData[tokenId].totalPaid);
    }

    function markFinancingComplete(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(!buyerData[tokenId].isFinancingComplete, "Financing is already complete");

        buyerData[tokenId].isFinancingComplete = true;

        emit FinancingStatusUpdated(tokenId, true);
    }

    function markAsDefault(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(!buyerData[tokenId].isUnderDefault, "Token is already under default");

        buyerData[tokenId].isUnderDefault = true;

        emit DefaultStatusUpdated(tokenId, true);
    }

    // EIP-2981 implementation
    function royaltyInfo(uint256, uint256 salePrice) external view override returns (address receiver, uint256 royaltyAmount) {
        royaltyAmount = salePrice * PLATFORM_FEE / 10000;
        receiver = platformWallet;
        return (receiver, royaltyAmount);
    }
}


