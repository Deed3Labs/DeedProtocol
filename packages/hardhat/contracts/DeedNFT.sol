// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DeedNFT is ERC721, AccessControl {
    struct DeedInfo {
        bytes ipfsDetailsHash;
        AssetType assetType;
        uint256 price;
        string deedAddress;
        bool isValidated;
    }
    uint256 private _nextDeedId;
    mapping(uint256 => DeedInfo) private deedInfoMap;
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    enum AssetType {
        Land,
        Vehicle,
        Estate,
        CommercialEquipment
    }

    event DeedNFTMinted(uint256 deedId, DeedInfo deedInfo, address minter);
    event DeedNFTBurned(uint256 deedId);
    event DeedNFTAssetValidationSet(uint256 deedId, bool isValid);
    event DeedNFTIpfsDetailsSet(uint256 deedId, bytes newIpfsDetailsHash);
    event DeedNFTPriceUpdated(uint256 deedId, uint256 newPrice);
    event DeedNFTAssetTypeSet(uint256 deedId, AssetType newAssetType);

    constructor() ERC721("DeedNFT", "DEED") {
        _nextDeedId = 1;
        _setupRole(VALIDATOR_ROLE, _msgSender());
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    modifier deedExists(uint256 _deedId) {
        require(_exists(_deedId), string.concat("[DeedNFT] Deed does not exist with id ", Strings.toString(_deedId)));
        _;
    }

    modifier onlyOwner(uint256 _deedId) {
        require(
            _msgSender() == ownerOf(_deedId),
            string.concat("[DeedNFT] Must be owner of the Deed with id ", Strings.toString(_deedId))
        );
        _;
    }

    function mintAsset(
        address _owner,
        bytes memory _ipfsDetailsHash,
        AssetType _assetType,
        string memory _deedAddress
    ) public {
        _mint(_owner, _nextDeedId);
        DeedInfo storage deedInfo = deedInfoMap[_nextDeedId];
        deedInfo.ipfsDetailsHash = _ipfsDetailsHash;
        deedInfo.assetType = _assetType;
        deedInfo.deedAddress = _deedAddress;
        deedInfo.isValidated = false;
        emit DeedNFTMinted(_nextDeedId, deedInfo, _msgSender());
        _nextDeedId = _nextDeedId + 1;
    }

    function burn(uint256 _deedId) public onlyOwner(_deedId) {
        _burn(_deedId);
        emit DeedNFTBurned(_deedId);
    }

    function setAssetValidation(uint256 _deedId, bool _isValid) public onlyRole(VALIDATOR_ROLE) {
        DeedInfo storage deedInfo = deedInfoMap[_deedId];
        deedInfo.isValidated = _isValid;
        emit DeedNFTAssetValidationSet(_deedId, _isValid);
    }

    function setPrice(uint256 _deedId, uint32 _newPrice) public deedExists(_deedId) onlyOwner(_deedId) {
        DeedInfo storage deedInfo = deedInfoMap[_deedId];
        deedInfo.price = _newPrice;
        emit DeedNFTPriceUpdated(_deedId, _newPrice);
    }

    function setIpfsDetailsHash(
        uint256 _deedId,
        bytes memory _ipfsDetailsHash
    ) public virtual deedExists(_deedId) onlyOwner(_deedId) {
        DeedInfo storage deedInfo = deedInfoMap[_deedId];
        deedInfo.ipfsDetailsHash = _ipfsDetailsHash;
        emit DeedNFTIpfsDetailsSet(_deedId, _ipfsDetailsHash);
    }

    function setAssetType(
        uint256 _deedId,
        AssetType _assetType
    ) internal virtual deedExists(_deedId) onlyOwner(_deedId) {
        DeedInfo storage deedInfo = deedInfoMap[_deedId];
        deedInfo.assetType = _assetType;
        emit DeedNFTAssetTypeSet(_deedId, _assetType);
    }

    function getDeedInfo(uint256 _deedId) public view deedExists(_deedId) returns (DeedInfo memory) {
        return deedInfoMap[_deedId];
    }

    function addValidator(address _validator) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VALIDATOR_ROLE, _validator);
    }

    function removeValidator(address _validator) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(VALIDATOR_ROLE, _validator);
    }

    function canSubdivide(uint256 _deedId) external view returns (bool) {
        AssetType assetType = getDeedInfo(_deedId).assetType;
        return assetType == AssetType.Land || assetType == AssetType.Estate;
    }

    function supportsInterface(bytes4 _interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(_interfaceId);
    }
}
