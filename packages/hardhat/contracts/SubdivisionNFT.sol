// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./DeedNFT.sol";

//was erc1155, multiple ownership? because cant call ownerof
contract SubdivisionNFT is ERC1155, AccessControl {
    uint256 private _nextsubTokenID;
    //rename var
    mapping(uint256 => uint256) private _parentDeeds;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    DeedNFT public deedNFT;

    event subdivisionMinted(uint256 _subdivisionId, uint256 _deedId);
    constructor(string memory _uri, address _deedNFT) ERC1155(_uri) {
        require(_deedNFT != address(0), "Invalid DeedNFT address");
        _nextsubTokenID = 1;
        _setupRole(MINTER_ROLE, _msgSender());
        deedNFT = DeedNFT(_deedNFT);
    }

    //Took out onlyRole(MINTER_ROLE) because we only want owner to be able to mint and not the contract deployer
    function mintSubdivision(address _to, uint256 _parentDeedId, uint256 _amount) public {
        require(msg.sender == deedNFT.ownerOf(_parentDeedId), "Must be the owner of the parent deed");
        require(deedNFT.canSubdivide(_parentDeedId), "Parent deed must be land or estate");

        _mint(_to, _nextsubTokenID, _amount, "");
        _setParentDeed(_nextsubTokenID, _parentDeedId);
        emit subdivisionMinted(_nextsubTokenID, _parentDeedId);
        _nextsubTokenID = _nextsubTokenID + 1;
    }

    function batchMint(address[] memory addresses, uint256 parentDeedId, uint256 amount) public {
        require(msg.sender == deedNFT.ownerOf(parentDeedId), "Must be the owner of the parent deed");
        require(deedNFT.canSubdivide(parentDeedId), "Parent deed must be land or estate");

        for (uint i = 0; i < addresses.length; i++) {
            _mint(addresses[i], _nextsubTokenID, amount, "");
        }

        _setParentDeed(_nextsubTokenID, parentDeedId);
        _nextsubTokenID = _nextsubTokenID + 1;
    }

    function _setParentDeed(uint256 subTokenID, uint256 parentDeedId) internal virtual {
        _parentDeeds[subTokenID] = parentDeedId;
    }

    function getParentDeed(uint256 subTokenID) public view returns (uint256) {
        return _parentDeeds[subTokenID];
    }

    function isOwnerOfSubdivision(address _owner,uint256 subTokenID) public view returns (bool) {
        return balanceOf(_owner, subTokenID) > 0;
    }

    //Create ownerOfSubdivision(subDivID,address user);
    // function burn()require(msg.sender==ownerOf(Deed) && msg.sender == ownerOf(sub))
    function burnSubdivision(address account, uint256 subTokenID, uint256 amount) public {
        require(isOwnerOfSubdivision(msg.sender,subTokenID) == true, "Must own this subNFT to burn it");
        require(msg.sender == account, "Sender must be owner of specified account");
        _burn(account, subTokenID, amount);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
