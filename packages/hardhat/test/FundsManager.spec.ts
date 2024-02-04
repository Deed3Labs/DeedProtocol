import { ethers } from "hardhat";
import { Signer, BigNumber } from "ethers";
import { expect } from "chai";
import {
  AccessManager__factory,
  FundsManager,
  FundsManager__factory,
  TokenMock,
  TokenMock__factory,
} from "../typechain-types";

describe("FundsManager", function () {
  let deployer: Signer;

  let fundsManager: FundsManager;
  let token: TokenMock;

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();

    const tokenFactory = new TokenMock__factory(deployer);
    const accessManagerFactory = new AccessManager__factory(deployer);
    const fundStorageFactory = new FundsManager__factory(deployer);

    token = await tokenFactory.deploy("PaymentToken", "PTKN");
    const accessManager = await accessManagerFactory.deploy(deployer.getAddress());
    fundsManager = await fundStorageFactory.deploy(accessManager.address);

    await token.deployed();
    await fundsManager.deployed();
  });

  describe("store", () => {
    it("Should store funds correctly", async function () {
      // Arrange
      const amountToStore = BigNumber.from(100);
      await token.mint(deployer.getAddress(), amountToStore);
      const initialSenderBalance = await token.balanceOf(deployer.getAddress());
      const initialContractBalance = await token.balanceOf(fundsManager.address);
      const accountId = BigNumber.from(1);

      // Act
      await token.connect(deployer).approve(fundsManager.address, amountToStore);
      const act = () =>
        fundsManager.connect(deployer).store(accountId, token.address, amountToStore, deployer.getAddress());

      // Assert
      await expect(act())
        .to.emit(fundsManager, "FundsStored")
        .withArgs(
          accountId,
          token.address,
          amountToStore,
          await deployer.getAddress(),
          await deployer.getAddress(),
          amountToStore,
        );

      const storedBalance = await fundsManager.connect(deployer).balanceOf(accountId, token.address);
      expect(storedBalance).to.equal(amountToStore);

      const finalSenderBalance = await token.balanceOf(deployer.getAddress());
      const finalContractBalance = await token.balanceOf(fundsManager.address);

      expect(finalSenderBalance).to.equal(initialSenderBalance.sub(amountToStore));
      expect(finalContractBalance).to.equal(initialContractBalance.add(amountToStore));
    });

    it("Should revert when storing funds with insufficient allowance", async function () {
      // Arrange
      const amountToStore = BigNumber.from(100);
      const accountId = 1;

      // Act
      const act = () =>
        fundsManager.connect(deployer).store(accountId, token.address, amountToStore, deployer.getAddress());
      await expect(act()).to.be.revertedWith(
        `[Funds Manager] Not enough allowance for account ${accountId} and amount ${amountToStore}`,
      );
    });
  });

  describe("withdraw", () => {
    it("Should withdraw funds correctly", async function () {
      // Arrange
      const accountId = BigNumber.from(1);
      const amountToStore = BigNumber.from(100);
      await token.mint(deployer.getAddress(), amountToStore);
      await token.connect(deployer).approve(fundsManager.address, amountToStore);
      await fundsManager.connect(deployer).store(accountId, token.address, amountToStore, deployer.getAddress());

      const initialSenderBalance = await token.balanceOf(deployer.getAddress());
      const initialContractBalance = await token.balanceOf(fundsManager.address);

      const amountToWithdraw = BigNumber.from(50);

      // Act
      const act = () =>
        fundsManager.connect(deployer).withdraw(accountId, token.address, amountToWithdraw, deployer.getAddress());

      // Assert
      await expect(act())
        .to.emit(fundsManager, "FundsWithdrawn")
        .withArgs(
          accountId,
          token.address,
          amountToWithdraw,
          await deployer.getAddress(),
          await deployer.getAddress(),
          amountToStore.sub(amountToWithdraw),
        );

      const finalSenderBalance = await token.balanceOf(deployer.getAddress());
      const finalContractBalance = await token.balanceOf(fundsManager.address);

      expect(finalSenderBalance).to.equal(initialSenderBalance.add(amountToWithdraw));
      expect(finalContractBalance).to.equal(initialContractBalance.sub(amountToWithdraw));
    });

    it("Should revert when withdrawing more funds than stored", async function () {
      // Arrange
      const accountId = BigNumber.from(1);
      const amountToStore = BigNumber.from(100);
      await token.mint(deployer.getAddress(), amountToStore);
      await token.connect(deployer).approve(fundsManager.address, amountToStore);
      await fundsManager.connect(deployer).store(accountId, token.address, amountToStore, deployer.getAddress());

      const amountToWithdraw = amountToStore.add(1); // Attempting to withdraw one more token than stored

      // Act
      const act = () =>
        fundsManager.connect(deployer).withdraw(accountId, token.address, amountToWithdraw, deployer.getAddress());

      // Arrange
      await expect(act()).to.be.revertedWith(
        `[Funds Manager] Not enough funds for account ${accountId} and amount ${amountToWithdraw}`,
      );
    });
  });
});
