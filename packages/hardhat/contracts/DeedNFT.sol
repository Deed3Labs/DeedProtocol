// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract DeedNFT is ERC721, AccessControl {
    uint256 private _nextTokenId;

    mapping(uint256 => string) private _tokenNames;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => AssetType) private _tokenAssetTypes;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    enum AssetType { Land, Vehicle, Estate, CommercialEquipment}

    constructor() ERC721("DeedNFT", "DEED") {
        _nextTokenId = 1;
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE,msg.sender);
    }

    function mintAsset(
        address _to,
        string memory _tokenURI,
        string memory _name,
        AssetType _assetType
    ) public onlyRole(MINTER_ROLE) {
        // require(_to != address(0), "invalid address");
        _mint(_to, _nextTokenId);
        _setTokenURI(_nextTokenId, _tokenURI);
        _setName(_nextTokenId, _name);
        _setAssetType(_nextTokenId, _assetType);
        _nextTokenId = _nextTokenId + 1;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    function _setName(uint256 tokenId, string memory _name) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: Name set of nonexistent token");
        _tokenNames[tokenId] = _name;
    }
    function getTokenName(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: Name query for nonexistent token");
        return _tokenNames[tokenId];
    }




    function _setAssetType(uint256 tokenId, AssetType _assetType) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: Asset type set of nonexistent token");
        _tokenAssetTypes[tokenId] = _assetType;
    }

    function getAssetType(uint256 tokenId) public view returns (AssetType) {
        require(_exists(tokenId), "ERC721Metadata: Asset type query for nonexistent token");
        return _tokenAssetTypes[tokenId];
    }

    function addMinter(address minter) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINTER_ROLE, minter);
    }

    function removeMinter(address minter) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(MINTER_ROLE, minter);
    }
    //External instead of public?
    function canSubdivide(uint256 tokenId) public view returns (bool) {
        AssetType assetType = getAssetType(tokenId);
        return assetType == AssetType.Land || assetType == AssetType.Estate;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}