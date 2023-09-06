// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SellerNFT is ERC721URIStorage, Ownable {
    using SafeMath for uint256;

    // Mapping of NFT to its total payment received
    mapping(uint256 => uint256) public totalPaid;

    // Mapping of NFT to its default status
    mapping(uint256 => bool) public isInDefault;

    // Events
    event UpdatedTotalPaid(uint256 indexed tokenId, uint256 newTotal);
    event UpdatedDefaultStatus(uint256 indexed tokenId, bool isInDefault);

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}

    // Function to mint new NFTs
    function mintNFT(address to, uint256 tokenId, string memory tokenURI)
        public onlyOwner
    {
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    // Function to update total payment received for a token
    function updateTotalPaid(uint256 tokenId, uint256 amountPaid) public onlyOwner {
        require(_exists(tokenId), "Token ID does not exist");
        totalPaid[tokenId] = totalPaid[tokenId].add(amountPaid);
        emit UpdatedTotalPaid(tokenId, totalPaid[tokenId]);
    }

    // Function to update default status
    function updateDefaultStatus(uint256 tokenId, bool _isInDefault) public onlyOwner {
        require(_exists(tokenId), "Token ID does not exist");
        isInDefault[tokenId] = _isInDefault;
        emit UpdatedDefaultStatus(tokenId, _isInDefault);
    }
}

    // Override function to handle state change on transfer
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId);

        // Additional logic to handle state changes and logging
        if (from != address(0)) {
            // Logic to remove state when token is transferred from a valid address
            totalPaid[tokenId] = 0;
            isInDefault[tokenId] = false;
        }
        
        if (to != address(0)) {
            // Logic to initiate state when token is transferred to a new address
            // Assuming initial state is zero payment and not in default
            totalPaid[tokenId] = 0;
            isInDefault[tokenId] = false;
        }
    }
}
