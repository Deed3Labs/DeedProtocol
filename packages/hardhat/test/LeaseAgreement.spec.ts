// How to handle enums insolidity testing?
import { expect } from "chai";
import { ethers } from "hardhat";
import { SubdivisionNFT, DeedNFT, LeaseNFT, LeaseAgreement, TokenMock, DepositManager } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("LeaseAgreement", function () {
  // We define a fixture to reuse the same setup in every test.
  //   let contractOwner: SignerWithAddress;
  let subNFT: SubdivisionNFT;
  let deedNFT: DeedNFT;
  let leaseNFT: LeaseNFT;
  let depositManager: DepositManager;
  let leaseAgreement: LeaseAgreement;
  let contractOwner: SignerWithAddress;
  let lessee: SignerWithAddress;
  let address0: SignerWithAddress;
  let agent: SignerWithAddress;
  let deedOwner: SignerWithAddress;
  let subOwner: SignerWithAddress;
  let leaseToken: TokenMock;
  const initialLesseeBalance = 10000;
  //August 18 2023 timestamp
  let startDate: number;
  //August 18 2024 timestamp
  let endDate: number;
  const rentAmount = 1500;
  const depositAmount = 400;
  const thirtyOneDaysInSeconds = 2678400;
  const oneDayInSeconds = 86400;
  beforeEach(async () => {
    [contractOwner, deedOwner, agent, subOwner, lessee] = await ethers.getSigners();
    address0 = await ethers.getSigner(ethers.constants.AddressZero);
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
    await deedNFT.connect(contractOwner).mintAsset(deedOwner.address, "uri", "House", 0);
    await subNFT.connect(deedOwner).mintSubdivision(subOwner.address, 1, 1);
    const depositMAnagerFactory = await ethers.getContractFactory("DepositManager");
    depositManager = (await depositMAnagerFactory
      .connect(contractOwner)
      .deploy(leaseAgreement.address, leaseToken.address)) as DepositManager;
    await depositManager.deployed();
    await leaseAgreement.connect(contractOwner).setDepositManager(depositManager.address);
  });
  describe("createLease", function () {
    it("Should create a new lease with the right values", async function () {
      //Act
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      //Assert
      expect(await leaseNFT.ownerOf(0)).to.equal(deedOwner.address);
      const lease = await leaseAgreement.leases(0);
      expect(lease.lessor).to.equal(deedOwner.address);
      expect(lease.lessee).to.equal(lessee.address);
      expect(lease.rentAmount).to.equal(rentAmount);
      expect(lease.propertyTokenId).to.equal(1);
      //TODO: Test dates
    });
    it("Should revert if end date before start date", async function () {
      //Assert
      await expect(
        leaseAgreement.connect(deedOwner).createLease(lessee.address, 10000000, 1000, 1000, 400, 1, 10, 5),
      ).to.be.revertedWith("LeaseAgreement: Invalid start and end dates");
    });
    it("Should revert if end date and start date interval less than 30 days", async function () {
      //Arrange
      const lessThanThirtyDays = 2592000;
      //Assert
      await expect(
        leaseAgreement
          .connect(deedOwner)
          .createLease(lessee.address, 1000, 1000 + lessThanThirtyDays, 1000, 400, 1, 10, 5),
      ).to.be.revertedWith("LeaseAgreement: End date and start date should be 30 days appart");
    });
    it("Should revert if caller isn't owner of deed", async function () {
      //Assert
      await expect(
        leaseAgreement.connect(subOwner).createLease(lessee.address, 1000, 1000000000, 1000, 400, 1, 10, 5),
      ).to.be.revertedWith("LeaseAgreement: Lessor must own the property NFT");
    });
  });
  describe("setAgent", function () {
    it("Should set agent and emit AgentSet event", async function () {
      //Arrange
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      expect((await leaseAgreement.leases(0)).agent).to.equal(ethers.constants.AddressZero);
      //Act
      expect(await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5)).to.emit(leaseAgreement, "AgentSet");
      //Assert
      expect((await leaseAgreement.leases(0)).agent).to.equal(agent.address);
      expect((await leaseAgreement.leases(0)).agentPercentage).to.equal(5);
    });
    it("Should revert if caller isn't lessor", async function () {
      //Arrange
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);

      //Assert
      await expect(leaseAgreement.connect(subOwner).setAgent(0, agent.address, 5)).to.be.rejectedWith(
        "Only lessor can set the agent",
      );
    });
    it("Should revert if percentage isn't valid", async function () {
      //Arrange
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      //Assert
      await expect(leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 101)).to.be.rejectedWith(
        "Invalid agent percentage",
      );
    });
  });
  describe("removeAgent", function () {
    it("Should set agent address to 0 and emit AgentRemoved event", async function () {
      //Arrange
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
      //Assert
      expect((await leaseAgreement.leases(0)).agent).to.equal(agent.address);
      expect((await leaseAgreement.leases(0)).agentPercentage).to.equal(5);
      //Act
      await expect(leaseAgreement.connect(deedOwner).removeAgent(0)).to.emit(leaseAgreement, "AgentRemoved");
      //Assert
      expect((await leaseAgreement.leases(0)).agent).to.equal(ethers.constants.AddressZero);
    });
    it("Should revert if caller isn't lessor", async function () {
      //Arrange
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
      //Assert
      await expect(leaseAgreement.connect(subOwner).removeAgent(0)).to.be.rejectedWith(
        "Only lessor or agent can remove the agent",
      );
    });
  });
  describe("submitDeposit", function () {
    it("Should transfer the deposit from paymentToken to this contract address", async function () {
      //Arrange
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      //Act
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Assert
      const depositManagerLeaseBalance = await depositManager.leaseDeposits(0);
      expect(depositManagerLeaseBalance).to.equal(depositAmount);
      expect(await leaseToken.balanceOf(depositManager.address)).to.equal(depositAmount);
      expect(await leaseToken.balanceOf(lessee.address)).to.equal(initialLesseeBalance - depositAmount);
    });
    it("Should revert if caller isn't lessee", async function () {
      //Arramge
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
      //Assert
      await expect(leaseAgreement.connect(deedOwner).submitDeposit(0)).to.be.rejectedWith(
        "Only the lessee can submit the deposit",
      );
    });
    it("Should revert if deposit already paid", async function () {
      //Arrange
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Assert
      await expect(leaseAgreement.connect(lessee).submitDeposit(0)).to.be.rejectedWith("Security deposit already paid");
    });
    it("Should revert if deposit amount bigger than sender balance", async function () {
      //Arrange
      await leaseAgreement.connect(deedOwner).createLease(lessee.address, 1000, 10000000, 1000, 400000, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
      //Assert
      await expect(leaseAgreement.connect(lessee).submitDeposit(0)).to.be.rejectedWith(
        "Balance of sender lower than security deposit",
      );
    });
  });
  describe("calculateRentPaymentInfo", function () {
    it("Should return the right calculatedRentAmount with extra fee if late", async function () {
      //Arrange
      //This creates a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);

      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds * 3);
      //Act
      const info = await leaseAgreement.connect(lessee)._calculateRentPaymentInfo(0);
      //Assert
      expect(info.rentAmount).to.equal(1650);
      expect(info.unpaidMonths).to.equal(3);
      //2 months unpaid * 1500 + one late month fee 1650 (fee 10% of 1500) = 4650
      expect(info.totalBalance).to.equal(1650 * 3);
    });
    //Note: For each test that changes the time value, the next test will have a startDate equal to the latest timestamp in the previous test
    //Because beforeEach hook is called and startDate and endDate are set at this moment;
    it("Should return the right calculatedRentAmount without any fee if on time", async function () {
      //Arrange
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);

      //Mines new block with timestamp increased, in this case 15 days
      await time.increase(thirtyOneDaysInSeconds / 2);
      //Act
      const info = await leaseAgreement.connect(lessee)._calculateRentPaymentInfo(0);
      //Assert
      expect(info.rentAmount).to.equal(1500);
      expect(info.unpaidMonths).to.equal(0);
      expect(info.totalBalance).to.equal(1500);
    });
  });
  describe("payRent", function () {
    it("Should transfer the right calculatedRentAmount to the contract and adjust rentDueDate", async function () {
      const agentPercentage = 10;
      //Arrange
      //This creates a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds / 15);
      const totalExpectedBalance = 1500;
      await leaseToken.connect(lessee).approve(leaseAgreement.address, totalExpectedBalance);
      //Act
      await leaseAgreement.connect(lessee).payRent(0, totalExpectedBalance);
      //Assert
      const lease = await leaseAgreement.leases(0);
      const depositManagerLeaseBalance = await depositManager.leaseDeposits(0);
      expect(lease.dates.rentDueDate).to.be.greaterThanOrEqual(startDate + 2 * 30 * oneDayInSeconds);
      expect(depositManagerLeaseBalance).to.equal(totalExpectedBalance + depositAmount);
      expect(await leaseToken.balanceOf(depositManager.address)).to.equal(totalExpectedBalance + depositAmount);
    });
    it("Should transfer the right calculatedRentAmount to the contract and adjust rentDueDate but with late payment", async function () {
      //Arrange
      const agentPercentage = 10;
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds * 3);
      const totalExpectedBalance = 1650 * 3;
      await leaseToken.connect(lessee).approve(leaseAgreement.address, totalExpectedBalance);
      //Act
      await leaseAgreement.connect(lessee).payRent(0, totalExpectedBalance);
      const lease = await leaseAgreement.leases(0);
      //Assert
      const depositManagerLeaseBalance = await depositManager.leaseDeposits(0);
      expect(depositManagerLeaseBalance).to.equal(totalExpectedBalance + depositAmount);
      expect(await leaseToken.balanceOf(depositManager.address)).to.equal(totalExpectedBalance + depositAmount);
      expect(lease.dates.rentDueDate).to.be.greaterThanOrEqual(startDate + 4 * 30 * oneDayInSeconds);
    });
    it("Should revert if sender isn't lessee", async function () {
      //Arrange
      const agentPercentage = 10;
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds * 4 + 15 * oneDayInSeconds);
      const totalExpectedBalance = 6150;
      // currentTime = await time.latest();
      // console.log("Time after time increase: " + currentTime);
      await leaseToken.connect(deedOwner).approve(leaseAgreement.address, totalExpectedBalance);
      //Act/assert
      expect(leaseAgreement.connect(deedOwner).payRent(0, totalExpectedBalance)).to.be.revertedWith(
        "Only the lessee can pay rent",
      );
    });
    it("Should revert if deposit isn't paid yet", async function () {
      //Arrange
      const agentPercentage = 10;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await time.increase(thirtyOneDaysInSeconds * 4 + 15 * oneDayInSeconds);
      const totalExpectedBalance = 6150;
      await leaseToken.connect(lessee).approve(leaseAgreement.address, totalExpectedBalance);
      //Assert
      expect(leaseAgreement.connect(lessee).payRent(0, totalExpectedBalance)).to.be.revertedWith(
        "Security deposit must be paid first",
      );
    });
    it("Should revert if timestamp outside of lease duration", async function () {
      //Arrange
      const agentPercentage = 10;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await time.increase(thirtyOneDaysInSeconds * 13);
      const totalExpectedBalance = 6150;
      await leaseToken.connect(lessee).approve(leaseAgreement.address, totalExpectedBalance);
      //Assert
      expect(leaseAgreement.connect(lessee).payRent(0, totalExpectedBalance)).to.be.revertedWith(
        "Outside of lease duration",
      );
    });
    it("Should revert if amount paid is less than total balance", async function () {
      //Arrange
      const agentPercentage = 10;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await time.increase(thirtyOneDaysInSeconds * 13);
      const totalExpectedBalance = 6150;
      await leaseToken.connect(lessee).approve(leaseAgreement.address, totalExpectedBalance);
      //Assert
      expect(leaseAgreement.connect(lessee).payRent(0, totalExpectedBalance - 500)).to.be.revertedWith(
        "Insufficient amount for rent balance payment",
      );
    });
  });
  describe("distributeRent", function () {
    it("Should distribute the rentAmount to the lessor and agent", async function () {
      //Arrange
      const agentPercentage = 10;
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds);
      const totalExpectedBalance = 1500;
      await leaseToken.connect(lessee).approve(leaseAgreement.address, totalExpectedBalance);
      await leaseAgreement.connect(lessee).payRent(0, totalExpectedBalance);

      //Act
      expect(await leaseAgreement.connect(deedOwner)._distributeRent(0, totalExpectedBalance)).to.emit(
        leaseAgreement,
        "RentDistributed",
      );
      //Assert
      const agentAmount = 0.1 * totalExpectedBalance;
      expect(await leaseToken.balanceOf(deedOwner.address)).to.equal(totalExpectedBalance - agentAmount);
      expect(await leaseToken.balanceOf(agent.address)).to.equal(agentAmount);
    });
    it("Should revert if sender not lessor or agent", async function () {
      const agentPercentage = 10;
      //Arrange
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds);
      const totalExpectedBalance = 1500;
      await leaseToken.connect(lessee).approve(leaseAgreement.address, totalExpectedBalance);
      await leaseAgreement.connect(lessee).payRent(0, totalExpectedBalance);
      //Assert
      await expect(leaseAgreement.connect(lessee)._distributeRent(0, totalExpectedBalance)).to.be.revertedWith(
        "Error: sender must be lessor or agent",
      );
    });
    it("Should revert if amount to distribute greater than contract balance", async function () {
      //Arrange
      const agentPercentage = 10;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds);
      const totalExpectedBalance = 1500;
      await leaseToken.connect(lessee).approve(leaseAgreement.address, totalExpectedBalance);
      await leaseAgreement.connect(lessee).payRent(0, totalExpectedBalance);
      await leaseAgreement.connect(deedOwner)._distributeRent(0, totalExpectedBalance);
      //Assert
      await expect(leaseAgreement.connect(deedOwner)._distributeRent(0, totalExpectedBalance + 1)).to.be.revertedWith(
        "Error: amount to distribute greater than contract balance",
      );
    });
  });
  describe("terminateLease", function () {
    it("Should end the lease and distribute the remaining balance, with lessee receiving deposit", async function () {
      //Arrange
      const agentPercentage = 10;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds);
      const totalExpectedBalance = 1500;
      await leaseToken.connect(lessee).approve(leaseAgreement.address, totalExpectedBalance);
      await leaseAgreement.connect(lessee).payRent(0, totalExpectedBalance);
      expect(await leaseNFT.ownerOf(0)).to.equal(deedOwner.address);
      expect(await leaseToken.balanceOf(lessee.address)).to.equal(
        initialLesseeBalance - totalExpectedBalance - depositAmount,
      );
      //Act
      expect(await leaseAgreement.connect(deedOwner).terminateLease(0)).to.emit(leaseAgreement, "LeaseTerminated");
      //Assert
      expect(await leaseToken.balanceOf(deedOwner.address)).to.equal(totalExpectedBalance);
      expect(await leaseToken.balanceOf(lessee.address)).to.equal(initialLesseeBalance - totalExpectedBalance);
      // await leaseNFT.connect(deedOwner).burn(0);
      // await expect(leaseNFT.ownerOf(0)).to.be.revertedWith("ERC721: invalid token ID");
    });
    it("Should end the lease and distribute the remaining balance, with lessor receiving deposit if more than 3 unpaid months", async function () {
      //Arrange
      const agentPercentage = 10;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds);
      const totalExpectedBalance = 1500;
      await leaseToken.connect(lessee).approve(leaseAgreement.address, totalExpectedBalance);
      await leaseAgreement.connect(lessee).payRent(0, totalExpectedBalance);
      await time.increase(thirtyOneDaysInSeconds * 4);
      // expect(await leaseToken.balanceOf(leaseAgreement.address)).to.equal(totalExpectedBalance);
      expect(await leaseNFT.ownerOf(0)).to.equal(deedOwner.address);
      //Act
      expect(await leaseAgreement.connect(deedOwner).terminateLease(0)).to.emit(leaseAgreement, "LeaseTerminated");
      //Assert
      expect(await leaseToken.balanceOf(deedOwner.address)).to.equal(totalExpectedBalance + depositAmount);
      expect(await leaseToken.balanceOf(lessee.address)).to.equal(
        initialLesseeBalance - totalExpectedBalance - depositAmount,
      );
      const depositManagerLeaseBalance = await depositManager.leaseDeposits(0);
      expect(depositManagerLeaseBalance).to.equal(0);
      expect(await leaseToken.balanceOf(depositManager.address)).to.equal(0);

      await expect(leaseNFT.ownerOf(0)).to.be.revertedWith("ERC721: invalid token ID");
    });
    it("Should revert if sender isn't lessor", async function () {
      //Arrange
      const agentPercentage = 10;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds);
      const totalExpectedBalance = 1500;
      await leaseToken.connect(lessee).approve(leaseAgreement.address, totalExpectedBalance);
      await leaseAgreement.connect(lessee).payRent(0, totalExpectedBalance);
      //Assert
      await expect(leaseAgreement.connect(lessee).terminateLease(0)).to.be.revertedWith(
        "Only lessor can terminate the lease",
      );
    });
    it("Should revert if timestamp is before startDate", async function () {
      //Arrange
      const agentPercentage = 10;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(
          lessee.address,
          startDate + thirtyOneDaysInSeconds * 3,
          endDate,
          rentAmount,
          depositAmount,
          1,
          10,
          5,
        );
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds);
      //Assert
      await expect(leaseAgreement.connect(deedOwner).terminateLease(0)).to.be.revertedWith("Lease has not started yet");
    });
  });
  describe("extendLease", function () {
    it("Should extend the lease", async function () {
      //Arrange
      const agentPercentage = 10;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds * 11);
      //Act
      await leaseAgreement.connect(lessee).extendLease(0, 3 * thirtyOneDaysInSeconds);
      const lease = await leaseAgreement.leases(0);
      //Assert
      expect(lease.dates.endDate).to.equal(endDate + thirtyOneDaysInSeconds * 3);
      expect(lease.extensionCount).to.equal(1);
      expect(lease.rentAmount).to.equal(rentAmount * 1.03);
    });
    it("Should revert if caller isn't lessee", async function () {
      //Arrange
      const agentPercentage = 10;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds * 11);
      //Assert
      await expect(leaseAgreement.connect(deedOwner).extendLease(0, 3 * thirtyOneDaysInSeconds)).to.be.revertedWith(
        "Only the lessee can extend the lease",
      );
    });
    it("Should revert if called in invalid period", async function () {
      //Arrange
      const agentPercentage = 10;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds * 4);
      //Assert
      await expect(leaseAgreement.connect(lessee).extendLease(0, 3 * thirtyOneDaysInSeconds)).to.be.revertedWith(
        "Extension can only be requested in the last 45 days",
      );
    });
    it("Should revert if 2 extensions were already called", async function () {
      //Arrange
      const agentPercentage = 10;
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds * 11);
      await leaseAgreement.connect(lessee).extendLease(0, thirtyOneDaysInSeconds);
      await time.increase(thirtyOneDaysInSeconds * 2);
      await leaseAgreement.connect(lessee).extendLease(0, thirtyOneDaysInSeconds);
      await time.increase(thirtyOneDaysInSeconds);
      //Assert
      await expect(leaseAgreement.connect(lessee).extendLease(0, 3 * thirtyOneDaysInSeconds)).to.be.revertedWith(
        "Maximum extensions reached",
      );
    });
  });
  describe("setDueDate", function () {
    it("Should set due date and emit DueDateChanged event", async function () {
      //Arrange
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      //Act
      expect(await leaseAgreement.connect(deedOwner).setDueDate(0, startDate + 2 * thirtyOneDaysInSeconds)).to.emit(
        leaseAgreement,
        "DueDateChanged",
      );
      //Assert
      expect((await leaseAgreement.leases(0)).dates.rentDueDate).to.equal(startDate + 2 * thirtyOneDaysInSeconds);
    });
    it("Should revert if caller isn't lessor", async function () {
      //Arrange
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);

      //Assert
      await expect(
        leaseAgreement.connect(lessee).setDueDate(0, startDate + 2 * thirtyOneDaysInSeconds),
      ).to.be.revertedWith("Only lessor can set due date");
    });
    it("Should revert if new rent date isn't valid", async function () {
      //Arrange
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10, 5);
      //Assert
      await expect(
        leaseAgreement.connect(deedOwner).setDueDate(0, startDate + thirtyOneDaysInSeconds / 2),
      ).to.be.revertedWith("New rent due date must be at least a month after current one");
    });
  });
});
