import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { ERC20, FundStorage } from "../typechain-types";

describe("FundStorage", function () {
  let fundStorage: FundStorage;
  let token: ERC20;
  let addr1: Signer;

  beforeEach(async function () {
    [addr1] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("YourERC20Token"); // Replace with the actual ERC20 token contract name
    token = (await TokenFactory.deploy()) as ERC20;

    const FundStorageFactory = await ethers.getContractFactory("FundStorage");
    fundStorage = (await FundStorageFactory.deploy()) as FundStorage;

    await token.deployed();
    await fundStorage.deployed();
  });

  it("Should store funds", async function () {
    const initialBalance = await token.balanceOf(await addr1.getAddress());
    const amountToStore = 100;

    await token.transfer(await addr1.getAddress(), amountToStore);
    await token.connect(addr1).approve(fundStorage.address, amountToStore);

    await expect(fundStorage.connect(addr1).store(1, token.address, amountToStore, await addr1.getAddress()))
      .to.emit(fundStorage, "FundsStored")
      .withArgs(1, token.address, amountToStore, await addr1.getAddress(), await addr1.getAddress(), amountToStore);

    const storedBalance = await fundStorage.accountBalance(1, token.address);
    expect(storedBalance).to.equal(amountToStore);

    const finalBalance = await token.balanceOf(await addr1.getAddress());
    expect(finalBalance).to.equal(initialBalance.sub(amountToStore));
  });

  it("Should withdraw funds", async function () {
    const initialBalance = await token.balanceOf(await addr1.getAddress());
    const amountToWithdraw = 50;

    await expect(fundStorage.connect(addr1).widthdraw(1, token.address, amountToWithdraw, await addr1.getAddress()))
      .to.emit(fundStorage, "FundsWithdrawn")
      .withArgs(1, token.address, amountToWithdraw, await addr1.getAddress(), await addr1.getAddress(), 50);

    const storedBalance = await fundStorage.accountBalance(1, token.address);
    expect(storedBalance).to.equal(50);

    const finalBalance = await token.balanceOf(await addr1.getAddress());
    expect(finalBalance).to.equal(initialBalance.add(amountToWithdraw));
  });
});
