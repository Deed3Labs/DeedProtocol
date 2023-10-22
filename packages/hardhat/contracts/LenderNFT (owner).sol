// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// EIP-2981 Interface for royalties
interface IERC2981 {
    function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount);
}

contract SellerNFT is ERC721URIStorage, Ownable, IERC2981 {
    using SafeMath for uint256;

    address public platformWallet;  // Wallet address to receive platform fees
    uint256 public constant PLATFORM_FEE = 500;  // 5% in basis points

    mapping(uint256 => uint256) public totalPaid;
    mapping(uint256 => bool) public isInDefault;

    event UpdatedTotalPaid(uint256 indexed tokenId, uint256 newTotal);
    event UpdatedDefaultStatus(uint256 indexed tokenId, bool isInDefault);

    constructor(string memory _name, string memory _symbol, address _platformWallet)
        ERC721(_name, _symbol)
    {
        platformWallet = _platformWallet;
    }

    function mintNFT(address to, uint256 tokenId, string memory tokenURI)
        public onlyOwner
    {
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function updateTotalPaid(uint256 tokenId, uint256 amountPaid) public onlyOwner {
        require(_exists(tokenId), "Token ID does not exist");
        totalPaid[tokenId] = totalPaid[tokenId].add(amountPaid);
        emit UpdatedTotalPaid(tokenId, totalPaid[tokenId]);
    }

    function updateDefaultStatus(uint256 tokenId, bool _isInDefault) public onlyOwner {
        require(_exists(tokenId), "Token ID does not exist");
        isInDefault[tokenId] = _isInDefault;
        emit UpdatedDefaultStatus(tokenId, _isInDefault);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId);

        if (from != address(0)) {
            totalPaid[tokenId] = 0;
            isInDefault[tokenId] = false;
        }
        
        if (to != address(0)) {
            totalPaid[tokenId] = 0;
            isInDefault[tokenId] = false;
        }
    }

    // EIP-2981 implementation
    function royaltyInfo(uint256, uint256 salePrice) external view override returns (address receiver, uint256 royaltyAmount) {
        royaltyAmount = salePrice * PLATFORM_FEE / 10000;
        receiver = platformWallet;
        return (receiver, royaltyAmount);
    }
}
