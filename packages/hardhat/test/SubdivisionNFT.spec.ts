// How to handle enums insolidity testing?
import { expect } from "chai";
import { ethers } from "hardhat";
import { SubdivisionNFT, DeedNFT } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("SubdivisionNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  //   let contractOwner: SignerWithAddress;
  let subNFT: SubdivisionNFT;
  let deedNFT: DeedNFT;
  let contractOwner: SignerWithAddress;
  let deedOwner: SignerWithAddress;
  let subOwner: SignerWithAddress;

  beforeEach(async () => {
    [contractOwner, deedOwner, subOwner] = await ethers.getSigners();
    const subNFTFactory = await ethers.getContractFactory("SubdivisionNFT");
    const deedNFTFactory = await ethers.getContractFactory("DeedNFT");
    deedNFT = (await deedNFTFactory.connect(contractOwner).deploy()) as DeedNFT;
    await deedNFT.deployed();
    subNFT = (await subNFTFactory.deploy("uri", deedNFT.address)) as SubdivisionNFT;
    await subNFT.deployed();
    //This deed id will be 1
    await deedNFT.connect(contractOwner).mintAsset(deedOwner.address, "uri", "House", "0");
    await deedNFT.connect(contractOwner).mintAsset(subOwner.address, "uri", "House", "0");
  });
  describe("mintSubdivision", function () {
    it("Should mint a subdivisionNFT to the designated address", async function () {
      //SubNFT minted with tokenID 1
      await subNFT.connect(deedOwner).mintSubdivision(subOwner.address, 1, 5);
      //SubNFT minted with tokenID 2
      await subNFT.connect(deedOwner).mintSubdivision(subOwner.address, 1, 8);

      expect(await subNFT.balanceOf(subOwner.address, 1)).to.equal(5);
      expect(await subNFT.balanceOf(subOwner.address, 2)).to.equal(8);
    });
    it("Should revert if caller isn't owner", async function () {
      //SubNFT minted with tokenID 1
      await expect(subNFT.connect(deedOwner).mintSubdivision(subOwner.address, 2, 5)).to.be.revertedWith(
        "Must be the owner of the parent deed",
      );
    });
    it("Should revert if asset type isn't land(0) or estate(1)", async function () {
      //0 and 2 should work (land or estate)
      //1 and 3 should revert (commercial equipment and vehicle)
      //token id will be 3
      await deedNFT.connect(contractOwner).mintAsset(deedOwner.address, "uri", "Vehicle", "1");
      //token id will be 4
      await deedNFT.connect(contractOwner).mintAsset(deedOwner.address, "uri", "Equipment", "3");
      //SubNFT minted with tokenID 1
      await expect(subNFT.connect(deedOwner).mintSubdivision(subOwner.address, 3, 5)).to.be.revertedWith(
        "Parent deed must be land or estate",
      );
      await expect(subNFT.connect(deedOwner).mintSubdivision(subOwner.address, 4, 5)).to.be.revertedWith(
        "Parent deed must be land or estate",
      );
    });
  });
  describe("mintBatch", function () {
    it("Should mint a subdivisionNFT to all the designated addresses", async function () {
      //SubNFT minted with tokenID 1
      await subNFT.connect(deedOwner).batchMint([subOwner.address, deedOwner.address], 1, 1);
      expect(await subNFT.balanceOf(deedOwner.address, 1)).to.equal(1);
      expect(await subNFT.balanceOf(subOwner.address, 1)).to.equal(1);
    });
    it("Should revert if caller isn't owner", async function () {
      //SubNFT DeedNFT with token 2 owned by subOwner but called by deedOwner, should revert
      await expect(subNFT.connect(deedOwner).batchMint([subOwner.address, deedOwner.address], 2, 5)).to.be.revertedWith(
        "Must be the owner of the parent deed",
      );
    });
    it("Should revert if asset type isn't land(0) or estate(1)", async function () {
      //0 and 2 should work (land or estate)
      //1 and 3 should revert (commercial equipment and vehicle)
      //token id will be 3
      await deedNFT.connect(contractOwner).mintAsset(deedOwner.address, "uri", "Vehicle", "1");
      //token id will be 4
      await deedNFT.connect(contractOwner).mintAsset(deedOwner.address, "uri", "Equipment", "3");
      //SubNFT minted with tokenID 1
      await expect(subNFT.connect(deedOwner).batchMint([deedOwner.address, subOwner.address], 3, 5)).to.be.revertedWith(
        "Parent deed must be land or estate",
      );
      await expect(subNFT.connect(deedOwner).batchMint([subOwner.address, deedOwner.address], 4, 5)).to.be.revertedWith(
        "Parent deed must be land or estate",
      );
    });
  });
  describe("getParentDeed", function () {
    it("Should return the right parentDeedID for a specific subToken id", async function () {
      //SubNFT minted with tokenID 1
      await subNFT.connect(subOwner).mintSubdivision(subOwner.address, 2, 5);
      expect(await subNFT.getParentDeed(1)).to.equal(2);
    });
  });
  describe("burnSubdivision", function () {
    it("Should burn the right amount of subdivision NFTs of the right account", async function () {
      //SubNFT minted with tokenID 1
      await subNFT.connect(subOwner).mintSubdivision(subOwner.address, 2, 5);
      expect(await subNFT.balanceOf(subOwner.address, 1)).to.equal(5);
      await subNFT.connect(subOwner).burnSubdivision(subOwner.address, 1, 1);
      expect(await subNFT.balanceOf(subOwner.address, 1)).to.equal(4);
      await subNFT.connect(subOwner).burnSubdivision(subOwner.address, 1, 3);
      expect(await subNFT.balanceOf(subOwner.address, 1)).to.equal(1);
    });
    it("Should burn the right amount of subdivision NFTs", async function () {
      //SubNFT minted with tokenID 1
      await subNFT.connect(subOwner).mintSubdivision(subOwner.address, 2, 5);
      await expect(subNFT.connect(deedOwner).burnSubdivision(subOwner.address, 1, 1)).to.be.revertedWith(
        "Must own this subNFT to burn it",
      );
    });
    it("Should burn from the right account if multiple accounts have same subNFT", async function () {
      await subNFT.connect(deedOwner).batchMint([subOwner.address, deedOwner.address], 1, 3);
      expect(await subNFT.balanceOf(deedOwner.address, 1)).to.equal(3);
      expect(await subNFT.balanceOf(subOwner.address, 1)).to.equal(3);
      await subNFT.connect(subOwner).burnSubdivision(subOwner.address, 1, 2);
      expect(await subNFT.balanceOf(deedOwner.address, 1)).to.equal(3);
      expect(await subNFT.balanceOf(subOwner.address, 1)).to.equal(1);
    });
    it("Should revert if sender isn't owner of subNFT,even if his balance of this tokenID > 0", async function () {
      await subNFT.connect(deedOwner).batchMint([subOwner.address, deedOwner.address], 1, 3);
      expect(await subNFT.balanceOf(deedOwner.address, 1)).to.equal(3);
      expect(await subNFT.balanceOf(subOwner.address, 1)).to.equal(3);
      await expect(subNFT.connect(subOwner).burnSubdivision(deedOwner.address, 1, 2)).to.be.revertedWith(
        "Sender must be owner of specified account",
      );
    });
  });
});
