// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./AccessManager.sol";

contract DeedNFT is ERC721Upgradeable, ERC721URIStorageUpgradeable, AccessManagerBase {
    struct DeedInfo {
        AssetType assetType;
        bool isValidated;
        uint256[10] __gap;
    }

    uint256 public nextDeedId;
    mapping(uint256 => DeedInfo) private deedInfoMap;
    uint256[36] __gap;

    enum AssetType {
        Land,
        Vehicle,
        Estate,
        CommercialEquipment
    }

    event DeedNFTMinted(uint256 deedId, DeedInfo deedInfo, address minter, string uri);
    event DeedNFTBurned(uint256 deedId);
    event DeedNFTValidatedChanged(uint256 deedId, bool isValid);
    event DeedNFTUriChanged(uint256 deedId, string newIpfsDetailsHash);
    event DeedNFTAssetTypeChanged(uint256 deedId, AssetType newAssetType);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _accessManager) public override(AccessManagerBase) initializer {
        __ERC721URIStorage_init();
        __ERC721_init("DeedNFT", "DEED");
        AccessManagerBase.initialize(_accessManager);
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

    modifier onlyOwnerOrValidator(uint256 _deedId) {
        require(
            _msgSender() == _ownerOf(_deedId) || hasValidatorRole(),
            string.concat("[DeedNFT] Must be validator or owner of the Deed with id ", Strings.toString(_deedId))
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
        nextDeedId -= 1;
        delete deedInfoMap[_deedId];
        emit DeedNFTBurned(_deedId);
    }

    function setAssetValidation(uint256 _deedId, bool _isValid) public onlyValidator {
        require(_ownerOf(_deedId) != _msgSender(), "[DeedNFT] Owner cannot validate their own asset");
        _setAssetValidation(_deedId, _isValid);
    }

    function setIpfsDetailsHash(
        uint256 _deedId,
        string memory _ipfsDetailsHash
    ) public virtual deedExists(_deedId) onlyOwnerOrValidator(_deedId) {
        _setTokenURI(_deedId, _ipfsDetailsHash);
        if(hasValidatorRole() == false) {
          _setAssetValidation(_deedId, false);
        }
        emit DeedNFTUriChanged(_deedId, _ipfsDetailsHash);
    }

    function setAssetType(uint256 _deedId, AssetType _assetType) public deedExists(_deedId) onlyOwner(_deedId) {
        DeedInfo storage deedInfo = deedInfoMap[_deedId];
        deedInfo.assetType = _assetType;
        _setAssetValidation(_deedId, false);
        emit DeedNFTAssetTypeChanged(_deedId, _assetType);
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
    ) public view virtual override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (bool) {
        return super.supportsInterface(_interfaceId);
    }

    function tokenURI(
        uint256 _deedId
    ) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
        return super.tokenURI(_deedId);
    }

    function _setAssetValidation(uint256 _deedId, bool _isValid) internal {
        DeedInfo storage deedInfo = deedInfoMap[_deedId];
        deedInfo.isValidated = _isValid;
        emit DeedNFTValidatedChanged(_deedId, _isValid);
    }
}
