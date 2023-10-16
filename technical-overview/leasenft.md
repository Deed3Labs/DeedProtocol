# LeaseNFT

### Overview

The LeaseNFT contract is responsible for representing lease agreements as NFTs. Each LeaseNFT is uniquely identifiable and stores essential lease agreement data, such as the lessee's address, rental amount, and duration.

**Key features of the LeaseNFT contract:**

* Inherits from ERC721, ensuring compliance with the ERC721 standard.
* Contains a mapping to store lease agreement data.
* Provides a createLease function, allowing authorized creators to create new LeaseNFTs representing lease agreements.
* Implements getter functions for querying lease agreement data.
* Minting and burning of LeaseNFT tokens
* Token URI for storing metadata related to the lease agreement

### Minting & Burning

LeaseNFT minting and burning are implemented using the **\_mint** and **\_burn** functions provided by the OpenZeppelin ERC721 contract. These functions can only be called by the contract owner or authorized addresses.

```
function mintToken(address to, uint256 tokenId) external onlyOwner { _mint(to, tokenId); } 
function burn(uint256 tokenId) external onlyOwner { _burn(tokenId); }
```

### LeaseNFT Metadata

The LeaseNFT metadata is stored off-chain in a JSON file and includes the following information:

* Lease agreement ID
* Property address
* Lessee and lessor details
* Lease start and end dates
* Rent amount and payment frequency
* Security deposit amount

The metadata is referenced using the token URI, which is a URL pointing to the JSON file. The token URI can be set and updated using the ERC721 **setTokenURI** function.

```
function mintToken(address to, uint256 tokenId) external onlyOwner { _mint(to, tokenId); } 
function burn(uint256 tokenId) external onlyOwner { _burn(tokenId); }
```
