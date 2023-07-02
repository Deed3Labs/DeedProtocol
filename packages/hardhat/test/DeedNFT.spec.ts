// How to handle enums insolidity testing?
import { expect } from "chai";
import { ethers } from "hardhat";
import { DeedNFT } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("DeedNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  let contractOwner: SignerWithAddress;
  let deedOwner: SignerWithAddress;
  let newMinter: SignerWithAddress;
  let deedNFT: DeedNFT;

  beforeEach(async () => {
    [contractOwner, deedOwner, newMinter] = await ethers.getSigners();
    const deedNFTFactory = await ethers.getContractFactory("DeedNFT");
    deedNFT = (await deedNFTFactory.connect(contractOwner).deploy()) as DeedNFT;
    await deedNFT.deployed();
  });
  //TODO: Should revert if irrelevant URIs
  //Error already thrown if address is invalid
  describe("mintAsset", function () {
    it("Should mint a deedNFT asset to the designated address", async function () {
      // [deedOwner] = await ethers.getSigners();
      //Here, 0 is the value for first type of asset(Land) AssetType{Land,Vehicle,Estate}
      await deedNFT.mintAsset(deedOwner.address, "uri", "House", 0);
      // subNFT =await subNFTFactory.connect(user).deploy("uri", "0"))
      expect(await deedNFT.balanceOf(deedOwner.address)).to.equal(1);
      expect(await deedNFT.getTokenName(1)).to.equal("House");
      expect(await deedNFT.getAssetType(1)).to.equal(0);
      expect(await deedNFT.tokenURI(1)).to.equal("uri");
    });
    it("Should revert if caller isnt minter", async function () {
      await expect(deedNFT.connect(deedOwner).mintAsset(deedOwner.address, "uri", "House", 0)).to.be.reverted;
    });
  });
  //TODO: Is it needed?
  // describe("Setters", function () {
  //   it("Should set the Asset type for", async function () {
  //     await deedNFT.mintAsset("", "uri", "House", 0);
  //     // subNFT =await subNFTFactory.connect(user).deploy("uri", "0"))
  //     expect(await deedNFT.balanceOf(deedOwner.address)).to.equal(1);
  //     expect(await deedNFT.getTokenName(1)).to.equal("House");
  //     expect(await deedNFT.getAssetType(1)).to.equal(0);
  //     expect(await deedNFT.tokenURI(1)).to.equal("uri");
  //   });
  //   it.only("Should revert if caller isnt minter", async function () {
  //     await expect(deedNFT.connect(deedOwner).mintAsset(deedOwner.address, "uri", "House", 0)).to.be.reverted;
  //   });
  // });
  describe("addMinter", function () {
    it("Should grant minter role to designated address", async function () {
      await deedNFT.connect(contractOwner).addMinter(newMinter.address);
      await deedNFT.connect(newMinter).mintAsset(deedOwner.address, "uri", "House", 0);
      //Contract owner should still be able to mint since we only added a minter
      await deedNFT.connect(contractOwner).mintAsset(deedOwner.address, "uri", "House", 0);
      expect(await deedNFT.ownerOf(1)).to.equal(deedOwner.address);
      expect(await deedNFT.balanceOf(deedOwner.address)).to.equal(2);
    });
    it("Should revert if caller doesn't have admin role", async function () {
      await expect(deedNFT.connect(deedOwner).addMinter(newMinter.address)).to.be.reverted;
    });
  });
  describe("removeMinter", function () {
    it("Should remove minter role from designated address", async function () {
      await deedNFT.connect(contractOwner).removeMinter(contractOwner.address);
      await expect(deedNFT.connect(contractOwner).mintAsset(deedOwner.address, "uri", "House", 0)).to.be.reverted;

      it("Should revert if caller doesn't have admin role", async function () {
        await expect(deedNFT.connect(deedOwner).addMinter(newMinter.address)).to.be.reverted;
      });
    });

    describe("Can Subdivide", function () {
      it("Should verify if an asset (deedNFT) can be subdivided", async function () {
        //Only land or estate can subdivide
        //0 = land
        //NFT tokenID will be 1
        await deedNFT.mintAsset(deedOwner.address, "uri", "Field", 0);
        //2 = estate
        //NFT tokenID will be 2
        await deedNFT.mintAsset(deedOwner.address, "uri", "House", 2);
        //1 = vehicle
        //NFT tokenID will be 3
        await deedNFT.mintAsset(deedOwner.address, "uri", "Car", 1);
        //3 = commercial equipment
        //NFT tokenID will be 4
        await deedNFT.mintAsset(deedOwner.address, "uri", "Machine", 3);
        expect(await deedNFT.canSubdivide(1)).to.be.true;
        expect(await deedNFT.canSubdivide(2)).to.be.true;
        expect(await deedNFT.canSubdivide(3)).to.be.false;
        expect(await deedNFT.canSubdivide(4)).to.be.false;
      });
    });
  });
});
