import { expect } from "chai";
import { ethers } from "hardhat";
import { LeaseNFT } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("LeaseNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  let contractOwner: SignerWithAddress;
  let tokenOwner: SignerWithAddress;
  let leaseNFT: LeaseNFT;

  beforeEach(async () => {
    const leaseNftFactory = await ethers.getContractFactory("LeaseNFT");

    leaseNFT = (await leaseNftFactory.deploy()) as LeaseNFT;
    await leaseNFT.deployed();
  });
  describe("mintToken()", function () {
    it("Should be in the balance of designated address", async function () {
      [contractOwner] = await ethers.getSigners();
      await leaseNFT.mintToken(contractOwner.address, 2);
      expect(await leaseNFT.balanceOf(contractOwner.address)).to.equal(1);
    });
    it("Should revert if caller isn't contractOwner", async function () {
      [contractOwner, tokenOwner] = await ethers.getSigners();
      //await before expect here because we are expecting the revert with "Ownable: caller is not the owner"
      await expect(leaseNFT.connect(tokenOwner).mintToken(contractOwner.address, 2)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );
    });
  });
  describe("burnToken()", function () {
    it("should burn token", async () => {
      [contractOwner, tokenOwner] = await ethers.getSigners();
      await leaseNFT.mintToken(tokenOwner.address, 2);
      expect(await leaseNFT.balanceOf(tokenOwner.address)).to.equal(1);
      await leaseNFT.connect(tokenOwner).burn(2);
      expect(await leaseNFT.balanceOf(contractOwner.address)).to.equal(0);
    });
    it("Should revert if caller isn't ownerr", async function () {
      [contractOwner, tokenOwner] = await ethers.getSigners();

      await leaseNFT.mintToken(tokenOwner.address, 2);
      expect(await leaseNFT.balanceOf(tokenOwner.address)).to.equal(1);
      await expect(leaseNFT.connect(contractOwner).burn(2)).to.be.revertedWith(
        "Only token owner can burn the leaseNFT",
      );
    });
  });
});
