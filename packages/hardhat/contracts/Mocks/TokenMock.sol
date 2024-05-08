// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

// Example class - a mock class using delivering from ERC20
contract TokenMock is ERC20 {
    constructor(string memory name, string memory symbol) payable ERC20(name, symbol) {}

    function mint(address owner, uint256 amount) external {
        _mint(owner, amount);
    }
}
