// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract OwnerFinancing is ERC721Holder, Ownable {
    using SafeMath for uint256;

    struct FinancingDetails {
        address seller;
        address buyer;
        uint256 tokenId;
        uint256 propertyPrice;
        uint256 downPayment;
        uint256 remainingBalance;
        uint256 monthlyPayment;
        uint256 interestRate; // 5% is stored as 500
        uint256 termInMonths;
        uint256 paymentsMade;
        bool isActive;
    }

    event FinancingCreated(address indexed seller, address indexed buyer, uint256 indexed tokenId, uint256 propertyPrice, uint256 downPayment, uint256 interestRate, uint256 termInMonths);
    event PaymentMade(address indexed buyer, uint256 indexed tokenId, uint256 paymentAmount, uint256 remainingBalance);
    event FinancingCompleted(address indexed buyer, uint256 indexed tokenId);
    event FinancingDefaulted(address indexed buyer, uint256 indexed tokenId);
    
    mapping(uint256 => FinancingDetails) public financings;
    IERC721 public deedNFT;

    constructor(address _deedNFTAddress) {
        deedNFT = IERC721(_deedNFTAddress);
    }

    // Interest calculations
    function calculateMonthlyPayment(uint256 principal, uint256 interestRate, uint256 termInMonths) public pure returns (uint256) {
        uint256 rate = interestRate.div(120000); // Monthly interest rate in percentage (annual interest rate / 12 months)
        uint256 numerator = rate.mul(principal);
        uint256 denominator = uint256(1).sub(uint256(1).add(rate)**termInMonths.neg());
        return numerator.div(denominator);
    }

    function initiateFinancing(
        address buyer,
        uint256 tokenId,
        uint256 propertyPrice,
        uint256 downPayment,
        uint256 interestRate,
        uint256 termInMonths
    ) public onlyOwner returns (bool) {
        require(deedNFT.ownerOf(tokenId) == msg.sender, "Only the owner of the token can initiate financing.");
        require(downPayment >= propertyPrice.div(10), "Down payment must be at least 10% of the property price.");
        require(downPayment <= propertyPrice, "Down payment cannot be more than the property price.");
        
        uint256 remainingBalance = propertyPrice.sub(downPayment);
        uint256 monthlyPayment = calculateMonthlyPayment(remainingBalance, interestRate, termInMonths);
        
        FinancingDetails memory financing = FinancingDetails({
            seller: msg.sender,
            buyer: buyer,
            tokenId: tokenId,
            propertyPrice: propertyPrice,
            downPayment: downPayment,
            remainingBalance: remainingBalance,
            monthlyPayment: monthlyPayment,
            interestRate: interestRate,
            termInMonths: termInMonths,
            paymentsMade: 0,
            isActive: true
        });
        
        financings[tokenId] = financing;

        deedNFT.safeTransferFrom(msg.sender, address(this), tokenId);
        
        emit FinancingCreated(msg.sender, buyer, tokenId, propertyPrice, downPayment, interestRate, termInMonths);
        return true;
    }
function makeMonthlyPayment(uint256 tokenId) public returns (bool) {
        require(financings[tokenId].isActive, "Financing for this token is not active.");
        require(msg.sender == financings[tokenId].buyer, "Only the buyer can make payments.");
        
        uint256 paymentAmount = financings[tokenId].monthlyPayment;
        uint256 remainingBalance = financings[tokenId].remainingBalance;

        require(msg.value >= paymentAmount, "Insufficient payment.");

        financings[tokenId].paymentsMade++;
        financings[tokenId].remainingBalance = remainingBalance.sub(paymentAmount);
        payable(financings[tokenId].seller).transfer(paymentAmount);

        emit PaymentMade(msg.sender, tokenId, paymentAmount, financings[tokenId].remainingBalance);
        
        if (financings[tokenId].remainingBalance == 0) {
            completeFinancing(tokenId);
        }

        return true;
    }
    
    function completeFinancing(uint256 tokenId) internal {
        require(financings[tokenId].isActive, "Financing for this token is not active.");

        financings[tokenId].isActive = false;
        deedNFT.safeTransferFrom(address(this), financings[tokenId].buyer, tokenId);
        
        emit FinancingCompleted(financings[tokenId].buyer, tokenId);
    }
    
    function defaultFinancing(uint256 tokenId) public onlyOwner {
        require(financings[tokenId].isActive, "Financing for this token is not active.");
        
        financings[tokenId].isActive = false;
        
        emit FinancingDefaulted(financings[tokenId].buyer, tokenId);
    }

    function setDeedNFTAddress(address _deedNFTAddress) public onlyOwner {
        deedNFT = IERC721(_deedNFTAddress);
    }

    // Helper functions for interaction
    function getFinancingDetails(uint256 tokenId) public view returns (FinancingDetails memory) {
        return financings[tokenId];
    }

    receive() external payable {
        revert("Direct payments are not allowed. Use makeMonthlyPayment function.");
    }
}
