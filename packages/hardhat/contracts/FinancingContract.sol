// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IDeedNFT is IERC721 {
    // Add any DeedNFT-specific methods here if needed
}

contract OwnerFinancing is ERC721("FinancingNFT", "FINT"), Ownable, ReentrancyGuard, Pausable {
    using SafeMath for uint256;

    // Data structure for Financing
    struct Financing {
        address buyer;
        address seller;
        uint256 principal;
        uint256 downPayment;
        uint256 interestRate;
        uint256 termInMonths;
        uint256 remainingAmount;
        uint256 nextPaymentDue;
        uint256 missedPayments;
        bool defaulted;
    }

    IDeedNFT public deedNftContract;
    uint256 public financingNftCounter = 0;
    uint256 public maxMonthsPastDue = 3; // Default value for maximum months past due

    mapping(uint256 => Financing) public financings;
    mapping(uint256 => uint256) public financingNfts;

    event FinancingStarted(
        uint256 indexed deedNftTokenId,
        uint256 indexed financingNftTokenId,
        address indexed seller,
        uint256 principal,
        uint256 downPayment,
        uint256 interestRate,
        uint256 termInMonths
    );
    event FinancingAccepted(uint256 indexed deedNftTokenId, address indexed buyer);
    event MonthlyPaymentMade(uint256 indexed deedNftTokenId, address indexed buyer, uint256 payment, uint256 remainingAmount);
    event FinancingTerminated(uint256 indexed deedNftTokenId, address indexed buyer, uint256 remainingAmount, bool defaulted);
    event MaxMonthsPastDueChanged(uint256 newMaxMonthsPastDue);

    constructor(address _deedNftAddress) {
        deedNftContract = IDeedNFT(_deedNftAddress);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function setMaxMonthsPastDue(uint256 _maxMonthsPastDue) external onlyOwner {
        maxMonthsPastDue = _maxMonthsPastDue;
        emit MaxMonthsPastDueChanged(_maxMonthsPastDue);
    }

    function startFinancing(
        uint256 deedNftTokenId,
        uint256 principal,
        uint256 downPayment,
        uint256 interestRate,
        uint256 termInMonths
    )
        external
        nonReentrant
        whenNotPaused
    {
        require(deedNftContract.ownerOf(deedNftTokenId) == msg.sender, "Only the DeedNFT owner can initiate financing.");
        require(financings[deedNftTokenId].buyer == address(0), "Financing already exists for this DeedNFT.");
        require(principal > downPayment, "Principal should be greater than down payment.");

        deedNftContract.transferFrom(msg.sender, address(this), deedNftTokenId);

        uint256 financingNftTokenId = financingNftCounter++;
        _mint(msg.sender, financingNftTokenId);
        
        financings[deedNftTokenId] = Financing({
            buyer: address(0),
            seller: msg.sender,
            principal: principal,
            downPayment: downPayment,
            interestRate: interestRate,
            termInMonths: termInMonths,
            remainingAmount: principal,
            nextPaymentDue: 0,
            missedPayments: 0,
            defaulted: false
        });

        financingNfts[financingNftTokenId] = deedNftTokenId;

        emit FinancingStarted(deedNftTokenId, financingNftTokenId, msg.sender, principal, downPayment, interestRate, termInMonths);
    }

    function acceptFinancingTerms(uint256 deedNftTokenId) external payable nonReentrant whenNotPaused {
        Financing storage financing = financings[deedNftTokenId];
        
        require(financing.buyer == address(0), "Financing already accepted by another buyer.");
        require(msg.value == financing.downPayment, "Down payment amount does not match.");
        
        financing.buyer = msg.sender;
        financing.nextPaymentDue = block.timestamp + 30 days;
        
        payable(financing.seller).transfer(financing.downPayment);

        emit FinancingAccepted(deedNftTokenId, msg.sender);
    }

    function makeMonthlyPayment(uint256 deedNftTokenId) external payable nonReentrant whenNotPaused {
        Financing storage financing = financings[deedNftTokenId];

        require(financing.buyer == msg.sender, "Only the buyer can make payments.");
        require(!financing.defaulted, "Financing has defaulted.");

        if (block.timestamp > financing.nextPaymentDue) {
            financing.missedPayments += 1;

            if (financing.missedPayments >= maxMonthsPastDue) {
                terminateFinancing(deedNftTokenId, false);
                return;
            }
        }

        uint256 dueAmount = calculateDueAmount(financing);
        require(msg.value >= dueAmount, "Payment amount does not match the due amount.");

        financing.remainingAmount = financing.remainingAmount.sub(dueAmount);
        financing.nextPaymentDue = financing.nextPaymentDue + 30 days;
        financing.missedPayments = 0;

        if (financing.remainingAmount == 0) {
            terminateFinancing(deedNftTokenId, true);
            return;
        }

        payable(financing.seller).transfer(dueAmount);

        emit MonthlyPaymentMade(deedNftTokenId, msg.sender, dueAmount, financing.remainingAmount);
    }

    function terminateFinancing(uint256 deedNftTokenId, bool completed) internal {
        Financing storage financing = financings[deedNftTokenId];
        require(financing.buyer != address(0), "Financing not initialized.");

        uint256 financingNftTokenId = financingNfts[deedNftTokenId];

        if (completed) {
            deedNftContract.transferFrom(address(this), financing.buyer, deedNftTokenId);
        } else {
            deedNftContract.transferFrom(address(this), financing.seller, deedNftTokenId);
            financing.defaulted = true;
        }

        _burn(financingNftTokenId);
        delete financings[deedNftTokenId];
        delete financingNfts[financingNftTokenId];

        emit FinancingTerminated(deedNftTokenId, financing.buyer, financing.remainingAmount, financing.defaulted);
    }

    function calculateDueAmount(Financing storage financing) internal view returns (uint256) {
        uint256 interest = (financing.remainingAmount * financing.interestRate) / 10000;  // Assuming interest rate is in basis points
        uint256 principalPayment = financing.principal / financing.termInMonths;
        return interest.add(principalPayment);
    }

    // Helper functions
    function getFinancingDetails(uint256 deedNftTokenId) external view returns(
        address seller,
        address buyer,
        uint256 downPayment,
        uint256 principal,
        uint256 interestRate,
        uint256 termInMonths,
        uint256 remainingAmount,
        uint256 nextPaymentDue,
        uint256 missedPayments,
        bool defaulted
    ) {
        Financing memory financing = financings[deedNftTokenId];
        return (
            financing.seller,
            financing.buyer,
            financing.downPayment,
            financing.principal,
            financing.interestRate,
            financing.termInMonths,
            financing.remainingAmount,
            financing.nextPaymentDue,
            financing.missedPayments,
            financing.defaulted
        );
    }

    function setMaxMonthsPastDue(uint256 _maxMonthsPastDue) external onlyOwner {
        maxMonthsPastDue = _maxMonthsPastDue;
    }

    // Optional: To set or change DeedNFT contract address. Only by the owner
    function setDeedNftContract(address _deedNftAddress) external onlyOwner {
        deedNftContract = IDeedNFT(_deedNftAddress);
    }
}
