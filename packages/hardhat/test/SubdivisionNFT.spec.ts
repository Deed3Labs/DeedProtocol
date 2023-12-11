// How to handle enums insolidity testing?
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  SubdivisionNFT,
  DeedNFT,
  SubdivisionNFT__factory,
  DeedNFT__factory,
  AccessManager__factory,
} from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("SubdivisionNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  // let contractOwner: SignerWithAddress;
  let subNFT: SubdivisionNFT;
  let deedNFT: DeedNFT;
  let deployer: SignerWithAddress;
  let deedOwner: SignerWithAddress;
  let subOwner: SignerWithAddress;

  beforeEach(async () => {
    [deployer, deedOwner, subOwner] = await ethers.getSigners();
    const subNFTFactory = new SubdivisionNFT__factory(deployer);
    const deedNFTFactory = new DeedNFT__factory(deployer);
    const accessManagerFactory = new AccessManager__factory(deployer);

    const accessManager = await accessManagerFactory.deploy(deployer.address);

    deedNFT = await deedNFTFactory.connect(deployer).deploy(accessManager.address);
    await deedNFT.deployed();

    subNFT = await subNFTFactory.deploy(deedNFT.address, accessManager.address);
    await subNFT.deployed();

    await deedNFT.connect(deployer).mintAsset(deedOwner.address, "0x", 2);
    await deedNFT.connect(deployer).mintAsset(subOwner.address, "0x", 2);
  });

  describe("mintSubdivision", function () {
    it("Should mint a subdivisionNFT to the designated address", async function () {
      // ubNFT minted with tokenID 1
      await subNFT
        .connect(deedOwner)
        .mintSubdivision({ ipfsDetailsHash: "0x", owner: subOwner.address, parentDeed: 1 });
      // ubNFT minted with tokenID 2
      await subNFT
        .connect(deedOwner)
        .mintSubdivision({ ipfsDetailsHash: "0x", owner: deedOwner.address, parentDeed: 1 });

      expect(await subNFT.balanceOf(subOwner.address, 1)).to.equal(1);
      expect(await subNFT.balanceOf(deedOwner.address, 2)).to.equal(1);
    });

    it("Should revert if caller isn't owner", async function () {
      // ubNFT minted with tokenID 1
      await expect(
        subNFT.connect(deedOwner).mintSubdivision({ ipfsDetailsHash: "0x", owner: subOwner.address, parentDeed: 2 }),
      ).to.be.revertedWith("[SubdivisionNFT] Sender must be the owner of the parent deed");
    });

    it("Should revert if asset type isn't land(0) or estate(2)", async function () {
      // and 2 should work (land or estate)
      // and 3 should revert (commercial equipment and vehicle)
      // token id will be 3
      await deedNFT.connect(deployer).mintAsset(deedOwner.address, "0x", 1);
      // token id will be 4
      await deedNFT.connect(deployer).mintAsset(deedOwner.address, "0x", 3);
      // subNFT minted with tokenID 1
      await expect(
        subNFT.connect(deedOwner).mintSubdivision({ ipfsDetailsHash: "0x", owner: subOwner.address, parentDeed: 3 }),
      ).to.be.revertedWith("[SubdivisionNFT] Parent deed must be land or estate");
      await expect(
        subNFT.connect(deedOwner).mintSubdivision({ ipfsDetailsHash: "0x", owner: subOwner.address, parentDeed: 4 }),
      ).to.be.revertedWith("[SubdivisionNFT] Parent deed must be land or estate");
    });
  });

  describe("mintBatch", function () {
    it("Should mint a subdivisionNFT to all the designated addresses", async function () {
      // subNFT minted with tokenID 1
      await subNFT.connect(deedOwner).batchMint([
        { ipfsDetailsHash: "0x", owner: subOwner.address, parentDeed: 1 },
        { ipfsDetailsHash: "0x", owner: deedOwner.address, parentDeed: 1 },
      ]);
      expect(await subNFT.balanceOf(subOwner.address, 1)).to.equal(1);
      expect(await subNFT.balanceOf(deedOwner.address, 2)).to.equal(1);
    });

    it("Should revert if caller isn't owner", async function () {
      // subNFT DeedNFT with token 2 owned by subOwner but called by deedOwner, should revert
      await expect(
        subNFT.connect(deedOwner).batchMint([
          { ipfsDetailsHash: "0x", owner: subOwner.address, parentDeed: 2 },
          { ipfsDetailsHash: "0x", owner: subOwner.address, parentDeed: 2 },
        ]),
      ).to.be.revertedWith("[SubdivisionNFT] Sender must be the owner of the parent deed");
    });

    it("Should revert if asset type isn't land(0) or estate(2)", async function () {
      // 0 and 2 should work (land or estate)
      // 1 and 3 should revert (commercial equipment and vehicle)
      // token id will be 3
      await deedNFT.connect(deployer).mintAsset(deedOwner.address, "0x", 1);
      // oken id will be 4
      await deedNFT.connect(deployer).mintAsset(deedOwner.address, "0x", 3);
      // SubNFT minted with tokenID 1
      await expect(
        subNFT.connect(deedOwner).batchMint([
          { ipfsDetailsHash: "0x", owner: subOwner.address, parentDeed: 3 },
          { ipfsDetailsHash: "0x", owner: subOwner.address, parentDeed: 3 },
        ]),
      ).to.be.revertedWith("[SubdivisionNFT] Parent deed must be land or estate");
      await expect(
        subNFT.connect(deedOwner).batchMint([
          { ipfsDetailsHash: "0x", owner: subOwner.address, parentDeed: 4 },
          { ipfsDetailsHash: "0x", owner: subOwner.address, parentDeed: 4 },
        ]),
      )
        .to.be.revertedWith("[SubdivisionNFT] Parent deed must be land or estate")
        .to.be.revertedWith("[SubdivisionNFT] Parent deed must be land or estate");
    });
  });

  describe("getParentDeed", function () {
    it("Should return the right parentDeedID for a specific subToken id", async function () {
      // ubNFT minted with tokenID 1
      await subNFT.connect(subOwner).mintSubdivision({ ipfsDetailsHash: "0x", owner: subOwner.address, parentDeed: 2 });
      expect(await subNFT.getParentDeed(1)).to.equal(2);
    });
  });

  describe("burnSubdivision", function () {
    it("Should burn the right subdivision NFT of the right account", async function () {
      const subdivisionId = 1;

      // SubNFT minted with tokenID 1
      await subNFT.connect(subOwner).mintSubdivision({ ipfsDetailsHash: "0x", owner: subOwner.address, parentDeed: 2 });
      expect(await subNFT.balanceOf(subOwner.address, subdivisionId)).to.equal(1);

      await subNFT.connect(subOwner).burnSubdivision(subdivisionId);
      expect(await subNFT.balanceOf(subOwner.address, subdivisionId)).to.equal(0);
    });

    it("Should burn the right amount of subdivision NFTs", async function () {
      // SubNFT minted with tokenID 1
      await subNFT.connect(subOwner).mintSubdivision({ ipfsDetailsHash: "0x", owner: subOwner.address, parentDeed: 2 });
      await expect(subNFT.connect(deedOwner).burnSubdivision(subOwner.address)).to.be.revertedWith(
        "[SubdivisionNFT] Sender must be owner of the subdivision to burn it",
      );
    });

    it("Should revert if sender isn't owner of subNFT,even if his balance of this tokenID > 0", async function () {
      await subNFT.connect(deedOwner).batchMint([
        { ipfsDetailsHash: "0x", owner: subOwner.address, parentDeed: 1 },
        { ipfsDetailsHash: "0x", owner: deedOwner.address, parentDeed: 1 },
      ]);
      expect(await subNFT.balanceOf(subOwner.address, 1)).to.equal(1);
      expect(await subNFT.balanceOf(deedOwner.address, 2)).to.equal(1);
      await expect(subNFT.connect(subOwner).burnSubdivision(deedOwner.address)).to.be.revertedWith(
        "[SubdivisionNFT] Sender must be owner of the subdivision to burn it",
      );
    });
  });
});
