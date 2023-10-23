// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./DeedNFT.sol"; // Import the IDeedNFT interface
import "./SubdivisionNFT.sol"; // Import the ISubdivisionNFT interface
import "./FundsManager.sol";

interface ILeaseNFT {
    function mint(address leaseOwner, uint256 leaseId) external;

    function burn(uint256 leaseId) external;
}

contract LeaseAgreement is Context, ReentrancyGuard {
    // CONSTANTS
    uint256 private constant MONTH = 30.5 days;

    struct LeaseDates {
        uint256 startDate;
        uint256 endDate;
        uint256 rentDueDate;
        uint256 distributableDate;
    }

    struct Deposit {
        uint256 amount;
        bool paid;
    }

    struct Lease {
        address lessor;
        address lessee;
        uint256 rentAmount;
        Deposit securityDeposit;
        uint256 latePaymentFee;
        uint32 gracePeriod;
        LeaseDates dates;
        uint256 extensionCount;
        uint256 deedId;
        address agent;
        uint8 agentPercentage;
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
    FundsManager public fundsManager;

    event LeaseFundsManagerSet(address fundsManager);
    event LeasePaymentTokenSet(address paymentToken);
    event LeaseCreated(uint256 leaseId, Lease lease);
    event LeaseTerminated(uint256 leaseId);
    event LeasePaymentMade(uint256 leaseId, uint256 amount, uint256 unclaimedRentAmount);
    event LeaseRentDistributed(uint256 leaseId, uint256 lessorAmount, uint256 agentAmount, uint256 distributableDate);
    event LeaseAgentAdded(uint256 leaseId, address agent, uint256 percentage);
    event LeaseAgentRemoved(uint256 leaseId);
    event LeaseDueDateChanged(uint256 leaseId, uint256 newDueDate);
    event LeaseDepositSubmited(uint256 leaseId, uint256 amount);
    event LeaseExtended(uint256 leaseId, uint256 endDate, uint256 rentAmount, uint256 extensionCount);

    constructor(
        address _leaseNFT,
        address _paymentToken,
        address _deedNFT,
        address _subdivisionNFT,
        address _fundsManager
    ) {
        require(_leaseNFT != address(0), "[Lease Agreement] Invalid LeaseNFT address");
        require(_paymentToken != address(0), "[Lease Agreement] Invalid token address");
        require(_deedNFT != address(0), "[Lease Agreement] Invalid DeedNFT address");
        require(_subdivisionNFT != address(0), "[Lease Agreement] Invalid SubdivisionNFT address");

        leaseNFT = ILeaseNFT(_leaseNFT);
        deedNFT = DeedNFT(_deedNFT);
        subdivisionNFT = SubdivisionNFT(_subdivisionNFT);

        setPaymentToken(_paymentToken);
        setFundsManager(_fundsManager);

        leaseCounter = 0;
    }

    function setFundsManager(address _fundsManager) public {
        fundsManager = FundsManager(_fundsManager);
        emit LeaseFundsManagerSet(_fundsManager);
    }

    function setPaymentToken(address _paymentToken) public {
        paymentToken = IERC20(_paymentToken);
        emit LeasePaymentTokenSet(_paymentToken);
    }

    function addAgent(uint256 _leaseId, address _agent, uint8 _percentage) external {
        Lease storage lease = leases[_leaseId];
        require(_msgSender() == lease.lessor, "[Lease Agreement] Only the Lessor can set the Agent");
        require(_percentage >= 0 && _percentage <= 100, "[Lease Agreement] Invalid agent percentage");

        lease.agent = _agent;
        lease.agentPercentage = _percentage;

        emit LeaseAgentAdded(_leaseId, _agent, _percentage);
    }

    function removeAgent(uint256 _leaseId) external {
        Lease storage lease = leases[_leaseId];
        require(
            _msgSender() == lease.lessor || _msgSender() == lease.agent,
            "[Lease Agreement] only the Lessor or the Agent can remove the Agent"
        );

        lease.agent = address(0);
        lease.agentPercentage = 0;

        emit LeaseAgentRemoved(_leaseId);
    }

    function createLease(
        address _lessee,
        uint256 _startDate,
        uint256 _endDate,
        uint256 _rentAmount,
        uint256 _securityDepositAmount,
        uint256 _deedId,
        uint256 _latePaymentFee,
        uint32 _gracePeriod
    ) external {
        require(_lessee != address(0), "[Lease Agreement] Invalid lessee address");
        require(_startDate < _endDate, "[Lease Agreement] Invalid start and end dates");
        require(
            _endDate - _startDate > 1 * MONTH,
            "[Lease Agreement] End date and start date should be 1 month appart"
        );
        require(_gracePeriod >= 3);
        require(_latePaymentFee >= 0 && _latePaymentFee <= 15);
        bool isDeedOwner = _verifyDeedOwnership(_msgSender(), _deedId);
        bool isSubdivisionOwner = _verifySubdivisionOwnership(_msgSender(), _deedId);
        require(isDeedOwner || isSubdivisionOwner, "[Lease Agreement] Lessor must own the property NFT");

        uint256 leaseId = leaseCounter;
        leaseCounter++;
        Lease storage lease = leases[leaseId];
        lease.lessor = _msgSender();
        lease.lessee = _lessee;
        lease.dates.startDate = _startDate;
        lease.dates.endDate = _endDate;
        lease.rentAmount = _rentAmount;
        lease.securityDeposit.amount = _securityDepositAmount;
        lease.dates.rentDueDate = _startDate + 1 * MONTH;
        lease.extensionCount = 0;
        lease.deedId = _deedId;
        lease.securityDeposit.paid = _securityDepositAmount == 0;
        lease.latePaymentFee = _latePaymentFee;
        lease.gracePeriod = _gracePeriod;
        leaseNFT.mint(_msgSender(), leaseId);
        lease.dates.distributableDate = lease.dates.rentDueDate;

        emit LeaseCreated(leaseId, lease);
    }

    function submitDeposit(uint256 _leaseId) external nonReentrant {
        Lease storage lease = leases[_leaseId];
        require(_msgSender() == lease.lessee, "[Lease Agreement] Only the Lessee can submit the deposit");
        require(!lease.securityDeposit.paid, "[Lease Agreement] Security deposit already paid");

        fundsManager.store(_leaseId, paymentToken, lease.securityDeposit.amount, _msgSender());
        lease.securityDeposit.paid = true;

        emit LeaseDepositSubmited(_leaseId, lease.securityDeposit.amount);
    }

    function setDueDate(uint256 _leaseId, uint256 _newDueDate) public {
        Lease storage lease = leases[_leaseId];
        require(_msgSender() == lease.lessor, "[Lease Agreement] Only the Lessor can set due date");
        require(
            _newDueDate >= (lease.dates.rentDueDate + 1 * MONTH),
            "[Lease Agreement] New rent due date must be at least a month after current one"
        );

        lease.dates.rentDueDate = _newDueDate;

        emit LeaseDueDateChanged(_leaseId, _newDueDate);
    }

    function payRent(uint256 _leaseId) external nonReentrant {
        Lease storage lease = leases[_leaseId];
        require(_msgSender() == lease.lessee, "[Lease Agreement] Only the Lessee can pay rent");
        require(lease.securityDeposit.paid, "[Lease Agreement] Security deposit must be paid first");
        require(
            block.timestamp >= lease.dates.startDate && block.timestamp <= lease.dates.endDate,
            "[Lease Agreement] Outside of lease duration"
        );

        RentPaymentInfo memory rentInfo = calculateRentPaymentInfo(_leaseId);
        lease.unclaimedRentAmount += rentInfo.totalBalance;
        lease.dates.rentDueDate += (rentInfo.unpaidMonths) * (1 * MONTH);
        fundsManager.store(_leaseId, paymentToken, rentInfo.totalBalance, _msgSender());

        emit LeaseDueDateChanged(_leaseId, lease.dates.rentDueDate);
        emit LeasePaymentMade(_leaseId, rentInfo.totalBalance, lease.unclaimedRentAmount);
    }

    function distributeRent(uint256 _leaseId) public nonReentrant {
        Lease storage lease = leases[_leaseId];
        require(
            _msgSender() == lease.lessor || _msgSender() == lease.agent,
            "[Lease Agreement] Caller must be the Lessor or the Agent"
        );
        require(lease.unclaimedRentAmount > 0, "[Lease Agreement] No rent to distribute");
        uint256 nbMonthSinceLastDistribute = 0;
        require(
            block.timestamp > lease.dates.distributableDate,
            "[Lease Agreement] Rent can only be distributed past the distributable date"
        );

        nbMonthSinceLastDistribute = (block.timestamp - lease.dates.distributableDate) / (1 * MONTH) + 1;
        uint256 totalToClaim = lease.unclaimedRentAmount;
        uint256 agentAmount = 0;

        if (lease.agent != address(0)) {
            agentAmount = (totalToClaim * lease.agentPercentage) / 100;
            fundsManager.widthdraw(_leaseId, paymentToken, uint32(agentAmount), lease.agent);
        }

        uint256 lessorAmount = totalToClaim - agentAmount;
        fundsManager.widthdraw(_leaseId, paymentToken, uint32(lessorAmount), lease.lessor);
        lease.unclaimedRentAmount = 0;
        lease.dates.distributableDate += nbMonthSinceLastDistribute * (1 * MONTH);

        emit LeaseRentDistributed(_leaseId, uint32(lessorAmount), uint32(agentAmount), lease.dates.distributableDate);
    }

    function extendLease(uint256 _leaseId, uint256 _extensionPeriod) external {
        Lease storage lease = leases[_leaseId];
        require(_msgSender() == lease.lessee, "[Lease Agreement] Only the Lessee can extend the lease");
        require(
            block.timestamp >= lease.dates.endDate - 45 days, // TODO: Configurable
            "[Lease Agreement] Extension can only be requested in the last 45 days"
        );
        require(lease.extensionCount < 2, "[Lease Agreement] Maximum extensions reached");

        lease.dates.endDate += _extensionPeriod;
        lease.rentAmount += (lease.rentAmount * 3) / 100;
        lease.extensionCount++;

        emit LeaseExtended(_leaseId, lease.dates.endDate, lease.rentAmount, lease.extensionCount);
    }

    function terminateLease(uint256 _leaseId) public nonReentrant {
        Lease storage lease = leases[_leaseId];
        require(_msgSender() == lease.lessor, "[Lease Agreement] Only the Lessor can terminate the lease");
        require(block.timestamp >= lease.dates.startDate, "[Lease Agreement] Lease has not started yet");
        RentPaymentInfo memory rentInfo = calculateRentPaymentInfo(_leaseId);
        bool shouldSendDepositToLessor = (rentInfo.unpaidMonths >= 3); // TODO: Configurable

        // Send security deposit to the lessor or the lessee
        address recipient = shouldSendDepositToLessor ? lease.lessor : lease.lessee;
        fundsManager.widthdraw(_leaseId, paymentToken, lease.securityDeposit.amount, recipient);

        // Send remaining rent to the lessor
        uint256 remainingBalance = fundsManager.balanceOf(_leaseId, paymentToken);
        if (remainingBalance > 0) {
            fundsManager.widthdraw(_leaseId, paymentToken, remainingBalance, lease.lessor);
        }

        leaseNFT.burn(_leaseId);
        delete leases[_leaseId];

        emit LeaseTerminated(_leaseId);
    }

    function calculateRentPaymentInfo(uint256 _leaseId) public view returns (RentPaymentInfo memory rentInfo) {
        Lease storage lease = leases[_leaseId];
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

    function _verifySubdivisionOwnership(address _owner, uint256 _subdivisionId) internal view returns (bool) {
        return subdivisionNFT.isOwnerOfSubdivision(_owner, _subdivisionId);
    }

    function _verifyDeedOwnership(address _owner, uint256 _deedId) internal view returns (bool) {
        try deedNFT.ownerOf(_deedId) returns (address owner) {
            return owner == _owner;
        } catch {
            return false;
        }
    }
}
