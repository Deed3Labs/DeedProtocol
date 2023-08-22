// How to handle enums insolidity testing?
import { expect } from "chai";
import { ethers } from "hardhat";
import { SubdivisionNFT, DeedNFT, LeaseNFT, LeaseAgreement, TokenMock } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("LeaseAgreement", function () {
  // We define a fixture to reuse the same setup in every test.
  //   let contractOwner: SignerWithAddress;
  let subNFT: SubdivisionNFT;
  let deedNFT: DeedNFT;
  let leaseNFT: LeaseNFT;
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
    //This deed id will be 1
    await deedNFT.connect(contractOwner).mintAsset(deedOwner.address, "uri", "House", 0);
    await subNFT.connect(deedOwner).mintSubdivision(subOwner.address, 1, 1);
  });
  describe("createLease", function () {
    it("Should create a new lease with the right values", async function () {
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10);
      expect(await leaseNFT.ownerOf(0)).to.equal(deedOwner.address);
      const lease = await leaseAgreement.leases(0);
      expect(lease.lessor).to.equal(deedOwner.address);
      expect(lease.lessee).to.equal(lessee.address);
      expect(lease.rentAmount).to.equal(rentAmount);
      expect(lease.propertyTokenId).to.equal(1);
      //TODO: Test dates
    });
    // This test works, but gets InvalidInputError: unknown account 0x000...
    // it.only("Should revert if address is 0", async function () {
    // [address0] = ethers.provider.getSigner(ethers.constants.AddressZero);

    //   await expect(
    //     leaseAgreement.connect(address0).createLease(lessee.address, 1000, 10000000, 1000, 400, 1),
    //   ).to.be.revertedWith("LeaseAgreement: Invalid lessee address");
    // });
    it("Should revert if end date before start date", async function () {
      await expect(
        leaseAgreement.connect(deedOwner).createLease(lessee.address, 10000000, 1000, 1000, 400, 1, 10),
      ).to.be.revertedWith("LeaseAgreement: Invalid start and end dates");
    });
    it("Should revert if end date and start date interval less than 30 days", async function () {
      const lessThanThirtyDays = 2592000;
      await expect(
        leaseAgreement
          .connect(deedOwner)
          .createLease(lessee.address, 1000, 1000 + lessThanThirtyDays, 1000, 400, 1, 10),
      ).to.be.revertedWith("LeaseAgreement: End date and start date should be 30 days appart");
    });
    it("Should revert if caller isn't owner of deed", async function () {
      await expect(
        leaseAgreement.connect(subOwner).createLease(lessee.address, 1000, 1000000000, 1000, 400, 1, 10),
      ).to.be.revertedWith("LeaseAgreement: Lessor must own the property NFT");
    });
  });
  describe("setAgent", function () {
    it("Should set agent and emit AgentSet event", async function () {
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10);
      expect((await leaseAgreement.leases(0)).agent).to.equal(ethers.constants.AddressZero);
      expect(await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5)).to.emit(leaseAgreement, "AgentSet");
      expect((await leaseAgreement.leases(0)).agent).to.equal(agent.address);
      expect((await leaseAgreement.leases(0)).agentPercentage).to.equal(5);
    });
    it("Should revert if caller isn't lessor", async function () {
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10);
      await expect(leaseAgreement.connect(subOwner).setAgent(0, agent.address, 5)).to.be.rejectedWith(
        "Only lessor can set the agent",
      );
    });
    it("Should revert if percentage isn't valid", async function () {
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10);
      await expect(leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 101)).to.be.rejectedWith(
        "Invalid agent percentage",
      );
    });
  });
  describe("removeAgent", function () {
    it("Should set agent address to 0 and emit AgentRemoved event", async function () {
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
      expect((await leaseAgreement.leases(0)).agent).to.equal(agent.address);
      expect((await leaseAgreement.leases(0)).agentPercentage).to.equal(5);
      await expect(leaseAgreement.connect(deedOwner).removeAgent(0)).to.emit(leaseAgreement, "AgentRemoved");
      expect((await leaseAgreement.leases(0)).agent).to.equal(ethers.constants.AddressZero);
    });
    it("Should revert if caller isn't lessor", async function () {
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
      await expect(leaseAgreement.connect(subOwner).removeAgent(0)).to.be.rejectedWith(
        "Only lessor or agent can remove the agent",
      );
    });
  });
  describe("submitDeposit", function () {
    it("Should transfer the deposit from paymentToken to this contract address", async function () {
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      expect(await leaseToken.balanceOf(leaseAgreement.address)).to.equal(depositAmount);
      expect(await leaseToken.balanceOf(lessee.address)).to.equal(initialLesseeBalance - depositAmount);
    });
    it("Should revert if caller isn't lessee", async function () {
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
      await expect(leaseAgreement.connect(deedOwner).submitDeposit(0)).to.be.rejectedWith(
        "Only the lessee can submit the deposit",
      );
    });
    it("Should revert if deposit already paid", async function () {
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      await expect(leaseAgreement.connect(lessee).submitDeposit(0)).to.be.rejectedWith("Security deposit already paid");
    });
    it("Should revert if deposit amount bigger than sender balance", async function () {
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement.connect(deedOwner).createLease(lessee.address, 1000, 10000000, 1000, 400000, 1, 10);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
      await expect(leaseAgreement.connect(lessee).submitDeposit(0)).to.be.rejectedWith(
        "Balance of sender lower than security deposit",
      );
    });
  });
  describe("calculateRentPaymentInfo", function () {
    it("Should return the right calculatedRentAmount with extra fee if late", async function () {
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);

      //Mines new block with timestamp increased, in this case 3 months
      await time.increase(thirtyOneDaysInSeconds * 3);
      const info = await leaseAgreement.connect(lessee)._calculateRentPaymentInfo(0);
      expect(info.rentAmount).to.equal(1650);
      expect(info.unpaidMonths).to.equal(3);
      //2 months unpaid * 1500 + one late month fee 1650 (fee 10% of 1500) = 4650
      expect(info.totalBalance).to.equal(4650);
    });
    //Note: For each test that changes the time value, the next test will have a startDate equal to the latest timestamp in the previous test
    //Because beforeEach hook is called and startDate and endDate are set at this moment;
    it("Should return the right calculatedRentAmount without any fee if on time", async function () {
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);

      //Mines new block with timestamp increased, in this case 15 days
      await time.increase(thirtyOneDaysInSeconds / 2);
      const info = await leaseAgreement.connect(lessee)._calculateRentPaymentInfo(0);
      expect(info.rentAmount).to.equal(1500);
      expect(info.unpaidMonths).to.equal(0);
      expect(info.totalBalance).to.equal(1500);
    });
  });
  describe.only("payRent", function () {
    it("Should transfer the right calculatedRentAmount to the lessor", async function () {
      const agentPercentage = 10;
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Mines new block with timestamp increased, in this case 3 months

      await time.increase(thirtyOneDaysInSeconds / 15);
      const totalExpectedBalance = 1500;
      const info = await leaseAgreement.connect(lessee)._calculateRentPaymentInfo(0);
      console.log(info);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, totalExpectedBalance);
      await leaseAgreement.connect(lessee).payRent(0, totalExpectedBalance);
      // expect(await leaseToken.balanceOf(leaseAgreement.address)).to.equal(totalExpectedBalance);
      expect(await leaseToken.balanceOf(deedOwner.address)).to.equal(
        ((100 - agentPercentage) / 100) * totalExpectedBalance,
      );
      expect(await leaseToken.balanceOf(agent.address)).to.equal((agentPercentage / 100) * totalExpectedBalance);
    });
    it("Should transfer the right calculatedRentAmount to the lessor and terminate if more than 3 months", async function () {
      const agentPercentage = 10;
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement
        .connect(deedOwner)
        .createLease(lessee.address, startDate, endDate, rentAmount, depositAmount, 1, 10);
      await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, agentPercentage);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, depositAmount);
      await leaseAgreement.connect(lessee).submitDeposit(0);
      //Mines new block with timestamp increased, in this case 3 months

      await time.increase(thirtyOneDaysInSeconds * 3);
      const totalExpectedBalance = 4650;
      const info = await leaseAgreement.connect(lessee)._calculateRentPaymentInfo(0);
      console.log(info);
      await leaseToken.connect(lessee).approve(leaseAgreement.address, totalExpectedBalance);
      await leaseAgreement.connect(lessee).payRent(0, totalExpectedBalance);
      // expect(await leaseToken.balanceOf(leaseAgreement.address)).to.equal(totalExpectedBalance);
      expect(await leaseToken.balanceOf(deedOwner.address)).to.equal(
        ((100 - agentPercentage) / 100) * totalExpectedBalance,
      );
    });
  });
});
