// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./DeedNFT.sol";
import "./AccessManager.sol";

contract SubdivisionNFT is ERC1155, AccessManagerBase {
    struct SubdivisionInfo {
        bytes ipfsDetailsHash;
        address owner;
        uint256 parentDeed;
    }

    uint256 private _nextsubTokenID;
    mapping(uint256 => SubdivisionInfo) private subdivisionInfoMap;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    DeedNFT public deedNFT;

    event SubdivisionMinted(
        address subdivisionOwner,
        uint256 subdivisionId,
        uint256 deedId,
        bytes ipfsDetailsHash,
        address minter
    );
    event SubdivisionBurned(address account, uint256 subdivisionId, uint256 deedId, bytes ipfsDetailsHash);
    event SubdivisionInfoSet(uint256 tokenId, SubdivisionInfo info);

    constructor(address _deedNFT, address _accessManager) ERC1155("") AccessManagerBase(_accessManager) {
        require(_deedNFT != address(0), "[SubdivisionNFT] Invalid DeedNFT address");

        _nextsubTokenID = 1;
        deedNFT = DeedNFT(_deedNFT);
    }

    function mintSubdivision(SubdivisionInfo memory _info) public {
        require(
            _msgSender() == deedNFT.ownerOf(_info.parentDeed),
            "[SubdivisionNFT] Sender must be the owner of the parent deed"
        );
        require(deedNFT.canSubdivide(_info.parentDeed), "[SubdivisionNFT] Parent deed must be land or estate");

        _mint(_info.owner, _nextsubTokenID, 1, _info.ipfsDetailsHash);
        SubdivisionInfo storage subInfo = subdivisionInfoMap[_nextsubTokenID];
        subInfo.ipfsDetailsHash = _info.ipfsDetailsHash;
        subInfo.owner = _info.owner;
        subInfo.parentDeed = _info.parentDeed;

        emit SubdivisionMinted(_info.owner, _nextsubTokenID, _info.parentDeed, _info.ipfsDetailsHash, _msgSender());
        _nextsubTokenID = _nextsubTokenID + 1;
    }

    function batchMint(SubdivisionInfo[] memory _infos) public {
        for (uint i = 0; i < _infos.length; i++) {
            mintSubdivision(_infos[i]);
        }
    }

    function setInfo(uint256 _subTokenId, SubdivisionInfo memory _newInfo) public virtual {
        require(
            isOwnerOfSubdivision(_msgSender(), _subTokenId) == true,
            "[SubdivisionNFT] Sender Must be owner of subdivision to set info"
        );

        subdivisionInfoMap[_subTokenId] = _newInfo;

        emit SubdivisionInfoSet(_subTokenId, _newInfo);
    }

    function burnSubdivision(uint256 _subTokenId) public {
        require(
            isOwnerOfSubdivision(_msgSender(), _subTokenId) == true,
            "[SubdivisionNFT] Sender must be owner of the subdivision to burn it"
        );

        _burn(_msgSender(), _subTokenId, 1);

        emit SubdivisionBurned(
            _msgSender(),
            _subTokenId,
            subdivisionInfoMap[_subTokenId].parentDeed,
            subdivisionInfoMap[_subTokenId].ipfsDetailsHash
        );
    }

    function getParentDeed(uint256 _subTokenId) public view returns (uint256) {
        SubdivisionInfo storage info = subdivisionInfoMap[_subTokenId];
        return info.parentDeed;
    }

    function isOwnerOfSubdivision(address _owner, uint256 _subTokenId) public view returns (bool) {
        return balanceOf(_owner, _subTokenId) > 0;
    }

    function supportsInterface(bytes4 _interfaceId) public view virtual override(ERC1155) returns (bool) {
        return super.supportsInterface(_interfaceId);
    }
}
