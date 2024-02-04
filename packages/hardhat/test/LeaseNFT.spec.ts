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

    // Fake lease agreement address
    await leaseNFT.connect(deployer).setLeaseAgreementAddress(deployer.address);
  });

  describe("mintToken()", function () {
    it("Should be in the balance of designated address", async function () {
      const leaseId = 1;
      await leaseNFT.connect(deployer).mint(deployer.address, leaseId);
      expect(await leaseNFT.balanceOf(deployer.address)).to.equal(1);
      expect(await leaseNFT.ownerOf(leaseId)).to.equal(deployer.address);
    });

    it("Should revert if caller isn't contractOwner", async function () {
      // Arrange
      const leaseId = 2;

      // Act
      const act = () => leaseNFT.connect(tokenOwner).mint(tokenOwner.address, leaseId);

      // Assert
      await expect(act()).to.be.revertedWith("[LeaseNFT] Only LeaseAgreement contract can mint the lease");
    });
  });

  describe("burnToken()", function () {
    it("should burn token", async () => {
      const leaseId = 2;
      await leaseNFT.connect(deployer).mint(tokenOwner.address, leaseId);
      expect(await leaseNFT.balanceOf(tokenOwner.address)).to.equal(1);
      await leaseNFT.connect(deployer).burn(leaseId);
      expect(await leaseNFT.balanceOf(tokenOwner.address)).to.equal(0);
    });

    it("Should revert if caller isn't owner", async function () {
      const leaseId = 2;
      await leaseNFT.connect(deployer).mint(tokenOwner.address, leaseId);
      expect(await leaseNFT.balanceOf(tokenOwner.address)).to.equal(1);
      await expect(leaseNFT.connect(tokenOwner).burn(leaseId)).to.be.revertedWith(
        "[LeaseNFT] Only LeaseAgreement can burn the lease",
      );
    });
  });
});
