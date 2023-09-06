// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SellerNFT.sol";
import "./BuyerNFT.sol";
import "./DeedNFT.sol";

contract OwnerFinancing {

    enum InterestType { Fixed, Adjustable }

    struct FinancingDetails {
        address seller;
        address buyer;
        uint256 price;
        uint256 termLength; // in months
        uint256 interestRate; // in basis points
        uint256 downPayment;
        bool isBuyerApproved;
        bool isTermsAccepted;
        bool isActive;
        uint256 totalPaymentsMade;
        uint256 nextAdjustableRateIncrease; // in months
        InterestType interestType;
    }

    SellerNFT private sellerNFTContract;
    BuyerNFT private buyerNFTContract;
    DeedNFT private deedNFTContract;

    mapping(uint256 => FinancingDetails) public financingDetails;
    uint256 public nextFinancingId;

    uint256 constant MAX_INTEREST_RATE = 3000; // 30% in basis points
    uint256 constant MAX_ADJUSTABLE_RATE_INCREASE = 1500; // 50% increase in basis points

    event FinancingCreated(uint256 financingId);
    event PaymentMade(uint256 financingId, address from, uint256 amount);
    event FinancingCompleted(uint256 financingId);

    constructor(address _sellerNFTAddress, address _buyerNFTAddress, address _deedNFTAddress) {
        sellerNFTContract = SellerNFT(_sellerNFTAddress);
        buyerNFTContract = BuyerNFT(_buyerNFTAddress);
        deedNFTContract = DeedNFT(_deedNFTAddress);
    }

    function createFinancing(address buyer, uint256 price, uint256 termLength, uint256 interestRate, uint256 downPayment, InterestType interestType, uint256 nextAdjustableRateIncrease) public returns (uint256) {
        require(interestRate <= MAX_INTEREST_RATE, "Interest rate exceeds the limit.");

        FinancingDetails storage fd = financingDetails[nextFinancingId];
        fd.seller = msg.sender;
        fd.buyer = buyer;
        fd.price = price;
        fd.termLength = termLength;
        fd.interestRate = interestRate;
        fd.downPayment = downPayment;
        fd.isBuyerApproved = false;
        fd.isTermsAccepted = false;
        fd.isActive = false;
        fd.totalPaymentsMade = 0;
        fd.interestType = interestType;
        fd.nextAdjustableRateIncrease = nextAdjustableRateIncrease;

        emit FinancingCreated(nextFinancingId);
        nextFinancingId++;
        
        return nextFinancingId - 1;
    }

    function acceptTerms(uint256 financingId, uint256 _downPayment) public {
        FinancingDetails storage fd = financingDetails[financingId];
        
        require(msg.sender == fd.buyer, "Only the buyer can accept terms.");
        require(!fd.isTermsAccepted, "Terms are already accepted.");
        require(_downPayment >= fd.downPayment, "Down payment is less than the required amount.");
        
        fd.isTermsAccepted = true;
        fd.downPayment = _downPayment; // Update downpayment if it's greater

        // Initialize Financing
        fd.isActive = true;
        fd.totalPaymentsMade = _downPayment;

        // Mint NFTs
        sellerNFTContract.mintSellerNFT(fd.seller, financingId);
        buyerNFTContract.mintBuyerNFT(fd.buyer, financingId);
        
        // Transfer down payment to seller
        payable(fd.seller).transfer(_downPayment);
    }

    function makePayment(uint256 financingId) public payable {
        FinancingDetails storage fd = financingDetails[financingId];

        require(fd.isActive, "Financing is not active.");
        require(msg.sender == fd.buyer, "Only the buyer can make payments.");

        uint256 monthlyPayment = calculateMonthlyPayment(fd.price, fd.termLength, fd.interestRate, fd.downPayment);

        require(msg.value >= monthlyPayment, "Insufficient payment.");

        // Transfer to the seller
        payable(fd.seller).transfer(monthlyPayment);

        // Update the state
        fd.totalPaymentsMade += monthlyPayment;
        
        emit PaymentMade(financingId, msg.sender, monthlyPayment);

        // Check if all payments have been made
        if (fd.totalPaymentsMade >= (fd.price + fd.downPayment)) {
            completeFinancing(financingId);
        }
    }

    function calculateMonthlyPayment(uint256 price, uint256 termLength, uint256 interestRate, uint256 downPayment) public pure returns (uint256) {
        uint256 remainingAmount = price - downPayment;
        uint256 monthlyInterest = (remainingAmount * interestRate) / 120000;  // Assuming it's a basis point and 12 months
        return remainingAmount / termLength + monthlyInterest;
    }

    function completeFinancing(uint256 financingId) private {
        FinancingDetails storage fd = financingDetails[financingId];

        require(fd.isActive, "Financing is not active.");

        // Transfer the deed to the buyer
        deedNFTContract.transferFrom(fd.seller, fd.buyer, financingId);
        
        fd.isActive = false;

        emit FinancingCompleted(financingId);
    }
    
    event InterestRateChanged(uint256 financingId, uint256 oldRate, uint256 newRate);

    // Option to change interest rate (only by the seller)
    function adjustInterestRate(uint256 financingId, uint256 newInterestRate) public {
        FinancingDetails storage fd = financingDetails[financingId];

        require(fd.isActive, "Financing is not active.");
        require(msg.sender == fd.seller, "Only the seller can adjust the interest rate.");
        require(newInterestRate <= 3000, "Max interest rate is 30%"); // Basis points
        require(newInterestRate > fd.interestRate, "New rate must be greater than the current rate.");

        uint256 maxAllowedAdjustment = (fd.interestRate * 150) / 100;  // 50% max adjustment
        require(newInterestRate <= maxAllowedAdjustment, "Adjustment exceeds max allowed.");

        uint256 oldRate = fd.interestRate;
        fd.interestRate = newInterestRate;

        emit InterestRateChanged(financingId, oldRate, newInterestRate);
    }

    // Function for the buyer to query the current terms
    function getCurrentTerms(uint256 financingId) public view returns (uint256 price, uint256 termLength, uint256 interestRate, uint256 downPayment) {
        FinancingDetails storage fd = financingDetails[financingId];
        
        return (fd.price, fd.termLength, fd.interestRate, fd.downPayment);
    }

    // Function for both parties to check the current payment state
    function getCurrentPaymentState(uint256 financingId) public view returns (uint256 totalPaymentsMade, bool isActive) {
        FinancingDetails storage fd = financingDetails[financingId];
        
        return (fd.totalPaymentsMade, fd.isActive);
    }
}


