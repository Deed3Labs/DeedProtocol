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
  let agent: SignerWithAddress;
  let deedOwner: SignerWithAddress;
  let subOwner: SignerWithAddress;
  let leaseToken: TokenMock;

  beforeEach(async () => {
    [contractOwner, deedOwner, subOwner, lessee, agent] = await ethers.getSigners();
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
  describe.only("createLease", function () {
    it("Should create a new lease with the right values", async function () {
      await leaseAgreement.connect(deedOwner).createLease(lessee.address, 1000, 10000000, 1000, 400, 1);
    });
  });
});
