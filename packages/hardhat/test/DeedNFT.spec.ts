// How to handle enums insolidity testing?
import { expect } from "chai";
import { ethers } from "hardhat";
import { AccessManager, AccessManager__factory, DeedNFT, DeedNFT__factory } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("DeedNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  let deployer: SignerWithAddress;
  let deedOwner: SignerWithAddress;
  let newMinter: SignerWithAddress;
  let deedNFT: DeedNFT;
  let accessManager: AccessManager;

  beforeEach(async () => {
    [deployer, deedOwner, newMinter] = await ethers.getSigners();

    const deedNFTFactory = new DeedNFT__factory(deployer);
    const accessManagerFactory = new AccessManager__factory(deployer);

    accessManager = await accessManagerFactory.deploy(deployer.address);
    deedNFT = await deedNFTFactory.connect(deployer).deploy(accessManager.address);

    await deedNFT.deployed();
  });

  describe("mintAsset", function () {
    it("Should mint a deedNFT asset to the designated address", async function () {
      // Here, 0 is the value for first type of asset(Land) AssetType{Land,Vehicle,Estate}
      expect(await deedNFT.mintAsset(deedOwner.address, "0x", 0, "12 000 fake addy")).to.emit(deedNFT, "DeedMinted");
      // subNFT =await subNFTFactory.connect(user).deploy("uri", "0"))
      const deedInfo = await deedNFT.getDeedInfo(1);
      expect(await deedNFT.ownerOf(1)).to.equal(deedOwner.address);

      expect(deedInfo.ipfsDetailsHash).to.equal("0x");
      expect(deedInfo.assetType).to.equal(0);
      expect(deedInfo.deedAddress).to.equal("12 000 fake addy");
    });
  });

  describe("addValidator", function () {
    it("Should grant validator role to designated address", async function () {
      await accessManager.connect(deployer).addValidator(newMinter.address);
      await deedNFT.mintAsset(deedOwner.address, "0x", 0, "12 000 fake addy");
      // Contract owner should still be able to mint since we only added a minter
      await deedNFT.mintAsset(deedOwner.address, "0x", 0, "12 000 fake addy");
      expect(await deedNFT.ownerOf(1)).to.equal(deedOwner.address);
      expect(await deedNFT.balanceOf(deedOwner.address)).to.equal(2);
    });

    it("Should revert if caller doesn't have admin role", async function () {
      await expect(accessManager.connect(deedOwner).addValidator(newMinter.address)).to.be.reverted;
    });
  });

  describe("removeMinter", function () {
    it("Should remove minter role from designated address", async function () {
      await accessManager.connect(deployer).removeValidator(deployer.address);
      expect(deedNFT.mintAsset(deedOwner.address, "0x", 0, "12 000 fake addy")).to.be.revertedWith(
        "AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
      );

      it("Should revert if caller doesn't have admin role", async function () {
        await expect(accessManager.connect(deedOwner).addValidator(newMinter.address)).to.be.reverted;
      });
    });
  });

  describe("canSubdivide", function () {
    it("Should verify if an asset (deedNFT) can be subdivided", async function () {
      // Only land or estate can subdivide
      // 0 = land
      // NFT tokenID will be 1
      await deedNFT.mintAsset(deedOwner.address, "0x", 0, "12 000 fake addy");
      // 2 = estate
      // NFT tokenID will be 2
      await deedNFT.mintAsset(deedOwner.address, "0x", 2, "12 000 fake addy");
      // 1 = vehicle
      // NFT tokenID will be 3
      await deedNFT.mintAsset(deedOwner.address, "0x", 1, "12 000 fake addy");
      // 3 = commercial equipment
      // NFT tokenID will be 4
      await deedNFT.mintAsset(deedOwner.address, "0x", 3, "12 000 fake addy");
      expect(await deedNFT.canSubdivide(1)).to.be.true;
      expect(await deedNFT.canSubdivide(2)).to.be.true;
      expect(await deedNFT.canSubdivide(3)).to.be.false;
      expect(await deedNFT.canSubdivide(4)).to.be.false;
    });
  });
  describe("setAssetType", function () {
    it("Should set the asset type of a deedNFT", async function () {
      // 0 = land
      // NFT tokenID will be 1
      await deedNFT.mintAsset(deedOwner.address, "0x", 0, "12 000 fake addy");
      await deedNFT.connect(deedOwner).setAssetType(1, 2);
      const deed = await deedNFT.getDeedInfo(1);
      expect(deed.assetType).to.equal(2);
    });

    it("Should revert if caller isn't owner", async function () {
      // 0 = land
      // NFT tokenID will be 1
      await deedNFT.mintAsset(deedOwner.address, "0x", 0, "12 000 fake addy");
      await expect(deedNFT.connect(newMinter).setAssetType(1, 2)).to.be.revertedWith(
        "[DeedNFT] Must be owner of the Deed with id 1",
      );
    });
  });
  describe("setIpfsHash", function () {
    it("Should set the IpfsHash of a deedNFT", async function () {
      // 0 = land
      // NFT tokenID will be 1
      await deedNFT.mintAsset(deedOwner.address, "0x", 0, "12 000 fake addy");
      await deedNFT.connect(deedOwner).setIpfsDetailsHash(1, "0xad");
      const deed = await deedNFT.getDeedInfo(1);
      expect(deed.ipfsDetailsHash).to.equal("0xad");
    });

    it("Should revert if caller isn't owner", async function () {
      // 0 = land
      // NFT tokenID will be 1
      await deedNFT.mintAsset(deedOwner.address, "0x", 0, "12 000 fake addy");
      await expect(deedNFT.connect(newMinter).setIpfsDetailsHash(1, "0x")).to.be.revertedWith(
        "[DeedNFT] Must be owner of the Deed with id 1",
      );
    });
  });
  describe("setPrice", function () {
    it("Should set the buy price of a deedNFT", async function () {
      const newDeedPrice = 1000000;
      // 0 = land
      // NFT tokenID will be 1
      await deedNFT.mintAsset(deedOwner.address, "0x", 0, "12 000 fake addy");
      await deedNFT.connect(deedOwner).setPrice(1, newDeedPrice);
      const deed = await deedNFT.getDeedInfo(1);
      expect(deed.price).to.equal(newDeedPrice);
    });

    it("Should revert if caller isn't owner", async function () {
      const newDeedPrice = 1000000;
      // 0 = land
      // NFT tokenID will be 1
      await deedNFT.mintAsset(deedOwner.address, "0x", 0, "12 000 fake addy");
      await expect(deedNFT.connect(newMinter).setPrice(1, newDeedPrice)).to.be.revertedWith(
        "[DeedNFT] Must be owner of the Deed with id 1",
      );
    });
  });
  describe("setAssetValidation", function () {
    it("Should set a new minted deedNFT to valid", async function () {
      accessManager.connect(deployer).addValidator(newMinter.address);
      // 0 = land
      // NFT tokenID will be 1
      await deedNFT.mintAsset(deedOwner.address, "0x", 0, "12 000 fake addy");
      await deedNFT.connect(newMinter).setAssetValidation(1, true);
      const deed = await deedNFT.getDeedInfo(1);
      expect(deed.isValidated).to.equal(true);
    });

    it("Should revert if caller isn't owner", async function () {
      // 0 = land
      // NFT tokenID will be 1
      await deedNFT.mintAsset(deedOwner.address, "0x", 0, "12 000 fake addy");
      await expect(deedNFT.connect(newMinter).setAssetValidation(1, true)).to.be.revertedWith(
        "[AccessManagement] Only the validator can interact",
      );
    });
  });
  describe("burn", function () {
    it("Should burn the deedNFT", async function () {
      accessManager.connect(deployer).addValidator(newMinter.address);
      // 0 = land
      // NFT tokenID will be 1
      await deedNFT.mintAsset(deedOwner.address, "0x", 0, "12 000 fake addy");
      await deedNFT.connect(deedOwner).burn(1);
      await expect(deedNFT.ownerOf(1)).to.be.revertedWith("ERC721: invalid token ID");
    });

    it("Should revert if caller isn't owner", async function () {
      // 0 = land
      // NFT tokenID will be 1
      await deedNFT.mintAsset(deedOwner.address, "0x", 0, "12 000 fake addy");
      await expect(deedNFT.connect(newMinter).burn(1)).to.be.revertedWith(
        "[DeedNFT] Must be owner of the Deed with id 1",
      );
    });
  });
});
