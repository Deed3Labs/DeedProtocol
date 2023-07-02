// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./DeedNFT.sol"; // Import the IDeedNFT interface
import "./SubdivisionNFT.sol"; // Import the ISubdivisionNFT interface

interface ILeaseNFT {
    function mintToken(address to, uint256 tokenId) external;
    function burn(uint256 tokenId) external;
}

contract LeaseAgreement {
    struct Lease {
        address lessor;
        address lessee;
        uint256 startDate;
        uint256 endDate;
        uint256 rentAmount;
        uint256 securityDeposit;
        uint256 rentDueDate;
        uint256 unpaidMonths;
        uint256 extensionCount;
        uint256 propertyTokenId;
        address agent;
        uint256 agentPercentage;
        bool depositPaid;
    }

    struct RentPaymentInfo {
        uint256 amount;
        uint256 unpaidMonths;
        uint256 rentDueDate;
    }

    mapping(uint256 => Lease) public leases;
    uint256 public leaseCounter;
    ILeaseNFT public leaseNFT;
    IERC20 public xDai;
    DeedNFT public deedNFT;
    SubdivisionNFT public subdivisionNFT;

    event LeaseCreated(uint256 leaseId);
    event AgentSet(uint256 leaseId, address agent, uint256 percentage);
    event AgentRemoved(uint256 leaseId);

    constructor(address _leaseNFT, address _xDaiToken, address _deedNFT, address _subdivisionNFT) {
        require(_leaseNFT != address(0), "Invalid LeaseNFT address");
        require(_xDaiToken != address(0), "Invalid xDai token address");
        require(_deedNFT != address(0), "Invalid DeedNFT address");
        require(_subdivisionNFT != address(0), "Invalid SubdivisionNFT address");

        leaseNFT = ILeaseNFT(_leaseNFT);
        xDai = IERC20(_xDaiToken);
        deedNFT = DeedNFT(_deedNFT);
        subdivisionNFT = SubdivisionNFT(_subdivisionNFT);
        leaseCounter = 0;
    }

    function createLease(
        address _lessee,
        uint256 _startDate,
        uint256 _endDate,
        uint256 _rentAmount,
        uint256 _securityDeposit,
        uint256 _propertyTokenId
    ) external {
        require(_lessee != address(0), "LeaseAgreement: Invalid lessee address");
        require(_startDate < _endDate, "LeaseAgreement: Invalid start and end dates");
        bool isDeedOwner = verifyDeedOwnership(msg.sender, _propertyTokenId);
        bool isSubdivisionOwner = verifySubdivisionOwnership(msg.sender, _propertyTokenId);
        require(isDeedOwner || isSubdivisionOwner, "LeaseAgreement: Lessor must own the property NFT");
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
        lease.propertyTokenId = _propertyTokenId;
        lease.depositPaid = false;

        leaseNFT.mintToken(msg.sender, leaseId);
        emit LeaseCreated(leaseId);
    }

      function setAgent(uint256 leaseId, address _agent, uint256 _percentage) external {
        Lease storage lease = leases[leaseId];
        require(msg.sender == lease.lessor, "Only lessor can set the agent");
        require(_percentage >= 0 && _percentage <= 100, "Invalid agent percentage");

        lease.agent = _agent;
        lease.agentPercentage = _percentage;
        emit AgentSet(leaseId, _agent, _percentage);
    }

    function removeAgent(uint256 leaseId) external {
        Lease storage lease = leases[leaseId];
        require(msg.sender == lease.lessor || msg.sender == lease.agent, "Only lessor or agent can remove the agent");

        lease.agent = address(0);
        lease.agentPercentage = 0;
        emit AgentRemoved(leaseId);
    }

    function submitDeposit(uint256 leaseId) external {
        Lease storage lease = leases[leaseId];
        require(msg.sender == lease.lessee, "Only the lessee can submit the deposit");
        require(!lease.depositPaid, "Security deposit already paid");

        xDai.transferFrom(msg.sender, address(this), lease.securityDeposit);
        lease.depositPaid = true;
    }

    function payRent(uint256 leaseId, uint256 _amount) external {
        Lease storage lease = leases[leaseId];
        require(msg.sender == lease.lessee, "Only the lessee can pay rent");
        require(lease.depositPaid, "Security deposit must be paid first");
        require(block.timestamp >= lease.startDate && block.timestamp <= lease.endDate, "Outside of lease duration");

        RentPaymentInfo memory rentInfo = _calculateRentPaymentInfo(leaseId);

        xDai.transferFrom(msg.sender, address(this), _amount);
        require(_amount >= rentInfo.amount, "Insufficient amount for rent payment");

        if (rentInfo.unpaidMonths >= 3) {
            if (block.timestamp <= rentInfo.rentDueDate + (3 * 30 days) + 15 days) {
                distributeRent(leaseId, rentInfo.amount);
                lease.unpaidMonths = 0;
            } else {
                terminateLease(leaseId);
            }
        } else {
            distributeRent(leaseId, rentInfo.amount);
            lease.rentDueDate += 30 days;
        }
    }

    function _calculateRentPaymentInfo(uint256 leaseId) internal view returns (RentPaymentInfo memory rentInfo) {
        Lease storage lease = leases[leaseId];
        rentInfo.amount = lease.rentAmount;
        if (block.timestamp > lease.rentDueDate + 15 days) {
            rentInfo.amount += (lease.rentAmount * 10) / 100;
            rentInfo.unpaidMonths = lease.unpaidMonths + 1;
        } else {
            rentInfo.unpaidMonths = lease.unpaidMonths;
        }
        rentInfo.rentDueDate = lease.rentDueDate;
        return rentInfo;
    }

    function distributeRent(uint256 leaseId, uint256 _amount) internal {
        Lease storage lease = leases[leaseId];
        uint256 agentAmount = 0;

        if (lease.agent != address(0)) {
            agentAmount = (_amount * lease.agentPercentage) / 100;
            xDai.transfer(lease.agent, agentAmount);
        }

        uint256 lessorAmount = _amount - agentAmount;
        xDai.transfer(lease.lessor, lessorAmount);
    }

    function terminateLease(uint256 leaseId) public {
        Lease storage lease = leases[leaseId];
        require(msg.sender == lease.lessor || msg.sender == lease.lessee, "Only lessor or lessee can terminate the lease");
        require(block.timestamp >= lease.startDate, "Lease has not started yet");

        // Check if lease termination is due to unpaid rent or early termination
        bool shouldSendDepositToLessor = (lease.unpaidMonths >= 3) || (msg.sender == lease.lessor && block.timestamp < lease.endDate);

        if (shouldSendDepositToLessor) {
            xDai.transfer(lease.lessor, lease.securityDeposit);
        } else {
            xDai.transfer(lease.lessee, lease.securityDeposit);
        }

        uint256 remainingBalance = xDai.balanceOf(address(this));
        if (remainingBalance > 0) {
            xDai.transfer(lease.lessor, remainingBalance);
        }

        leaseNFT.burn(leaseId);
    }

    function extendLease(uint256 leaseId, uint256 extensionPeriod) external {
        Lease storage lease = leases[leaseId];
        require(msg.sender == lease.lessee, "Only the lessee can extend the lease");
        require(block.timestamp >= lease.endDate - 45 days, "Extension can only be requested in the last 45 days");
        require(lease.extensionCount < 2, "Maximum extensions reached");

        lease.endDate += extensionPeriod;
        lease.rentAmount += (lease.rentAmount * 3) / 100;
        lease.extensionCount++;
    }

    function verifyDeedOwnership(address _owner, uint256 _propertyTokenId) internal view returns (bool) {
        try deedNFT.ownerOf(_propertyTokenId) returns (address owner) {
            return owner == _owner;
        } catch {
            return false;
        }
    }

    function verifySubdivisionOwnership(address _owner, uint256 _propertyTokenId) internal view returns (bool) {
        try subdivisionNFT.ownerOfSubdivision(_propertyTokenId) returns (address owner) {
            return owner == _owner;
        } catch {
            return false;
        }
    }
}