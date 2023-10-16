# DApp & UI Integrations

### Overview

The platform provides a user-friendly interface (DApp) for interacting with the DeedNFT, LeaseNFT, and Lease Agreement contracts. The DApp enables users to perform various actions, including:

**Key features of the UI & DApp:**

* Registering real assets by creating DeedNFTs.
* Buying, selling, and exchanging DeedNFTs.
* Creating lease agreements by minting LeaseNFTs.
* Managing and updating lease agreements through the Lease Agreement Contract.

The DApp is designed to abstract the complexities of interacting with the smart contracts, providing a seamless experience for users while ensuring the secure and transparent management of real assets.

### DApp Architecture

The DApp consists of three main components:

1. Frontend UI: A user-friendly interface for interacting with the platform.
2. Backend server: A server for storing off-chain data and handling user authentication.
3. Smart contracts: LeaseNFT, DeedNFT, and Lease Agreement Contract deployed on the Ethereum blockchain.

### User Interface Design

The user interface (UI) should be designed with a focus on simplicity and ease of use. Key UI components include:

* Home page: An overview of the platform and its features.
* Browse properties: A page for browsing and searching available properties.
* Register prperty: A form for registering a property and minting a DeedNFT.
* Property details: A page displaying the details of a selected property, including its DeedNFT and LeaseNFT information.
* My properties: A page for users to view and manage their owned properties and leases.
* Create lease: A form for creating a new lease agreement and minting a LeaseNFT.
* Update lease: A form for updating an existing lease agreement.
* Terminate lease: A form for terminating an active lease agreement and burning the corresponding LeaseNFT.

### User Interaction Flow

The user interaction flow should be intuitive and streamlined, guiding users through the process of managing their properties and lease agreements. The flow is as follows:

1. Users log in or sign up for the platform using their Ethereum wallet.
2. Users can browse and search available properties on the platform.
3. Users can view the property details, including the DeedNFT and LeaseNFT information.
4. Users can create a lease agreement by filling out the Create Lease form, which includes information such as the DeedNFT token ID, lessee and lessor Ethereum addresses, lease start and end dates, rent amount, payment frequency, and security deposit.
5. The platform mints a LeaseNFT for the lease agreement and adds it to the user's account.
6. Users can view and manage their owned properties and leases in the My Properties section.
7. Users can update a lease agreement by filling out the Update Lease form, which includes the same information as the Create Lease form.
8. Users can terminate a lease agreement by filling out the Terminate Lease form and providing the LeaseNFT token ID.
9. The platform burns the LeaseNFT and updates the lease agreement status to terminated.

### Smart Contract Interactions

The DApp's frontend UI communicates with the smart contracts (LeaseNFT, DeedNFT, and Lease Agreement Contract) through a JavaScript library like Web3.js or Ethers.js. Key interactions include:

**NFT Interactions**

* Minting: The platform's administrator or authorized users can mint new LeaseNFTs and DeedNFTs by calling the mintToken function in the respective contracts. The function takes the recipient's Ethereum address and a unique token ID as arguments.
* Burning: LeaseNFTs can be burned (destroyed) when a lease agreement is terminated, or when a property is sold and a DeedNFT needs to be burned. This is achieved by calling the burn function in the respective contracts, providing the token ID to be burned as an argument.
* Token URI: The platform sets and updates token URIs for LeaseNFT and DeedNFT metadata by calling the \_setTokenURI function in the respective contracts. The function takes a token ID and the new URI as arguments.

**Lease Agreement Interactions**

* Creating Lease Agreements: Users can create a new lease agreement in the Lease Agreement Contract by calling the createLease function. The function takes several arguments, including the DeedNFT token ID, lessee and lessor Ethereum addresses, lease start and end dates, rent amount, payment frequency, and security deposit.
* Updating Lease Agreements: Users can update an existing lease agreement in the Lease Agreement Contract by calling the updateLease function. The function takes the same arguments as the createLease function, allowing users to update any aspect of the agreement.
* Terminating Lease Agreements: Users can terminate an active lease agreement in the Lease Agreement Contract by calling the terminateLease function. The function takes the LeaseNFT token ID as an argument and updates the lease agreement status to terminated. It also triggers the burning of the associated LeaseNFT.

**Retrieving Information**

The DApp's frontend UI retrieves information about LeaseNFTs, DeedNFTs, and lease agreements by calling various functions in the respective contracts. Some examples include:

* ownerOf: Retrieves the Ethereum address of the owner of a given token ID.
* getApproved: Retrieves the Ethereum address of the approved address for a given token ID.
* isApprovedForAll: Checks if an operator is approved to manage all tokens of an owner.
* tokenURI: Retrieves the token URI for a given token ID, which points to the off-chain metadata file.

Additionally, the Lease Agreement Contract provides several functions to retrieve specific information about lease agreements, such as:

* getLease: Retrieves the details of a lease agreement by providing the LeaseNFT token ID.
* getLeaseByDeed: Retrieves the details of a lease agreement by providing the DeedNFT token ID.
* getActiveLeases: Retrieves all active lease agreements for a specified user (lessee or lessor).

**Token Transfers**

Token transfers are essential for the platform's functionality and are handled by the ERC721 standard implemented in both LeaseNFT and DeedNFT contracts. Key transfer functions include:

* Transferring Ownership: Users can transfer the ownership of LeaseNFTs and DeedNFTs by calling the safeTransferFrom function in the respective contracts. The function takes the current owner's Ethereum address, the new owner's Ethereum address, and the token ID as arguments.
* Approving Transfers: Users can approve another Ethereum address to transfer a specific LeaseNFT or DeedNFT on their behalf by calling the approve function in the respective contracts. The function takes the approved Ethereum address and the token ID as arguments.
* Approving Operators: Users can approve another Ethereum address to transfer any LeaseNFTs or DeedNFTs on their behalf by calling the setApprovalForAll function in the respective contracts. The function takes the operator's Ethereum address and a boolean value as arguments (true for approval, false for revoking approval).

**Events**

Events are emitted by the smart contracts to log and notify important actions. These events can be monitored by the frontend UI to provide real-time updates and notifications to users. Key events include:

* Transfer: Emitted when a LeaseNFT or DeedNFT ownership is transferred. It logs the sender, receiver, and token ID.
* Approval: Emitted when an Ethereum address is approved to transfer a specific LeaseNFT or DeedNFT. It logs the owner, approved address, and token ID.
* ApprovalForAll: Emitted when an Ethereum address is approved as an operator to manage all LeaseNFTs or DeedNFTs of another Ethereum address. It logs the owner, operator, and a boolean value indicating the approval status.

Additionally, the Lease Agreement Contract emits custom events to log and notify important actions related to lease agreements:

* LeaseCreated: Emitted when a new lease agreement is created. It logs the LeaseNFT token ID, lessee, lessor, and other relevant lease agreement details.
* LeaseUpdated: Emitted when a lease agreement is updated. It logs the LeaseNFT token ID, lessee, lessor, and other relevant lease agreement details.
* LeaseTerminated: Emitted when a lease agreement is terminated. It logs the LeaseNFT token ID and the termination date.

These interactions and events provide a comprehensive overview of how the LeaseNFT, DeedNFT, and Lease Agreement Contract work together to facilitate the management of real assets and property on the platform. The frontend UI communicates with the smart contracts through JavaScript libraries, allowing users to interact seamlessly with the underlying blockchain.

\
