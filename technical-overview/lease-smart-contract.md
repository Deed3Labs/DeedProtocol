# Lease Smart Contract

### Overview

The Lease Agreement Contract is responsible for managing lease agreements between property owners and lessees. It ensures that lease agreements are created, terminated, and enforced according to the agreed-upon terms.

**Key features of the Lease Agreement Contract:**

* Stores references to DeedNFT and LeaseNFT contracts.
* Includes a mapping to store active lease agreements.
* Provides functions for creating, terminating, and updating lease agreements.
* Implements a function to verify the ownership of a DeedNFT before creating a lease agreement.

### Contract Data Structure

The Lease Agreement Contract manages lease agreements using a struct called Lease, which includes the following information:

* LeaseNFT token ID
* DeedNFT token ID
* Lessee and lessor Ethereum addresses
* Lease start and end dates
* Rent amount and payment frequency
* Security deposit amount
* Lease status (active or terminated)

### Core Contract Functions

The Lease Agreement Contract includes functions for creating, updating, and terminating lease agreements. The functions can only be called by the contract owner or authorized addresses.

**createLease:** Creates a new lease agreement and mints a corresponding LeaseNFT.

<pre><code><strong>function createLease(
</strong>    address _lessee,
    uint256 _startDate,
    uint256 _endDate,
    uint256 _rentAmount,
    uint256 _securityDeposit,
    uint256 _propertyTokenId // Add the _propertyTokenId parameter
) external {
    require(_lessee != address(0), "LeaseAgreement: Invalid lessee address");
    require(_startDate &#x3C; _endDate, "LeaseAgreement: Invalid start and end dates");
    require(verifyDeedOwnership(msg.sender, _propertyTokenId), "LeaseAgreement: Lessor must own the property NFT");
    uint256 leaseId = leaseCounter;
    leaseCounter++;

    Lease storage lease = leases[leaseId];
    lease.lessor = msg.sender;
    lease.lessee = _lessee;
    lease.startDate = _startDate;
    lease.endDate = _endDate;
    lease.rentAmount = _rentAmount;
    lease.securityDeposit = _securityDeposit;
    lease.rentDueDate = _startDate + 30 days;
    lease.unpaidMonths = 0;
    lease.extensionCount = 0;
    lease.propertyTokenId = _propertyTokenId; // Set the propertyTokenId in the Lease struct

    leaseNFT.mintToken(msg.sender, leaseId); // Add a custom error message for debugging
    require(true, "createLease: Lease created successfully");
}
</code></pre>

**updateLease:** Updates an existing lease agreement's information.

```
function updateLease(
    uint256 _leaseId,
    uint256 _newStartDate,
    uint256 _newEndDate,
    uint256 _newLeaseAmount
) public {
    LeaseAgreement storage lease = leaseAgreements[_leaseId];

    // Check that the caller is the lessor
    require(msg.sender == lease.lessor, "Only the lessor can update the lease");

    // Update the lease fields
    lease.startDate = _newStartDate;
    lease.endDate = _newEndDate;
    lease.leaseAmount = _newLeaseAmount;
}
```

**terminateLease:** Terminates a lease agreement and burns the corresponding LeaseNFT.

```
function terminateLease(uint256 leaseId) public {
        Lease storage lease = leases[leaseId];
        require(msg.sender == lease.lessor || msg.sender == lease.lessee, "Only lessor or lessee can terminate the lease");
        require(block.timestamp >= lease.startDate, "Lease has not started yet");

        if (lease.securityDeposit > 0) {
            xDai.transfer(lease.lessee, lease.securityDeposit);
        }

        uint256 remainingBalance = xDai.balanceOf(address(this));
        if (remainingBalance > 0) {
            xDai.transfer(lease.lessor, remainingBalance);
        }

        leaseNFT.burn(leaseId);
    }
```
