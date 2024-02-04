// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./AccessManager.sol";

contract DeedNFT is ERC721, ERC721URIStorage, AccessManagerBase {
    struct DeedInfo {
        AssetType assetType;
        bool isValidated;
    }

    uint256 public nextDeedId;
    mapping(uint256 => DeedInfo) private deedInfoMap;

    enum AssetType {
        Land,
        Vehicle,
        Estate,
        CommercialEquipment
    }

    event DeedNFTMinted(uint256 deedId, DeedInfo deedInfo, address minter, string ipfsHash);
    event DeedNFTBurned(uint256 deedId);
    event DeedNFTAssetValidationSet(uint256 deedId, bool isValid);
    event DeedNFTIpfsDetailsSet(uint256 deedId, string newIpfsDetailsHash);
    event DeedNFTAssetTypeSet(uint256 deedId, AssetType newAssetType);

    constructor(address _accessManager) ERC721("DeedNFT", "DEED") ERC721URIStorage() AccessManagerBase(_accessManager) {
        nextDeedId = 1;
    }

    modifier deedExists(uint256 _deedId) {
        require(
            _ownerOf(_deedId) != address(0),
            string.concat("[DeedNFT] Deed does not exist with id ", Strings.toString(_deedId))
        );
        _;
    }

    modifier onlyOwner(uint256 _deedId) {
        require(
            _msgSender() == _ownerOf(_deedId),
            string.concat("[DeedNFT] Must be owner of the Deed with id ", Strings.toString(_deedId))
        );
        _;
    }

    function mintAsset(
        address _owner,
        string memory _ipfsDetailsHash,
        AssetType _assetType
    ) public onlyValidator returns (uint256) {
        _mint(_owner, nextDeedId);

        DeedInfo storage deedInfo = deedInfoMap[nextDeedId];
        deedInfo.assetType = _assetType;
        _setTokenURI(nextDeedId, _ipfsDetailsHash);
        deedInfo.isValidated = true;
        emit DeedNFTMinted(nextDeedId, deedInfo, _msgSender(), _ipfsDetailsHash);
        nextDeedId = nextDeedId + 1;
        return nextDeedId;
    }

    function burn(uint256 _deedId) public onlyOwner(_deedId) {
        _burn(_deedId);
        emit DeedNFTBurned(_deedId);
    }

    function setAssetValidation(uint256 _deedId, bool _isValid) public onlyValidator {
        require(_ownerOf(_deedId) != _msgSender(), "[DeedNFT] Owner cannot validate their own asset");
        _setAssetValidation(_deedId, _isValid);
    }

    function setIpfsDetailsHash(
        uint256 _deedId,
        string memory _ipfsDetailsHash
    ) public virtual deedExists(_deedId) onlyOwner(_deedId) {
        _setTokenURI(_deedId, _ipfsDetailsHash);
        _setAssetValidation(_deedId, false);
        emit DeedNFTIpfsDetailsSet(_deedId, _ipfsDetailsHash);
    }

    function setAssetType(uint256 _deedId, AssetType _assetType) public deedExists(_deedId) onlyOwner(_deedId) {
        DeedInfo storage deedInfo = deedInfoMap[_deedId];
        deedInfo.assetType = _assetType;
        _setAssetValidation(_deedId, false);
        emit DeedNFTAssetTypeSet(_deedId, _assetType);
    }

    function getDeedInfo(uint256 _deedId) public view deedExists(_deedId) returns (DeedInfo memory) {
        return deedInfoMap[_deedId];
    }

    function canSubdivide(uint256 _deedId) external view returns (bool) {
        AssetType assetType = getDeedInfo(_deedId).assetType;
        return assetType == AssetType.Land || assetType == AssetType.Estate;
    }

    function supportsInterface(
        bytes4 _interfaceId
    ) public view virtual override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(_interfaceId);
    }

    function tokenURI(uint256 _deedId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(_deedId);
    }

    function _setAssetValidation(uint256 _deedId, bool _isValid) internal {
        DeedInfo storage deedInfo = deedInfoMap[_deedId];
        deedInfo.isValidated = _isValid;
        emit DeedNFTAssetValidationSet(_deedId, _isValid);
    }
}
