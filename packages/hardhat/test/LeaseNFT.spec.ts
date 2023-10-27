import { expect } from "chai";
import { ethers } from "hardhat";
import { AccessManager__factory, LeaseNFT, LeaseNFT__factory } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("LeaseNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  let deployer: SignerWithAddress;
  let tokenOwner: SignerWithAddress;
  let leaseNFT: LeaseNFT;

  beforeEach(async () => {
    [deployer, tokenOwner] = await ethers.getSigners();
    const leaseNftFactory = new LeaseNFT__factory(deployer);
    const accessManagerFactory = new AccessManager__factory(deployer);

    const accessManager = await accessManagerFactory.deploy(deployer.address);

    leaseNFT = await leaseNftFactory.deploy(accessManager.address);
    await leaseNFT.deployed();
  });

  describe("mintToken()", function () {
    it("Should be in the balance of designated address", async function () {
      await leaseNFT.mint(deployer.address, 0);
      expect(await leaseNFT.balanceOf(deployer.address)).to.equal(1);
      expect(await leaseNFT.ownerOf(0)).to.equal(deployer.address);
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
      await leaseNFT.mint(tokenOwner.address, 2);
      expect(await leaseNFT.balanceOf(tokenOwner.address)).to.equal(1);
      await leaseNFT.connect(tokenOwner).burn(2);
      expect(await leaseNFT.balanceOf(deployer.address)).to.equal(0);
    });

    it("Should revert if caller isn't owner", async function () {
      await leaseNFT.mint(tokenOwner.address, 2);
      expect(await leaseNFT.balanceOf(tokenOwner.address)).to.equal(1);
      await expect(leaseNFT.connect(deployer).burn(2)).to.be.revertedWith(
        "Only token owner can burn the leaseNFT",
      );
    });
  });
});
