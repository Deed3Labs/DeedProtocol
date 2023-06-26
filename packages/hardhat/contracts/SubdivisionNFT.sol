// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./DeedNFT.sol";
//was erc1155, multiple ownership? because cant call ownerof
contract SubdivisionNFT is ERC1155, AccessControl {
    uint256 private _nextTokenId;

    mapping(uint256 => uint256) private _parentDeeds;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    DeedNFT public deedNFT;

    constructor(string memory _uri, address _deedNFT) ERC1155(_uri) {
        _setupRole(MINTER_ROLE, _msgSender());
        require(_deedNFT != address(0), "Invalid DeedNFT address");
        deedNFT = DeedNFT(_deedNFT);
    }

    function mintSubdivision(
        address to,
        uint256 parentDeedId,
        uint256 amount
    ) public onlyRole(MINTER_ROLE) {
        require(deedNFT.ownerOf(parentDeedId) == _msgSender(), "Must be the owner of the parent deed");
        require(deedNFT.canSubdivide(parentDeedId), "Parent deed must be land or estate");

        _mint(to, _nextTokenId, amount, "");
        _setParentDeed(_nextTokenId, parentDeedId);
        _nextTokenId = _nextTokenId + 1;
    }

    function _setParentDeed(uint256 tokenId, uint256 parentDeedId) internal virtual {
        _parentDeeds[tokenId] = parentDeedId;
    }

    function getParentDeed(uint256 tokenId) public view returns (uint256) {
        return _parentDeeds[tokenId];
    }

    function ownerOfSubdivision(uint256 tokenId) public view returns (address) {
        require(balanceOf(_msgSender(), tokenId) > 0, "Caller does not own the specified token");
        return _msgSender();
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

}