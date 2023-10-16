# DeedNFT

### Overview

The DeedNFT contract is responsible for representing real assets and physical properties as NFTs on the blockchain. Each NFT is uniquely identifiable and holds metadata such as the asset's name, symbol, type, and a URI pointing to the asset's detailed information.

**Key features of the DeedNFT contract:**

* Inherits from ERC721 and AccessControl, ensuring compliance with the ERC721 standard and enabling role-based access control.
* Contains a mapping to store token metadata, including names, symbols, URIs, and asset types.
* Includes an AssetType enum to represent different types of assets.
* Defines a MINTER\_ROLE constant for managing the minting process.
* Provides a constructor that initializes the contract and sets the initial minter role.
* Provides mintAsset function, allowing users with the MINTER\_ROLE to create new NFTs representing real assets.
* Implements getter functions for querying token metadata.
* Includes addMinter and removeMinter functions for adding and removing minters by users with the DEFAULT\_ADMIN\_ROLE.
* Minting and burning of DeedNFT tokens
* Token URI for storing metadata related to the property ownership deed

### Minting & Burning

Similar to LeaseNFT, DeedNFT minting and burning are implemented using the **\_mint** and **\_burn** functions provided by the OpenZeppelin ERC721 contract. These functions can only be called by the contract owner or authorized addresses.

```
function mintToken(address to, uint256 tokenId) external onlyOwner { _mint(to, tokenId); } 
function burn(uint256 tokenId) external onlyOwner { _burn(tokenId); }
```

### DeedNFT Metadata

The DeedNFT metadata is stored off-chain in a JSON file and includes the following information:

* Property ownership deed ID
* Property address
* Owner details
* Legal description of the property
* Date of ownership transfer
* Property value

The metadata is referenced using the token URI, which is a URL pointing to the JSON file. The token URI can be set and updated using the ERC721 **setTokenURI** function.

```
function mintToken(address to, uint256 tokenId) external onlyOwner { _mint(to, tokenId); } 
function burn(uint256 tokenId) external onlyOwner { _burn(tokenId); }
```
