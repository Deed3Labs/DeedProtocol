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
    address payable public platformWallet;

    mapping(uint256 => FinancingDetails) public financingDetails;
    mapping(address => uint256) public pendingSellerWithdrawals;
    mapping(address => uint256) public pendingBuyerWithdrawals;
    uint256 public nextFinancingId;
    uint256 public platformFeeRate = 500; // 5% fee in basis points

    uint256 constant MAX_INTEREST_RATE = 3000; // 30% in basis points
    uint256 constant MAX_ADJUSTABLE_RATE_INCREASE = 1500; // 15% increase in basis points

    event FinancingCreated(uint256 financingId);
    event PaymentMade(uint256 financingId, address from, uint256 amount);
    event FinancingCompleted(uint256 financingId);
    event InterestRateChanged(uint256 financingId, uint256 oldRate, uint256 newRate);

    constructor(address _sellerNFTAddress, address _buyerNFTAddress, address _deedNFTAddress, address payable _platformWallet) {
        sellerNFTContract = SellerNFT(_sellerNFTAddress);
        buyerNFTContract = BuyerNFT(_buyerNFTAddress);
        deedNFTContract = DeedNFT(_deedNFTAddress);
        platformWallet = _platformWallet;
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

    function acceptTerms(uint256 financingId, uint256 _downPayment) public payable {
        FinancingDetails storage fd = financingDetails[financingId];
        
        require(msg.sender == fd.buyer, "Only the buyer can accept terms.");
        require(!fd.isTermsAccepted, "Terms are already accepted.");
        require(_downPayment >= fd.downPayment, "Down payment is less than the required amount.");
        require(msg.value >= _downPayment, "Sent funds are less than the down payment.");

        uint256 platformFee = (_downPayment * platformFeeRate) / 10000;
        uint256 toSeller = _downPayment - platformFee;

        // Keep funds within the contract for future withdrawal by the Seller and Buyer
        pendingSellerWithdrawals[fd.seller] += toSeller;
        pendingBuyerWithdrawals[fd.buyer] += msg.value - _downPayment;

        fd.isTermsAccepted = true;
        fd.downPayment = toSeller;
        
        // Initialize Financing
        fd.isActive = true;
        fd.totalPaymentsMade = toSeller;

        // Mint NFTs
        sellerNFTContract.mintNFT(fd.seller, financingId);
        buyerNFTContract.mintNFT(fd.buyer, financingId);
        
        // Transfer the platform fee immediately
        platformWallet.transfer(platformFee);
    }

    mapping(address => uint256) public pendingSellerWithdrawals;
    mapping(address => uint256) public pendingBuyerWithdrawals;

    event SellerWithdrawal(uint256 financingId, address to, uint256 amount);
    event BuyerWithdrawal(uint256 financingId, address to, uint256 amount);

    function makePayment(uint256 financingId) public payable {
        FinancingDetails storage fd = financingDetails[financingId];

        require(fd.isActive, "Financing is not active.");
        require(msg.sender == fd.buyer, "Only the buyer can make payments.");
        
        uint256 monthlyPayment = calculateMonthlyPayment(fd.price, fd.termLength, fd.interestRate, fd.downPayment);
        uint256 platformFee = (monthlyPayment * platformFeeRate) / 10000;
        uint256 toSeller = monthlyPayment - platformFee;

        require(msg.value >= monthlyPayment, "Insufficient payment.");

        // Hold funds within the contract for future withdrawal by the Seller
        pendingSellerWithdrawals[fd.seller] += toSeller;
        pendingBuyerWithdrawals[fd.buyer] += msg.value - monthlyPayment;

        // Update the state
        fd.totalPaymentsMade += toSeller;
        
        emit PaymentMade(financingId, msg.sender, monthlyPayment);

        // Transfer the platform fee immediately
        platformWallet.transfer(platformFee);
        
        // Check if all payments have been made
        if (fd.totalPaymentsMade >= (fd.price + fd.downPayment)) {
            completeFinancing(financingId);
        }
    }

    function withdrawFunds(uint256 financingId, uint256 amount, bool isSeller) public {
        FinancingDetails storage fd = financingDetails[financingId];
        
        require(fd.isActive, "Financing is not active.");

        if (isSeller) {
            require(msg.sender == fd.seller, "Only the seller can withdraw.");
            require(pendingSellerWithdrawals[msg.sender] >= amount, "Insufficient funds.");
            pendingSellerWithdrawals[msg.sender] -= amount;
        } else {
            require(msg.sender == fd.buyer, "Only the buyer can withdraw.");
            require(pendingBuyerWithdrawals[msg.sender] >= amount, "Insufficient funds.");
            pendingBuyerWithdrawals[msg.sender] -= amount;
        }

        payable(msg.sender).transfer(amount);

        emit isSeller ? SellerWithdrawal(financingId, msg.sender, amount) : BuyerWithdrawal(financingId, msg.sender, amount);
    }

    function completeFinancing(uint256 financingId) private {
        FinancingDetails storage fd = financingDetails[financingId];
        
        require(fd.isActive, "Financing is not active.");

        // If financing is completed, allow buyer to withdraw DeedNFT
        if (fd.totalPaymentsMade >= (fd.price + fd.downPayment)) {
            deedNFTContract.transferFrom(fd.seller, fd.buyer, financingId);
            pendingBuyerWithdrawals[fd.buyer] += fd.totalPaymentsMade;
        } 
        // If defaulted, allow seller to withdraw all funds and DeedNFT
        else {
            deedNFTContract.transferFrom(fd.buyer, fd.seller, financingId);
            pendingSellerWithdrawals[fd.seller] += fd.totalPaymentsMade;
        }

        fd.isActive = false;
        
        emit FinancingCompleted(financingId);
    }

    function withdrawNFT(uint256 financingId, bool isSeller) public {
        FinancingDetails storage fd = financingDetails[financingId];
        
        require(!fd.isActive, "Financing must be completed or defaulted.");

        if (isSeller) {
            require(msg.sender == fd.seller, "Only the seller can withdraw the SellerNFT.");
            sellerNFTContract.transferFrom(address(this), fd.seller, financingId);
        } else {
            require(msg.sender == fd.buyer, "Only the buyer can withdraw the BuyerNFT.");
            buyerNFTContract.transferFrom(address(this), fd.buyer, financingId);
        }
    }


