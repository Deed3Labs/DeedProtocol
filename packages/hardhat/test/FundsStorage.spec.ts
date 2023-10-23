import { ethers } from "hardhat";
import { Signer, BigNumber } from "ethers";
import { expect } from "chai";
import { FundsManager, TokenMock } from "../typechain-types";

describe("FundsManager", function () {
  let addr1: Signer;

  let fundsManager: FundsManager;
  let token: TokenMock;

  beforeEach(async function () {
    [addr1] = await ethers.getSigners();

    // Deploy ERC20 token (you should deploy your ERC20 contract here)

    const TokenFactory = await ethers.getContractFactory("TokenMock");
    token = (await TokenFactory.deploy("PaymentToken", "PTKN")) as TokenMock;

    // Deploy FundStorage contract
    const FundStorageFactory = await ethers.getContractFactory("FundsManager");
    fundsManager = (await FundStorageFactory.deploy()) as FundsManager;

    await token.deployed();
    await fundsManager.deployed();
  });

  describe("store", () => {
    it("Should store funds correctly", async function () {
      // Arrange
      const amountToStore = BigNumber.from(100);
      await token.mint(addr1.getAddress(), amountToStore);
      const initialSenderBalance = await token.balanceOf(addr1.getAddress());
      const initialContractBalance = await token.balanceOf(fundsManager.address);
      const accountId = BigNumber.from(1);

      // Act
      await token.connect(addr1).approve(fundsManager.address, amountToStore);
      const act = () => fundsManager.connect(addr1).store(accountId, token.address, amountToStore, addr1.getAddress());

      // Assert
      await expect(act())
        .to.emit(fundsManager, "FundsStored")
        .withArgs(
          accountId,
          token.address,
          amountToStore,
          await addr1.getAddress(),
          await addr1.getAddress(),
          amountToStore,
        );

      const storedBalance = await fundsManager.connect(addr1).balanceOf(accountId, token.address);
      expect(storedBalance).to.equal(amountToStore);

      const finalSenderBalance = await token.balanceOf(addr1.getAddress());
      const finalContractBalance = await token.balanceOf(fundsManager.address);

      expect(finalSenderBalance).to.equal(initialSenderBalance.sub(amountToStore));
      expect(finalContractBalance).to.equal(initialContractBalance.add(amountToStore));
    });

    it("Should revert when storing funds with insufficient allowance", async function () {
      // Arrange
      const amountToStore = BigNumber.from(100);
      const accountId = 1;

      // Act
      const act = () => fundsManager.connect(addr1).store(accountId, token.address, amountToStore, addr1.getAddress());
      await expect(act()).to.be.revertedWith(
        `[FundsManager] Not enough allowance for account ${accountId} and amount ${amountToStore}`,
      );
    });
  });

  describe("withdraw", () => {
    it("Should withdraw funds correctly", async function () {
      // Arrange
      const accountId = BigNumber.from(1);
      const amountToStore = BigNumber.from(100);
      await token.mint(addr1.getAddress(), amountToStore);
      await token.connect(addr1).approve(fundsManager.address, amountToStore);
      await fundsManager.connect(addr1).store(accountId, token.address, amountToStore, addr1.getAddress());

      const initialSenderBalance = await token.balanceOf(addr1.getAddress());
      const initialContractBalance = await token.balanceOf(fundsManager.address);

      const amountToWithdraw = BigNumber.from(50);

      // Act
      const act = () =>
        fundsManager.connect(addr1).widthdraw(accountId, token.address, amountToWithdraw, addr1.getAddress());

      // Assert
      await expect(act())
        .to.emit(fundsManager, "FundsWithdrawn")
        .withArgs(
          accountId,
          token.address,
          amountToWithdraw,
          await addr1.getAddress(),
          await addr1.getAddress(),
          amountToStore.sub(amountToWithdraw),
        );

      const finalSenderBalance = await token.balanceOf(addr1.getAddress());
      const finalContractBalance = await token.balanceOf(fundsManager.address);

      expect(finalSenderBalance).to.equal(initialSenderBalance.add(amountToWithdraw));
      expect(finalContractBalance).to.equal(initialContractBalance.sub(amountToWithdraw));
    });

    it("Should revert when withdrawing more funds than stored", async function () {
      // Arrange
      const accountId = BigNumber.from(1);
      const amountToStore = BigNumber.from(100);
      await token.mint(addr1.getAddress(), amountToStore);
      await token.connect(addr1).approve(fundsManager.address, amountToStore);
      await fundsManager.connect(addr1).store(accountId, token.address, amountToStore, addr1.getAddress());

      const amountToWithdraw = amountToStore.add(1); // Attempting to withdraw one more token than stored

      // Act
      const act = () =>
        fundsManager.connect(addr1).widthdraw(accountId, token.address, amountToWithdraw, addr1.getAddress());

      // Arrange
      await expect(act()).to.be.revertedWith(
        `[FundsManager] Not enough funds for account ${accountId} and amount ${amountToWithdraw}`,
      );
    });
  });
});
