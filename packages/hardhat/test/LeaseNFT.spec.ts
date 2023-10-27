import { expect } from "chai";
import { ethers } from "hardhat";
import { AccessManager__factory, LeaseNFT, LeaseNFT__factory } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("LeaseNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  let contractOwner: SignerWithAddress;
  let tokenOwner: SignerWithAddress;
  let leaseNFT: LeaseNFT;

  beforeEach(async () => {
    const leaseNftFactory = new LeaseNFT__factory(contractOwner);
    const accessManagerFactory = new AccessManager__factory(contractOwner);

    const accessManager = await accessManagerFactory.deploy(contractOwner.address);

    leaseNFT = await leaseNftFactory.deploy(accessManager.address);
    await leaseNFT.deployed();
  });

  describe("mintToken()", function () {
    it("Should be in the balance of designated address", async function () {
      [contractOwner] = await ethers.getSigners();
      await leaseNFT.mint(contractOwner.address, 0);
      expect(await leaseNFT.balanceOf(contractOwner.address)).to.equal(1);
      expect(await leaseNFT.ownerOf(0)).to.equal(contractOwner.address);
    });

    // it("Should revert if caller isn't contractOwner", async function () {
    //   [contractOwner, tokenOwner] = await ethers.getSigners();
    //   //await before expect here because we are expecting the revert with "Ownable: caller is not the owner"
    //   await expect(leaseNFT.connect(tokenOwner).mintToken(contractOwner.address, 2)).to.be.revertedWith(
    //     "Ownable: caller is not the owner",
    //   );
    // });
  });

  describe("burnToken()", function () {
    it("should burn token", async () => {
      [contractOwner, tokenOwner] = await ethers.getSigners();
      await leaseNFT.mint(tokenOwner.address, 2);
      expect(await leaseNFT.balanceOf(tokenOwner.address)).to.equal(1);
      await leaseNFT.connect(tokenOwner).burn(2);
      expect(await leaseNFT.balanceOf(contractOwner.address)).to.equal(0);
    });

    it("Should revert if caller isn't owner", async function () {
      [contractOwner, tokenOwner] = await ethers.getSigners();

      await leaseNFT.mint(tokenOwner.address, 2);
      expect(await leaseNFT.balanceOf(tokenOwner.address)).to.equal(1);
      await expect(leaseNFT.connect(contractOwner).burn(2)).to.be.revertedWith(
        "Only token owner can burn the leaseNFT",
      );
    });
  });
});
