// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

contract LeaseNFT is ERC721, Ownable {
    
    address private leaseAgreementAddress;
    constructor() ERC721("LeaseNFT", "LEASE") {}
    function setLeaseAgreementAddress(address _leaseAgreementAddress) public onlyOwner{
        leaseAgreementAddress=_leaseAgreementAddress;
    }
    function mintToken(address to, uint256 tokenId) external {
        _mint(to, tokenId);
    }

    function burn(uint256 tokenId) external {
        require(msg.sender == this.ownerOf(tokenId) || msg.sender == leaseAgreementAddress, "Only token owner can burn the leaseNFT");
        _burn(tokenId);
    }
}
