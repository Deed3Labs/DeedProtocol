// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./DeedNFT.sol"; // Import the IDeedNFT interface
import "./SubdivisionNFT.sol"; // Import the ISubdivisionNFT interface
import "./FundsStorage.sol";

interface ILeaseNFT {
    function mintToken(address to, uint256 tokenId) external;

    function burn(uint256 tokenId) external;
}

contract LeaseAgreement is ReentrancyGuard {
    // CONSTANTS
    uint256 private constant MONTH = 30.5 days;

    struct LeaseDates {
        uint256 startDate;
        uint256 endDate;
        uint256 rentDueDate;
        uint256 distributableDate;
    }

    struct Lease {
        address lessor;
        address lessee;
        uint256 rentAmount;
        uint256 securityDeposit;
        uint256 latePaymentFee;
        uint32 gracePeriod;
        LeaseDates dates;
        uint256 extensionCount;
        uint256 propertyTokenId;
        address agent;
        uint8 agentPercentage;
        bool depositPaid;
        uint256 unclaimedRentAmount;
    }

    struct RentPaymentInfo {
        uint256 rentAmount;
        uint256 totalBalance;
        uint32 unpaidMonths;
        uint256 rentDueDate;
    }

    mapping(uint256 => Lease) public leases;
    uint256 public leaseCounter;
    ILeaseNFT public leaseNFT;
    IERC20 public paymentToken;
    DeedNFT public deedNFT;
    SubdivisionNFT public subdivisionNFT;
    FundStorage public fundsStorage;

    event LeaseCreated(uint256 leaseId);
    event LeaseTerminated(uint256 leaseId);
    event PaymentMade(uint256 leaseId, uint256 amount);
    event RentDistributed(uint256 leaseId, uint256 lessorAmount, uint256 agentAmount, uint256 timestamp);
    event AgentSet(uint256 leaseId, address agent, uint256 percentage);
    event AgentRemoved(uint256 leaseId);
    event DueDateChanged(uint256 leaseId, uint256 newDueDate);

    constructor(address _leaseNFT, address _paymentToken, address _deedNFT, address _subdivisionNFT) {
        require(_leaseNFT != address(0), "Invalid LeaseNFT address");
        require(_paymentToken != address(0), "Invalid xDai token address");
        require(_deedNFT != address(0), "Invalid DeedNFT address");
        require(_subdivisionNFT != address(0), "Invalid SubdivisionNFT address");

        leaseNFT = ILeaseNFT(_leaseNFT);
        paymentToken = IERC20(_paymentToken);
        deedNFT = DeedNFT(_deedNFT);
        subdivisionNFT = SubdivisionNFT(_subdivisionNFT);
        leaseCounter = 0;
    }

    function setFundsStorage(address _fundsStorage) public {
        fundsStorage = FundStorage(_fundsStorage);
    }

    function createLease(
        address _lessee,
        uint256 _startDate,
        uint256 _endDate,
        uint256 _rentAmount,
        uint256 _securityDeposit,
        uint256 _propertyTokenId,
        uint256 _latePaymentFee,
        uint32 _gracePeriod
    ) external {
        require(_lessee != address(0), "LeaseAgreement: Invalid lessee address");
        require(_startDate < _endDate, "LeaseAgreement: Invalid start and end dates");
        require(_endDate - _startDate > 1 * MONTH, "LeaseAgreement: End date and start date should be 30 days appart");
        require(_gracePeriod>= 3);
        require(_latePaymentFee>=0 && _latePaymentFee<=15);
        bool isDeedOwner = _verifyDeedOwnership(msg.sender, _propertyTokenId);
        bool isSubdivisionOwner = _verifySubdivisionOwnership(msg.sender,  _propertyTokenId);
        require(isDeedOwner || isSubdivisionOwner, "LeaseAgreement: Lessor must own the property NFT");
        uint256 leaseId = leaseCounter;
        leaseCounter++;
        Lease storage lease = leases[leaseId];
        lease.lessor = msg.sender;
        lease.lessee = _lessee;
        lease.dates.startDate = _startDate;
        lease.dates.endDate = _endDate;
        lease.rentAmount = _rentAmount;
        lease.securityDeposit = _securityDeposit;
        lease.dates.rentDueDate = _startDate + 1 * MONTH;
        lease.extensionCount = 0;
        lease.propertyTokenId = _propertyTokenId;
        lease.depositPaid = _securityDeposit == 0;
        lease.latePaymentFee = _latePaymentFee;
        lease.gracePeriod = _gracePeriod;
        leaseNFT.mintToken(msg.sender, leaseId);
        lease.dates.distributableDate = lease.dates.rentDueDate;
        emit LeaseCreated(leaseId);
    }

    function setAgent(uint256 leaseId, address _agent, uint8 _percentage) external {
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

    function submitDeposit(uint256 leaseId) external nonReentrant {
        Lease storage lease = leases[leaseId];
        require(msg.sender == lease.lessee, "Only the lessee can submit the deposit");
        require(!lease.depositPaid, "Security deposit already paid");

        fundsStorage.store(leaseId, paymentToken, lease.securityDeposit, msg.sender);
        lease.depositPaid = true;
    }

    function setDueDate(uint256 _leaseId, uint256 _newDueDate) public {
        Lease storage lease = leases[_leaseId];
        require(msg.sender == lease.lessor, "Only lessor can set due date");
        require(
            _newDueDate >= (lease.dates.rentDueDate + 1 * MONTH),
            "New rent due date must be at least a month after current one"
        );
        lease.dates.rentDueDate = _newDueDate;
        emit DueDateChanged(_leaseId, _newDueDate);
    }

    function payRent(uint256 _leaseId) external nonReentrant {
        Lease storage lease = leases[_leaseId];
        require(msg.sender == lease.lessee, "Only the lessee can pay rent");
        require(lease.depositPaid, "Security deposit must be paid first");

        RentPaymentInfo memory rentInfo = calculateRentPaymentInfo(_leaseId);
        lease.unclaimedRentAmount += rentInfo.totalBalance;
        lease.dates.rentDueDate += (rentInfo.unpaidMonths) * (1 * MONTH);
        fundsStorage.store(_leaseId, paymentToken, rentInfo.totalBalance, msg.sender);
        emit DueDateChanged(_leaseId, lease.dates.rentDueDate);
        emit PaymentMade(_leaseId, rentInfo.totalBalance);
    }

    function distributeRent(uint256 leaseId) public nonReentrant {
        Lease storage lease = leases[leaseId];
        require(msg.sender == lease.lessor || msg.sender == lease.agent, "Error: sender must be lessor or agent");
        require(lease.unclaimedRentAmount > 0, "No rent to distribute");
        uint256 nbMonthSinceLastDistribute = (block.timestamp - lease.dates.distributableDate) / (1 * MONTH);
        require(nbMonthSinceLastDistribute > 0, "Rent can only be distributed past the rent due date");
        uint256 totalToClaim = lease.unclaimedRentAmount;
        uint256 agentAmount = 0;

        if (lease.agent != address(0)) {
            agentAmount = (totalToClaim * lease.agentPercentage) / 100;
            fundsStorage.widthdraw(leaseId, paymentToken, uint32(agentAmount), lease.agent);
        }

        uint256 lessorAmount = totalToClaim - agentAmount;
        fundsStorage.widthdraw(leaseId, paymentToken, uint32(lessorAmount), lease.lessor);
        lease.unclaimedRentAmount = 0;
        lease.dates.distributableDate += nbMonthSinceLastDistribute * (1 * MONTH);

        emit RentDistributed(leaseId, uint32(lessorAmount), uint32(agentAmount), block.timestamp);
    }

    function extendLease(uint256 leaseId, uint256 extensionPeriod) external {
        Lease storage lease = leases[leaseId];
        require(msg.sender == lease.lessee, "Only the lessee can extend the lease");
        require(
            block.timestamp >= lease.dates.endDate - 45 days, // TODO: Configurable
            "Extension can only be requested in the last 45 days"
        );
        require(lease.extensionCount < 2, "Maximum extensions reached");

        lease.dates.endDate += extensionPeriod;
        lease.rentAmount += (lease.rentAmount * 3) / 100;
        lease.extensionCount++;
    }

    function terminateLease(uint256 leaseId) public nonReentrant {
        Lease storage lease = leases[leaseId];
        require(msg.sender == lease.lessor, "Only lessor can terminate the lease");
        require(block.timestamp >= lease.dates.startDate, "Lease has not started yet");
        RentPaymentInfo memory rentInfo = calculateRentPaymentInfo(leaseId);
        bool shouldSendDepositToLessor = (rentInfo.unpaidMonths >= 3); // TODO: Configurable

        address recipient = shouldSendDepositToLessor ? lease.lessor : lease.lessee;
        fundsStorage.widthdraw(leaseId, paymentToken, lease.securityDeposit, recipient);

        uint256 remainingBalance = fundsStorage.accountBalance(leaseId, paymentToken);
        if (remainingBalance > 0) {
            fundsStorage.widthdraw(leaseId, paymentToken, remainingBalance, lease.lessor);
        }

        leaseNFT.burn(leaseId);
        emit LeaseTerminated(leaseId);
        delete leases[leaseId];
    }

    function calculateRentPaymentInfo(uint256 leaseId) public view returns (RentPaymentInfo memory rentInfo) {
        Lease storage lease = leases[leaseId];
        rentInfo.rentAmount = lease.rentAmount;
        //sidenote: rent due date is incremented by 1 month each time the rent is paid.(function payRent)
        if (block.timestamp > lease.dates.rentDueDate + (lease.gracePeriod * 1 days)) {
            //Function to calculate rentAmountIncrease increase
            rentInfo.rentAmount += (lease.rentAmount * lease.latePaymentFee) / 100;
            rentInfo.unpaidMonths = uint32((block.timestamp - lease.dates.rentDueDate) / (1 * MONTH) + 1);
            rentInfo.totalBalance = (rentInfo.unpaidMonths) * rentInfo.rentAmount;
        } else {
            rentInfo.unpaidMonths = 1;
            rentInfo.totalBalance = rentInfo.rentAmount;
        }
        return rentInfo;
    }

    function verifyDeedOwnership(address _owner, uint256 _propertyTokenId) internal view returns (bool) {
        try deedNFT.ownerOf(_propertyTokenId) returns (address owner) {
            return owner == _owner;
        } catch {
            return false;
        }
    }

    function verifySubdivisionOwnership(address _owner, uint256 _propertyTokenId) internal view returns (bool) {
        return subdivisionNFT.isOwnerOfSubdivision(_owner,_propertyTokenId);
    }
}
