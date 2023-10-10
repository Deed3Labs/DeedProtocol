// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DeedNFT is ERC721, AccessControl {
    struct DeedInfo {
        string ipfsDetailsHash;
        AssetType assetType;
        uint256 price;
        string latLong;
    }
    uint256 private _nextTokenId;
    mapping(uint256 => DeedInfo) private deedInfoMap;
    bytes32 public constant VALIDATOR_ROLE = keccak256("MINTER_ROLE");

    enum AssetType {
        Land,
        Vehicle,
        Estate,
        CommercialEquipment
    }
    event DeedMinted(DeedInfo _deedInfo);

    constructor() ERC721("DeedNFT", "DEED") {
        _nextTokenId = 1;
        _setupRole(VALIDATOR_ROLE, msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mintAsset(
        address _to,
        string memory _ipfsDetailsHash,
        AssetType _assetType,
        string memory latLong
    ) public onlyRole(VALIDATOR_ROLE) {
        // require(_to != address(0), "invalid address");
        _mint(_to, _nextTokenId);
        DeedInfo storage deedInfo = deedInfoMap[_nextTokenId];
        deedInfo.ipfsDetailsHash = _ipfsDetailsHash;
        deedInfo.assetType = _assetType;
        deedInfo.latLong = latLong;
        _nextTokenId = _nextTokenId + 1;
        emit DeedMinted(deedInfo);
    }

    function setPrice(uint256 _deedId, uint32 _newPrice) public {
        require(msg.sender == ownerOf(_deedId), "ERC721: Must be owner of deedNFT to set price");
        DeedInfo storage deedInfo = deedInfoMap[_deedId];
        deedInfo.price = _newPrice;
    }

    function setIpfsDetailsHash(uint256 _tokenId, string memory _ipfsDetailsHash) internal virtual {
        require(_exists(_tokenId), "ERC721Metadata: URI set of nonexistent token");
        DeedInfo storage deedInfo = deedInfoMap[_tokenId];
        deedInfo.ipfsDetailsHash = _ipfsDetailsHash;
    }

    function setAssetType(uint256 _tokenId, AssetType _assetType) internal virtual {
        require(_exists(_tokenId), "ERC721Metadata: Asset type set of nonexistent token");
        DeedInfo storage deedInfo = deedInfoMap[_tokenId];
        deedInfo.assetType = _assetType;
    }

    function getDeedInfo(uint256 _tokenId) public view returns (DeedInfo memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");
        return deedInfoMap[_tokenId];
    }

    function addValidator(address minter) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VALIDATOR_ROLE, minter);
    }

    function removeValidator(address minter) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(VALIDATOR_ROLE, minter);
    }

    //External instead of public?
    function canSubdivide(uint256 tokenId) external view returns (bool) {
        AssetType assetType = getDeedInfo(tokenId).assetType;
        return assetType == AssetType.Land || assetType == AssetType.Estate;
    }

    //Use?
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
