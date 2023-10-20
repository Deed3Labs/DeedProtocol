import { ethers } from "hardhat";
import { Signer, BigNumber } from "ethers";
import { expect } from "chai";
import { FundStorage, TokenMock } from "../typechain-types";

describe("FundStorage", function () {
  let addr1: Signer;

  let fundStorage: FundStorage;
  let token: TokenMock;

  beforeEach(async function () {
    [addr1] = await ethers.getSigners();

    // Deploy ERC20 token (you should deploy your ERC20 contract here)

    const TokenFactory = await ethers.getContractFactory("TokenMock");
    token = (await TokenFactory.deploy("PaymentToken", "PTKN")) as TokenMock;

    // Deploy FundStorage contract
    const FundStorageFactory = await ethers.getContractFactory("FundStorage");
    fundStorage = (await FundStorageFactory.deploy()) as FundStorage;

    await token.deployed();
    await fundStorage.deployed();
  });

  describe("store", () => {
    it("Should store funds correctly", async function () {
      // Arrange
      const amountToStore = BigNumber.from(100);
      await token.mint(addr1.getAddress(), amountToStore);
      const initialSenderBalance = await token.balanceOf(addr1.getAddress());
      const initialContractBalance = await token.balanceOf(fundStorage.address);
      const accountId = BigNumber.from(1);

      // Act
      await token.connect(addr1).approve(fundStorage.address, amountToStore);
      const act = () => fundStorage.connect(addr1).store(accountId, token.address, amountToStore, addr1.getAddress());

      // Assert
      await expect(act())
        .to.emit(fundStorage, "FundsStored")
        .withArgs(
          accountId,
          token.address,
          amountToStore,
          await addr1.getAddress(),
          await addr1.getAddress(),
          amountToStore,
        );

      const storedBalance = await fundStorage.connect(addr1).balanceOf(accountId, token.address);
      expect(storedBalance).to.equal(amountToStore);

      const finalSenderBalance = await token.balanceOf(addr1.getAddress());
      const finalContractBalance = await token.balanceOf(fundStorage.address);

      expect(finalSenderBalance).to.equal(initialSenderBalance.sub(amountToStore));
      expect(finalContractBalance).to.equal(initialContractBalance.add(amountToStore));
    });

    it("Should revert when storing funds with insufficient allowance", async function () {
      // Arrange
      const amountToStore = BigNumber.from(100);
      const accountId = 1;

      // Act
      const act = () => fundStorage.connect(addr1).store(accountId, token.address, amountToStore, addr1.getAddress());
      await expect(act()).to.be.revertedWith(
        `Funds Storage [store]: Not enough allowance for account ${accountId} and amount ${amountToStore}`,
      );
    });
  });

  describe("withdraw", () => {
    it("Should withdraw funds correctly", async function () {
      // Arrange
      const accountId = BigNumber.from(1);
      const amountToStore = BigNumber.from(100);
      await token.mint(addr1.getAddress(), amountToStore);
      await token.connect(addr1).approve(fundStorage.address, amountToStore);
      await fundStorage.connect(addr1).store(accountId, token.address, amountToStore, addr1.getAddress());

      const initialSenderBalance = await token.balanceOf(addr1.getAddress());
      const initialContractBalance = await token.balanceOf(fundStorage.address);

      const amountToWithdraw = BigNumber.from(50);

      // Act
      const act = () =>
        fundStorage.connect(addr1).widthdraw(accountId, token.address, amountToWithdraw, addr1.getAddress());

      // Assert
      await expect(act())
        .to.emit(fundStorage, "FundsWithdrawn")
        .withArgs(
          accountId,
          token.address,
          amountToWithdraw,
          await addr1.getAddress(),
          await addr1.getAddress(),
          amountToStore.sub(amountToWithdraw),
        );

      const finalSenderBalance = await token.balanceOf(addr1.getAddress());
      const finalContractBalance = await token.balanceOf(fundStorage.address);

      expect(finalSenderBalance).to.equal(initialSenderBalance.add(amountToWithdraw));
      expect(finalContractBalance).to.equal(initialContractBalance.sub(amountToWithdraw));
    });

    it("Should revert when withdrawing more funds than stored", async function () {
      // Arrange
      const accountId = BigNumber.from(1);
      const amountToStore = BigNumber.from(100);
      await token.mint(addr1.getAddress(), amountToStore);
      await token.connect(addr1).approve(fundStorage.address, amountToStore);
      await fundStorage.connect(addr1).store(accountId, token.address, amountToStore, addr1.getAddress());

      const amountToWithdraw = amountToStore.add(1); // Attempting to withdraw one more token than stored

      // Act
      const act = () =>
        fundStorage.connect(addr1).widthdraw(accountId, token.address, amountToWithdraw, addr1.getAddress());

      // Arrange
      await expect(act()).to.be.revertedWith(
        `Funds Storage [widthdraw]: Not enough funds for account ${accountId} and amount ${amountToWithdraw}`,
      );
    });
  });
});
