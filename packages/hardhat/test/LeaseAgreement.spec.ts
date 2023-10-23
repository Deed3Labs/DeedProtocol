// How to handle enums insolidity testing?
import { expect } from "chai";
import { ethers } from "hardhat";
import { SubdivisionNFT, DeedNFT, LeaseNFT, LeaseAgreement, TokenMock, FundStorage } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("LeaseAgreement", function () {
  // We define a fixture to reuse the same setup in every test.
  //   let contractOwner: SignerWithAddress;
  let subNFT: SubdivisionNFT;
  let deedNFT: DeedNFT;
  let leaseNFT: LeaseNFT;
  let fundsManager: FundStorage;
  let leaseAgreement: LeaseAgreement;
  let contractOwner: SignerWithAddress;
  let lessee: SignerWithAddress;
  let agent: SignerWithAddress;
  let deedOwner: SignerWithAddress;
  let subOwner: SignerWithAddress;
  let leaseToken: TokenMock;
  const initialLesseeBalance = 100000;
  //August 18 2023 timestamp
  let startDate: number;
  //August 18 2024 timestamp
  let endDate: number;
  const rentAmount = 1500;
  const depositAmount = 400;
  const thirtyOneDaysInSeconds = 3600 * 24 * 31;
  const oneDayInSeconds = 86400;

  beforeEach(async () => {
    [contractOwner, deedOwner, agent, subOwner, lessee] = await ethers.getSigners();
    const subNFTFactory = await ethers.getContractFactory("SubdivisionNFT");
    const deedNFTFactory = await ethers.getContractFactory("DeedNFT");
    startDate = await time.latest();
    endDate = startDate + 12 * thirtyOneDaysInSeconds;
    deedNFT = (await deedNFTFactory.connect(contractOwner).deploy()) as DeedNFT;
    await deedNFT.deployed();
    const tokenMockFactory = ethers.getContractFactory("TokenMock");
    leaseToken = (await (await tokenMockFactory).connect(contractOwner).deploy("PaymentToken", "PTKN")) as TokenMock;
    await leaseToken.mint(lessee.address, initialLesseeBalance);
    subNFT = (await subNFTFactory.connect(contractOwner).deploy("uri", deedNFT.address)) as SubdivisionNFT;
    await subNFT.deployed();
    const leaseNftFactory = await ethers.getContractFactory("LeaseNFT");
    const leaseAgreementFactory = await ethers.getContractFactory("LeaseAgreement");
    leaseNFT = (await leaseNftFactory.connect(contractOwner).deploy()) as LeaseNFT;
    await leaseNFT.deployed();
    leaseAgreement = (await leaseAgreementFactory
      .connect(contractOwner)
      .deploy(leaseNFT.address, leaseToken.address, deedNFT.address, subNFT.address)) as LeaseAgreement;
    await leaseAgreement.deployed();
    await leaseNFT.connect(contractOwner).setLeaseAgreementAddress(leaseAgreement.address);
    //This deed id will be 1
    await deedNFT.mintAsset(deedOwner.address, "0x", 2, "12 000 Fake Addy");
    await subNFT.connect(deedOwner).mintSubdivision({ ipfsDetailsHash: "0x", owner: subOwner.address, parentDeed: 1 });
    const fundsManagerFactory = await ethers.getContractFactory("FundStorage");
    fundsManager = (await fundsManagerFactory.connect(contractOwner).deploy()) as FundStorage;
    await fundsManager.deployed();
    await leaseAgreement.connect(contractOwner).setFundsManager(fundsManager.address);
  });

  describe("createLease", function () {
    it("Should create a new lease with the right values", async function () {
      // Arrange
      const leaseId = 0;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;

      // Act
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );

      // Assert
      expect(await leaseNFT.ownerOf(leaseId)).to.equal(deedOwner.address);
      const lease = await leaseAgreement.leases(leaseId);
      expect(lease.lessor).to.equal(deedOwner.address);
      expect(lease.lessee).to.equal(lessee.address);
      expect(lease.rentAmount).to.equal(rentAmount);
      expect(lease.propertyTokenId).to.equal(propertyTokenId);
      //TODO: Test dates
    });

    it("Should revert if end date before start date", async function () {
      // Arrange
      const startDate = 10000000;
      const endDate = 1000;
      const rentAmount = 1000;
      const securityDeposit = 400;
      const propertyTokenId = 1;
      const latePaymentFee = 10;
      const gracePeriod = 5;

      // Act
      const act = () =>
        leaseAgreement
          .connect(deedOwner)
          .createLease(
            lessee.address,
            startDate,
            endDate,
            rentAmount,
            securityDeposit,
            propertyTokenId,
            latePaymentFee,
            gracePeriod,
          );

      // Assert
      await expect(act()).to.be.revertedWith("[Lease Agreement] Invalid start and end dates");
    });

    it("Should revert if end date and start date interval less than 1 month", async function () {
      // Arrange
      const lessThanThirtyDays = 2592000;
      const startDate = 1000;
      const endDate = 1000;
      const rentAmount = 1000;
      const securityDepositAmount = 400;
      const propertyTokenId = 1;
      const latePaymentFee = 10;
      const gracePeriod = 5;

      // Act
      const act = () =>
        leaseAgreement
          .connect(deedOwner)
          .createLease(
            lessee.address,
            startDate,
            endDate + lessThanThirtyDays,
            rentAmount,
            securityDepositAmount,
            propertyTokenId,
            latePaymentFee,
            gracePeriod,
          );

      // Assert
      await expect(act()).to.be.revertedWith("[Lease Agreement] End date and start date should be 1 month appart");
    });

    it("Should revert if caller isn't owner of deed", async function () {
      // Arrange
      const startDate = 1000;
      const endDate = 1000000000;
      const rendAmount = 1000;
      const securityDepositAmount = 400;
      const propertyTokenId = 1;
      const latePaymentFee = 10;
      const gracePeriod = 5;

      // Act
      const act = () =>
        leaseAgreement
          .connect(lessee)
          .createLease(
            lessee.address,
            startDate,
            endDate,
            rendAmount,
            securityDepositAmount,
            propertyTokenId,
            latePaymentFee,
            gracePeriod,
          );

      // Assert
      await expect(act()).to.be.revertedWith("[Lease Agreement] Lessor must own the property NFT");
    });
  });

  describe("addAgent", function () {
    it("Should set agent and emit AgentSet event", async function () {
      // Arrange
      const leaseId = 0;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      const agentPercentage = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      expect((await leaseAgreement.leases(leaseId)).agent).to.equal(ethers.constants.AddressZero);

      // Act
      expect(await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage)).to.emit(
        leaseAgreement,
        "AgentSet",
      );

      // Assert
      expect((await leaseAgreement.leases(leaseId)).agent).to.equal(agent.address);
      expect((await leaseAgreement.leases(leaseId)).agentPercentage).to.equal(agentPercentage);
    });

    it("Should revert if caller isn't lessor", async function () {
      // Arrange
      const leaseId = 0;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      const agentPercentage = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );

      // Act
      const act = () => leaseAgreement.connect(subOwner).addAgent(leaseId, agent.address, agentPercentage);

      // Assert
      await expect(act()).to.be.rejectedWith("[Lease Agreement] Only the Lessor can set the Agent");
    });

    it("Should revert if percentage isn't valid", async function () {
      // Arrange
      const leaseId = 0;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      const agentPercentage = 101;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );

      // Act
      const act = () => leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);

      // Assert
      await expect(act()).to.be.rejectedWith("[Lease Agreement] Invalid agent percentage");
    });
  });

  describe("removeAgent", function () {
    it("Should set agent address to 0 and emit AgentRemoved event", async function () {
      // Arrange
      const leaseId = 0;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      const agentPercentage = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      // Assert
      expect((await leaseAgreement.leases(leaseId)).agent).to.equal(agent.address);
      expect((await leaseAgreement.leases(leaseId)).agentPercentage).to.equal(agentPercentage);

      // Act
      await expect(leaseAgreement.connect(deedOwner).removeAgent(leaseId)).to.emit(leaseAgreement, "AgentRemoved");

      // Assert
      expect((await leaseAgreement.leases(leaseId)).agent).to.equal(ethers.constants.AddressZero);
    });

    it("Should revert if caller isn't lessor", async function () {
      // Arrange
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      const leaseId = 0;
      const agentPercentage = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);

      // Act
      const act = () => leaseAgreement.connect(subOwner).removeAgent(leaseId);

      // Assert
      await expect(act()).to.be.rejectedWith("[Lease Agreement] only the Lessor or the Agent can remove the Agent");
    });
  });

  describe("submitDeposit", function () {
    it("Should transfer the deposit from paymentToken to this contract address", async function () {
      // Arrange
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      const leaseId = 0;
      const agentPercentage = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);

      // Act
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);

      // Assert
      const fundStorageLeaseBalance = await fundsManager
        .connect(leaseAgreement.address)
        .balanceOf(leaseId, leaseToken.address);
      expect(fundStorageLeaseBalance).to.equal(depositAmount);
      expect(await leaseToken.balanceOf(fundsManager.address)).to.equal(depositAmount);
      expect(await leaseToken.balanceOf(lessee.address)).to.equal(initialLesseeBalance - depositAmount);
    });

    it("Should revert if caller isn't lessee", async function () {
      // Arrange
      const leaseId = 0;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      const agentPercentage = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);

      // Act
      const act = () => leaseAgreement.connect(subOwner).submitDeposit(leaseId);

      // Assert
      await expect(act()).to.be.rejectedWith("[Lease Agreement] Only the Lessee can submit the deposit");
    });

    it("Should revert if deposit already paid", async function () {
      // Arrange
      const leaseId = 0;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      const agentPercentage = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);

      // Act
      const act = () => leaseAgreement.connect(lessee).submitDeposit(leaseId);

      // Assert
      await expect(act()).to.be.rejectedWith("[Lease Agreement] Security deposit already paid");
    });

    it("Should revert if deposit amount bigger than sender balance", async function () {
      // Arrange
      const leaseId = 0;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      const rentAmount = 1000;
      const securityDepositAmount = 400000;
      const agentPercentage = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          securityDepositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);

      // Act
      const act = () => leaseAgreement.connect(lessee).submitDeposit(leaseId);

      // Assert
      await expect(act()).to.be.rejectedWith(
        `Funds Storage [store]: Not enough allowance for account ${leaseId} and amount ${depositAmount}`,
      );
    });
  });

  describe("calculateRentPaymentInfo", function () {
    it("Should return the right calculatedRentAmount with extra fee if late", async function () {
      // Arrange
      const leaseId = 0;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      const agentPercentage = 5;
      //This creates a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);

      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds * 3);

      // Act
      const info = await leaseAgreement.connect(lessee).calculateRentPaymentInfo(leaseId);

      // Assert
      expect(info.rentAmount).to.equal(1650);
      expect(info.unpaidMonths).to.equal(3);
      //2 months unpaid * 1500 + one late month fee 1650 (fee 10% of 1500) = 4650
      expect(info.totalBalance).to.equal(1650 * 3);
    });

    //Note: For each test that changes the time value, the next test will have a startDate equal to the latest timestamp in the previous test
    //Because beforeEach hook is called and startDate and endDate are set at this moment;
    it("Should return the right calculatedRentAmount without any fee if on time", async function () {
      // Arrange
      const leaseId = 0;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      const agentPercentage = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);

      //Mines new block with timestamp increased, in this case 15 days
      await time.increase(thirtyOneDaysInSeconds / 2);

      // Act
      const info = await leaseAgreement.connect(lessee).calculateRentPaymentInfo(leaseId);

      // Assert
      expect(info.rentAmount).to.equal(1500);
      expect(info.unpaidMonths).to.equal(1);
      expect(info.totalBalance).to.equal(1500);
    });
  });

  describe("payRent", function () {
    it("Should transfer the right calculatedRentAmount to the contract and adjust rentDueDate", async function () {
      // Arrange
      const leaseId = 0;
      const agentPercentage = 10;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      //This creates a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds / 15);
      const totalExpectedBalance = 1500;
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), totalExpectedBalance);

      // Act
      await leaseAgreement.connect(lessee).payRent(leaseId);

      // Assert
      const lease = await leaseAgreement.leases(leaseId);
      const fundStorageLeaseBalance = await fundsManager
        .connect(leaseAgreement.address)
        .balanceOf(leaseId, leaseToken.address);
      expect(lease.dates.rentDueDate).to.be.greaterThanOrEqual(startDate + 2 * 30 * oneDayInSeconds);
      expect(fundStorageLeaseBalance).to.equal(totalExpectedBalance + depositAmount);
      expect(await leaseToken.balanceOf(fundsManager.address)).to.equal(totalExpectedBalance + depositAmount);
    });

    it("Should transfer the right calculatedRentAmount to the contract and adjust rentDueDate but with late payment", async function () {
      // Arrange
      const leaseId = 0;
      const agentPercentage = 10;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds * 3);
      const totalExpectedBalance = 1650 * 3;
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), totalExpectedBalance);

      // Act
      await leaseAgreement.connect(lessee).payRent(leaseId);
      const lease = await leaseAgreement.leases(leaseId);

      // Assert
      const fundStorageLeaseBalance = await fundsManager
        .connect(leaseAgreement.address)
        .balanceOf(leaseId, leaseToken.address);
      expect(fundStorageLeaseBalance).to.equal(totalExpectedBalance + depositAmount);
      expect(await leaseToken.balanceOf(fundsManager.address)).to.equal(totalExpectedBalance + depositAmount);
      expect(lease.dates.rentDueDate).to.be.greaterThanOrEqual(startDate + 4 * 30 * oneDayInSeconds);
    });

    it("Should revert if sender isn't lessee", async function () {
      // Arrange
      const agentPercentage = 10;
      const leaseId = 0;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds * 4 + 15 * oneDayInSeconds);
      const totalExpectedBalance = 6150;
      await leaseToken.connect(deedOwner).approve(leaseAgreement.fundsManager(), totalExpectedBalance);

      // Act
      const act = () => leaseAgreement.connect(deedOwner).payRent(leaseId);

      // Assert
      await expect(act()).to.be.revertedWith("[Lease Agreement] Only the Lessee can pay rent");
    });

    it("Should revert if deposit isn't paid yet", async function () {
      // Arrange
      const agentPercentage = 10;
      const leaseId = 0;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await time.increase(thirtyOneDaysInSeconds * 4 + 15 * oneDayInSeconds);
      const totalExpectedBalance = 6150;
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), totalExpectedBalance);

      // Act
      const act = () => leaseAgreement.connect(lessee).payRent(leaseId);

      // Assert
      await expect(act()).to.be.revertedWith("[Lease Agreement] Security deposit must be paid first");
    });

    it("Should revert if timestamp outside of lease duration", async function () {
      // Arrange
      const leaseId = 0;
      const agentPercentage = 10;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      const noDeposit = 0;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          noDeposit,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await time.increase(thirtyOneDaysInSeconds * 13);
      const totalExpectedBalance = 6150;
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), totalExpectedBalance);

      // Act
      const act = () => leaseAgreement.connect(lessee).payRent(leaseId);

      // Assert
      await expect(act()).to.be.revertedWith("[Lease Agreement] Outside of lease duration");
    });

    it("Should revert if amount paid is less than total balance", async function () {
      // Arrange
      const leaseId = 0;
      const agentPercentage = 10;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      const depositAmount = 0;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await time.increase(thirtyOneDaysInSeconds * 2); // Increase 2 months so 2 rent payments are due + fees

      const amount = (await leaseAgreement.calculateRentPaymentInfo(leaseId)).totalBalance;
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), amount.toNumber() - 1);

      // Act
      const act = () => leaseAgreement.connect(lessee).payRent(leaseId);

      // Assert
      await expect(act()).to.be.revertedWith(
        `Funds Storage [store]: Not enough allowance for account ${leaseId} and amount ${amount}`,
      );
    });
  });

  describe("distributeRent", function () {
    it("Should distribute the rentAmount to the lessor and agent", async function () {
      // Arrange
      const leaseId = 0;
      const agentPercentage = 10;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds);

      const totalExpectedBalance = 1500;
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), totalExpectedBalance);
      await leaseAgreement.connect(lessee).payRent(leaseId);
      const leaseDate = (await leaseAgreement.leases(leaseId)).dates.distributableDate.toString();
      const leaseDatee = (await leaseAgreement.leases(leaseId)).dates.rentDueDate.toString();

      console.log(leaseDate);
      console.log(leaseDatee);

      // Act
      const act = () => leaseAgreement.connect(deedOwner).distributeRent(leaseId);

      // Assert
      await expect(act()).to.emit(leaseAgreement, "RentDistributed");
      const agentAmount = 0.1 * totalExpectedBalance;
      expect(await leaseToken.balanceOf(deedOwner.address)).to.equal(totalExpectedBalance - agentAmount);
      expect(await leaseToken.balanceOf(agent.address)).to.equal(agentAmount);
    });

    it("Should revert if sender not lessor or agent", async function () {
      // Arrange
      const leaseId = 0;
      const agentPercentage = 10;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);
      // Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds);
      const totalExpectedBalance = 1500;
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), totalExpectedBalance);
      await leaseAgreement.connect(lessee).payRent(leaseId);

      // Act
      const act = () => leaseAgreement.connect(lessee).distributeRent(leaseId);

      // Assert
      await expect(act()).to.be.revertedWith("[Lease Agreement] Caller must be the Lessor or the Agent");
    });
  });

  describe("terminateLease", function () {
    it("Should end the lease and distribute the remaining balance, with lessee receiving deposit", async function () {
      // Arrange
      const leaseId = 0;
      const agentPercentage = 10;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds);
      const totalExpectedBalance = 1500;
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), totalExpectedBalance);
      await leaseAgreement.connect(lessee).payRent(leaseId);
      expect(await leaseNFT.ownerOf(0)).to.equal(deedOwner.address);
      expect(await leaseToken.balanceOf(lessee.address)).to.equal(
        initialLesseeBalance - totalExpectedBalance - depositAmount,
      );

      // Act
      expect(await leaseAgreement.connect(deedOwner).terminateLease(leaseId)).to.emit(
        leaseAgreement,
        "LeaseTerminated",
      );

      // Assert
      expect(await leaseToken.balanceOf(deedOwner.address)).to.equal(totalExpectedBalance);
      expect(await leaseToken.balanceOf(lessee.address)).to.equal(initialLesseeBalance - totalExpectedBalance);
      // await leaseNFT.connect(deedOwner).burn(0);
      // await expect(leaseNFT.ownerOf(0)).to.be.revertedWith("ERC721: invalid token ID");
    });

    it("Should end the lease and distribute the remaining balance, with lessor receiving deposit if more than 3 unpaid months", async function () {
      // Arrange
      const leaseId = 0;
      const agentPercentage = 10;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds);
      const totalExpectedBalance = 1500;
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), totalExpectedBalance);
      await leaseAgreement.connect(lessee).payRent(leaseId);
      await time.increase(thirtyOneDaysInSeconds * 4);
      // expect(await leaseToken.balanceOf(leaseAgreement.address)).to.equal(totalExpectedBalance);
      expect(await leaseNFT.ownerOf(0)).to.equal(deedOwner.address);

      // Act
      expect(await leaseAgreement.connect(deedOwner).terminateLease(leaseId)).to.emit(
        leaseAgreement,
        "LeaseTerminated",
      );

      // Assert
      expect(await leaseToken.balanceOf(deedOwner.address)).to.equal(totalExpectedBalance + depositAmount);
      expect(await leaseToken.balanceOf(lessee.address)).to.equal(
        initialLesseeBalance - totalExpectedBalance - depositAmount,
      );
      const fundStorageLeaseBalance = await fundsManager
        .connect(leaseAgreement.address)
        .balanceOf(leaseId, leaseToken.address);
      expect(fundStorageLeaseBalance).to.equal(0);
      expect(await leaseToken.balanceOf(fundsManager.address)).to.equal(0);

      await expect(leaseNFT.ownerOf(0)).to.be.revertedWith("ERC721: invalid token ID");
    });

    it("Should revert if sender isn't lessor", async function () {
      // Arrange
      const leaseId = 0;
      const agentPercentage = 10;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds);
      const totalExpectedBalance = 1500;
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), totalExpectedBalance);
      await leaseAgreement.connect(lessee).payRent(leaseId);

      // Act
      const act = () => leaseAgreement.connect(lessee).terminateLease(leaseId);

      // Assert
      await expect(act()).to.be.revertedWith("[Lease Agreement] Only the Lessor can terminate the lease");
    });

    it("Should revert if timestamp is before startDate", async function () {
      // Arrange
      const leaseId = 0;
      const agentPercentage = 10;
      const propertyTokenId = 1;
      const latePaymentFee = 10;
      const gracePeriod = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate + thirtyOneDaysInSeconds * 3,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePaymentFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds);

      // Act
      const act = () => leaseAgreement.connect(deedOwner).terminateLease(leaseId);

      // Assert
      await expect(act()).to.be.revertedWith("[Lease Agreement] Lease has not started yet");
    });
  });

  describe("extendLease", function () {
    it("Should extend the lease", async function () {
      // Arrange
      const leaseId = 0;
      const agentPercentage = 10;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds * 11);

      // Act
      await leaseAgreement.connect(lessee).extendLease(leaseId, 3 * thirtyOneDaysInSeconds);
      const lease = await leaseAgreement.leases(leaseId);

      // Assert
      expect(lease.dates.endDate).to.equal(endDate + thirtyOneDaysInSeconds * 3);
      expect(lease.extensionCount).to.equal(1);
      expect(lease.rentAmount).to.equal(rentAmount * 1.03);
    });

    it("Should revert if caller isn't lessee", async function () {
      // Arrange
      const leaseId = 0;
      const agentPercentage = 10;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds * 11);

      // Act
      const act = () => leaseAgreement.connect(deedOwner).extendLease(leaseId, 3 * thirtyOneDaysInSeconds);

      // Assert
      await expect(act()).to.be.revertedWith("[Lease Agreement] Only the Lessee can extend the lease");
    });

    it("Should revert if called in invalid period", async function () {
      // Arrange
      const leaseId = 0;
      const agentPercentage = 10;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds * 4);

      // Act
      const act = () => leaseAgreement.connect(lessee).extendLease(leaseId, 3 * thirtyOneDaysInSeconds);

      // Assert
      await expect(act()).to.be.revertedWith("[Lease Agreement] Extension can only be requested in the last 45 days");
    });

    it("Should revert if 2 extensions were already called", async function () {
      // Arrange
      const leaseId = 0;
      const agentPercentage = 10;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );
      await leaseAgreement.connect(deedOwner).addAgent(leaseId, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.fundsManager(), depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(leaseId);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds * 11);
      await leaseAgreement.connect(lessee).extendLease(leaseId, thirtyOneDaysInSeconds);
      await time.increase(thirtyOneDaysInSeconds * 2);
      await leaseAgreement.connect(lessee).extendLease(leaseId, thirtyOneDaysInSeconds);
      await time.increase(thirtyOneDaysInSeconds);

      // Act
      const act = () => leaseAgreement.connect(lessee).extendLease(leaseId, 3 * thirtyOneDaysInSeconds);

      // Assert
      await expect(act()).to.be.revertedWith("[Lease Agreement] Maximum extensions reached");
    });
  });

  describe("setDueDate", function () {
    it("Should set due date and emit DueDateChanged event", async function () {
      // Arrange
      const leaseId = 0;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );

      // Act
      const act = () => leaseAgreement.connect(deedOwner).setDueDate(leaseId, startDate + 2 * thirtyOneDaysInSeconds);

      // Assert
      await expect(act()).to.emit(leaseAgreement, "DueDateChanged");
      expect((await leaseAgreement.leases(0)).dates.rentDueDate).to.equal(startDate + 2 * thirtyOneDaysInSeconds);
    });

    it("Should revert if caller isn't lessor", async function () {
      // Arrange
      const leaseId = 0;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );

      // Act
      const act = () => leaseAgreement.connect(lessee).setDueDate(leaseId, startDate + 2 * thirtyOneDaysInSeconds);

      // Assert
      await expect(act()).to.be.revertedWith("[Lease Agreement] Only the Lessor can set due date");
    });

    it("Should revert if new rent date isn't valid", async function () {
      // Arrange
      const leaseId = 0;
      const propertyTokenId = 1;
      const latePayementFee = 10;
      const gracePeriod = 5;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate,
          endDate,
          rentAmount,
          depositAmount,
          propertyTokenId,
          latePayementFee,
          gracePeriod,
        );

      // Act
      const act = () => leaseAgreement.connect(deedOwner).setDueDate(leaseId, startDate + thirtyOneDaysInSeconds / 2);

      // Assert
      await expect(act()).to.be.revertedWith(
        "[Lease Agreement] New rent due date must be at least a month after current one",
      );
    });
  });
});
