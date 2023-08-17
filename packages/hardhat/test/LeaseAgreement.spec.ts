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

  beforeEach(async () => {
    [contractOwner, deedOwner, agent, subOwner, lessee] = await ethers.getSigners();
    address0 = await ethers.getSigner(ethers.constants.AddressZero);
    const subNFTFactory = await ethers.getContractFactory("SubdivisionNFT");
    const deedNFTFactory = await ethers.getContractFactory("DeedNFT");
    deedNFT = (await deedNFTFactory.connect(contractOwner).deploy()) as DeedNFT;
    await deedNFT.deployed();
    const tokenMockFactory = ethers.getContractFactory("TokenMock");
    leaseToken = (await (await tokenMockFactory).connect(contractOwner).deploy("PaymentToken", "PTKN")) as TokenMock;
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
      await leaseAgreement.connect(deedOwner).createLease(lessee.address, 1000, 10000000, 1000, 400, 1);
      expect(await leaseNFT.ownerOf(0)).to.equal(deedOwner.address);
      const lease = await leaseAgreement.leases(0);
      expect(lease.lessor).to.equal(deedOwner.address);
      expect(lease.lessee).to.equal(lessee.address);
      expect(lease.rentAmount).to.equal(1000);
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
        leaseAgreement.connect(deedOwner).createLease(lessee.address, 10000000, 1000, 1000, 400, 1),
      ).to.be.revertedWith("LeaseAgreement: Invalid start and end dates");
    });
    it("Should revert if end date and start date interval less than 30 days", async function () {
      const lessThanThirtyDays = 2592000;
      await expect(
        leaseAgreement.connect(deedOwner).createLease(lessee.address, 1000, 1000 + lessThanThirtyDays, 1000, 400, 1),
      ).to.be.revertedWith("LeaseAgreement: End date and start date should be 30 days appart");
    });
    it("Should revert if caller isn't owner of deed", async function () {
      await expect(
        leaseAgreement.connect(subOwner).createLease(lessee.address, 1000, 1000000000, 1000, 400, 1),
      ).to.be.revertedWith("LeaseAgreement: Lessor must own the property NFT");
    });
  });
  describe("setAgent", function () {
    it("Should set agent and emit AgentSet event", async function () {
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement.connect(deedOwner).createLease(lessee.address, 1000, 10000000, 1000, 400, 1);
      expect((await leaseAgreement.leases(0)).agent).to.equal(ethers.constants.AddressZero);
      expect(await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5)).to.emit(leaseAgreement, "AgentSet");
      expect((await leaseAgreement.leases(0)).agent).to.equal(agent.address);
      expect((await leaseAgreement.leases(0)).agentPercentage).to.equal(5);
    });
    it("Should revert if caller isn't lessor", async function () {
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement.connect(deedOwner).createLease(lessee.address, 1000, 10000000, 1000, 400, 1);
      await expect(leaseAgreement.connect(subOwner).setAgent(0, agent.address, 5)).to.be.rejectedWith(
        "Only lessor can set the agent",
      );
    });
    it("Should revert if percentage isn't valid", async function () {
      //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
      //to deed tokenID1 that belongs to deedOwner
      await leaseAgreement.connect(deedOwner).createLease(lessee.address, 1000, 10000000, 1000, 400, 1);
      await expect(leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 101)).to.be.rejectedWith(
        "Invalid agent percentage",
      );
    });
    describe("removeAgent", function () {
      it("Should set agent address to 0 and emit AgentRemoved event", async function () {
        //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
        //to deed tokenID1 that belongs to deedOwner
        await leaseAgreement.connect(deedOwner).createLease(lessee.address, 1000, 10000000, 1000, 400, 1);
        await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
        expect((await leaseAgreement.leases(0)).agent).to.equal(agent.address);
        expect((await leaseAgreement.leases(0)).agentPercentage).to.equal(5);
        await expect(leaseAgreement.connect(deedOwner).removeAgent(0)).to.emit(leaseAgreement, "AgentRemoved");
        expect((await leaseAgreement.leases(0)).agent).to.equal(ethers.constants.AddressZero);
      });
      it("Should revert if caller isn't lessor", async function () {
        //This create a lease with leaseID 0,to lessee,1000 rent amount and 400 security deposit, related
        //to deed tokenID1 that belongs to deedOwner
        await leaseAgreement.connect(deedOwner).createLease(lessee.address, 1000, 10000000, 1000, 400, 1);
        await leaseAgreement.connect(deedOwner).setAgent(0, agent.address, 5);
        await expect(leaseAgreement.connect(subOwner).removeAgent(0)).to.be.rejectedWith(
          "Only lessor or agent can remove the agent",
        );
      });
    });
  });
});
