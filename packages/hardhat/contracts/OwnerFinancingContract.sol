// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Mocking the DeedNFT contract. Replace with actual DeedNFT contract interface
interface IDeedNFT is IERC721 {
    // Additional functions specific to DeedNFT can be added here if needed
}

contract OwnerFinancing is ERC721("FinancingNFT", "FINT"), Ownable, ReentrancyGuard, Pausable {
    using SafeMath for uint256;

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
        bool approved;
        bool defaulted;
    }

    struct Offer {
        address proposer;
        uint256 principal;
        uint256 downPayment;
        uint256 interestRate;
        uint256 termInMonths;
        bool approved;
    }

    IDeedNFT public deedNftContract;
    uint256 public financingNftCounter = 0;
    mapping(uint256 => Financing) public financings;
    mapping(uint256 => uint256) public financingNfts;
    mapping(uint256 => Offer[]) public offers;

    uint256 public maxMonthsPastDue;

    event FinancingStarted(
        uint256 indexed deedNftTokenId,
        uint256 indexed financingNftTokenId,
        address indexed buyer,
        uint256 principal,
        uint256 downPayment,
        uint256 interestRate,
        uint256 termInMonths
    );
    event OfferMade(
        uint256 indexed deedNftTokenId,
        address indexed proposer,
        uint256 principal,
        uint256 downPayment,
        uint256 interestRate,
        uint256 termInMonths
    );
    event OfferAccepted(
        uint256 indexed deedNftTokenId,
        address indexed buyer
    );
    event MonthlyPaymentMade(
        uint256 indexed deedNftTokenId,
        uint256 indexed financingNftTokenId,
        address indexed payer,
        uint256 payment,
        uint256 remainingAmount
    );
    event FinancingTerminated(
        uint256 indexed deedNftTokenId,
        uint256 indexed financingNftTokenId,
        address indexed buyer,
        uint256 remainingAmount,
        bool defaulted
    );

    constructor(address _deedNftAddress, uint256 _maxMonthsPastDue) {
        deedNftContract = IDeedNFT(_deedNftAddress);
        maxMonthsPastDue = _maxMonthsPastDue;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function setMaxMonthsPastDue(uint256 _maxMonthsPastDue) external onlyOwner {
        maxMonthsPastDue = _maxMonthsPastDue;
    }

    // Initialize financing for a DeedNFT with preferred terms (optional)
    function startFinancing(
        uint256 deedNftTokenId,
        uint256 preferredPrincipal,
        uint256 preferredDownPayment,
        uint256 preferredInterestRate,
        uint256 preferredTermInMonths
    )
        external
        nonReentrant
        whenNotPaused
    {
        require(deedNftContract.ownerOf(deedNftTokenId) == msg.sender, "Only the DeedNFT owner can initiate financing.");
        require(financings[deedNftTokenId].buyer == address(0), "Financing already exists for this DeedNFT.");

        deedNftContract.transferFrom(msg.sender, address(this), deedNftTokenId);

        uint256 financingNftTokenId = financingNftCounter++;
        _mint(msg.sender, financingNftTokenId);

        financings[deedNftTokenId] = Financing({
            buyer: msg.sender,
            seller: address(0),
            principal: preferredPrincipal,
            downPayment: preferredDownPayment,
            interestRate: preferredInterestRate,
            termInMonths: preferredTermInMonths,
            remainingAmount: preferredPrincipal - preferredDownPayment,
            nextPaymentDue: 0,
            missedPayments: 0,
            approved: false,
            defaulted: false
        });

        financingNfts[financingNftTokenId] = deedNftTokenId;

        emit FinancingStarted(deedNftTokenId, financingNftTokenId, msg.sender, preferredPrincipal, preferredDownPayment, preferredInterestRate, preferredTermInMonths);
    }

    // Make an offer for financing a DeedNFT
    function makeOffer(
        uint256 deedNftTokenId,
        uint256 proposedPrincipal,
        uint256 proposedDownPayment,
        uint256 proposedInterestRate,
        uint256 proposedTermInMonths
    )
        external
        nonReentrant
        whenNotPaused
    {
        require(financings[deedNftTokenId].buyer != address(0), "Financing does not exist for this DeedNFT.");

        offers[deedNftTokenId].push(Offer({
            proposer: msg.sender,
            principal: proposedPrincipal,
            downPayment: proposedDownPayment,
            interestRate: proposedInterestRate,
            termInMonths: proposedTermInMonths,
            approved: false
        }));

        emit OfferMade(deedNftTokenId, msg.sender, proposedPrincipal, proposedDownPayment, proposedInterestRate, proposedTermInMonths);
    }

    // Accept an offer made for a DeedNFT
    function acceptOffer(uint256 deedNftTokenId, uint256 offerIndex)
        external
        nonReentrant
        whenNotPaused
    {
        require(deedNftContract.ownerOf(deedNftTokenId) == msg.sender, "Only the DeedNFT owner can accept offers.");
        require(offers[deedNftTokenId][offerIndex].proposer != address(0), "Offer does not exist.");

        // Implementing your requirement to set 'approved' flag
        financings[deedNftTokenId].approved = true;

        emit OfferAccepted(deedNftTokenId, offers[deedNftTokenId][offerIndex].proposer);
    }

    // Function to execute monthly payments
    function makeMonthlyPayment(uint256 deedNftTokenId)
        external
        payable
        nonReentrant
        whenNotPaused
    {
        require(financings[deedNftTokenId].approved, "Financing has not been approved.");
        require(msg.sender == financings[deedNftTokenId].buyer, "Only the approved buyer can make payments.");

        Financing storage f = financings[deedNftTokenId];
        uint256 paymentAmount = f.remainingAmount.div(f.termInMonths); // Simplified for demonstration, interest rate is not applied

        require(msg.value >= paymentAmount, "Insufficient payment.");

        f.remainingAmount = f.remainingAmount.sub(paymentAmount);
        f.nextPaymentDue = block.timestamp + 30 days;
        if (f.remainingAmount == 0) {
            // Transfer DeedNFT to buyer
            deedNftContract.transferFrom(address(this), f.buyer, deedNftTokenId);

            emit FinancingTerminated(deedNftTokenId, financingNfts[deedNftTokenId], f.buyer, f.remainingAmount, false);
        }

        emit MonthlyPaymentMade(deedNftTokenId, financingNfts[deedNftTokenId], msg.sender, msg.value, f.remainingAmount);
    }

        // ...Continued from the previous part

    // Decline an offer made for a DeedNFT
    function declineOffer(uint256 deedNftTokenId, uint256 offerIndex)
        external
        nonReentrant
        whenNotPaused
    {
        require(deedNftContract.ownerOf(deedNftTokenId) == msg.sender, "Only the DeedNFT owner can decline offers.");
        require(offers[deedNftTokenId][offerIndex].proposer != address(0), "Offer does not exist.");

        // Remove the offer from storage
        delete offers[deedNftTokenId][offerIndex];

        emit OfferDeclined(deedNftTokenId, offers[deedNftTokenId][offerIndex].proposer);
    }

    // Emergency stop mechanism
    function togglePause()
        external
        onlyOwner
    {
        paused = !paused;

        if (paused) {
            emit Paused();
        } else {
            emit Unpaused();
        }
    }

    // Withdraw ETH from the contract (for owner)
    function withdrawEth(uint256 amount)
        external
        onlyOwner
    {
        require(address(this).balance >= amount, "Insufficient balance.");
        payable(owner()).transfer(amount);
        emit Withdrawn(owner(), amount);
    }

    // Events for contract actions
    event OfferMade(
        uint256 indexed deedNftTokenId,
        address indexed proposer,
        uint256 principal,
        uint256 downPayment,
        uint256 interestRate,
        uint256 termInMonths
    );

    event OfferAccepted(
        uint256 indexed deedNftTokenId,
        address indexed proposer
    );

    event OfferDeclined(
        uint256 indexed deedNftTokenId,
        address indexed proposer
    );

    event MonthlyPaymentMade(
        uint256 indexed deedNftTokenId,
        address indexed financingNft,
        address indexed payer,
        uint256 paymentAmount,
        uint256 remainingAmount
    );

    event FinancingTerminated(
        uint256 indexed deedNftTokenId,
        address indexed financingNft,
        address indexed buyer,
        uint256 remainingAmount,
        bool defaulted
    );

    event Withdrawn(address indexed operator, uint256 amount);
    event Paused();
    event Unpaused();


}

