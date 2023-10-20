// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DeedNFT is ERC721, AccessControl {
    struct DeedInfo {
        string ipfsDetailsHash;
        AssetType assetType;
        uint256 price;
        string deedAddress;
    }
    uint256 private _nextTokenId;
    mapping(uint256 => DeedInfo) private deedInfoMap;
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

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
        string memory _deedAddress
    ) public onlyRole(VALIDATOR_ROLE) {
        _mint(_to, _nextTokenId);
        DeedInfo storage deedInfo = deedInfoMap[_nextTokenId];
        deedInfo.ipfsDetailsHash=_ipfsDetailsHash;
        deedInfo.assetType=_assetType;
        deedInfo.deedAddress= _deedAddress;
        _nextTokenId = _nextTokenId + 1;
        emit DeedMinted(deedInfo);
    }
    function setPrice(uint256 _deedId, uint32 _newPrice) public {
        require(_exists(_deedId), "ERC721Metadata: Price set of nonexistent token");
        require(msg.sender == ownerOf(_deedId),"ERC721: Must be owner of deedNFT to set price");
        DeedInfo storage deedInfo = deedInfoMap[_deedId];
        deedInfo.price=_newPrice;
    }

    function setIpfsDetailsHash(uint256 _tokenId, string memory _ipfsDetailsHash) internal virtual {
        require(_exists(_tokenId), "ERC721Metadata: URI set of nonexistent token");
        require(msg.sender == ownerOf(_tokenId),"ERC721: Must be owner of deedNFT to set IPFS hash");
        DeedInfo storage deedInfo = deedInfoMap[_tokenId];
        deedInfo.ipfsDetailsHash = _ipfsDetailsHash;
    }

    function setAssetType(uint256 _tokenId, AssetType _assetType) internal virtual {
        require(_exists(_tokenId), "ERC721Metadata: Asset type set of nonexistent token");
        require(msg.sender==ownerOf(_tokenId), "ERC721: Must be owner of deedNFT to set asset type");
        DeedInfo storage deedInfo = deedInfoMap[_tokenId];
        deedInfo.assetType = _assetType;
    }

    function getDeedInfo(uint256 _tokenId) public view  returns (DeedInfo memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");
        return deedInfoMap[_tokenId];
    }

    function addValidator(address minter) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VALIDATOR_ROLE, minter);
    }

    function removeValidator(address minter) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(VALIDATOR_ROLE, minter);
    }
    
    function canSubdivide(uint256 tokenId) external view returns (bool) {
        AssetType assetType = getDeedInfo(tokenId).assetType;
        return assetType == AssetType.Land || assetType == AssetType.Estate;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
