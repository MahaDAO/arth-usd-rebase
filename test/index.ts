import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ArthUSDWrapper", function () {
  let operator: SignerWithAddress;

  let arthUsdRebase: Contract;
  let arth: Contract;
  let gmuOracle: Contract;

  const TENe18 = BigNumber.from(10).pow(18);
  const INFINITY = TENe18.mul("9999999999");

  before("setup accounts & deploy libraries", async () => {
    [operator] = await ethers.getSigners();
  });

  beforeEach("deploy all contracts", async () => {
    // deploy arth
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    arth = await MockERC20.connect(operator).deploy("ARTH", "ARTH", 18);

    // deploy gmu
    const MockGMUOracle = await ethers.getContractFactory("MockGMUOracle");
    gmuOracle = await MockGMUOracle.connect(operator).deploy(2000000, 6);

    // deploy the wrapper arth
    const ArthUSDWrapper = await ethers.getContractFactory("ArthUSDWrapper");
    arthUsdRebase = await ArthUSDWrapper.connect(operator).deploy(
      "ARTH USD Rebase",
      "ARTH.usd",
      arth.address,
      gmuOracle.address,
      operator.address,
      56
    );

    arth.connect(operator).approve(arthUsdRebase.address, INFINITY);
  });

  it("Should report the right balance of tokens before deposit", async function () {
    const arthR = await arth.balanceOf(operator.address);
    expect(arthR).eq(TENe18.mul("1000000000"));

    const arthUsd = await arthUsdRebase.balanceOf(operator.address);
    expect(arthUsd).eq("0");
  });

  describe("when gmu is unchanged after a deposit", async function () {
    beforeEach("deposit some tokens and increase the gmu", async () => {
      const receipt = await arthUsdRebase.deposit(TENe18);

      await expect(receipt)
        .to.emit(arthUsdRebase, "Deposit")
        .withArgs(operator.address, TENe18);
    });

    it("ARTH.usd balance should be correct", async function () {
      const arthR = await arth.balanceOf(operator.address);
      expect(arthR).eq(TENe18.mul("999999999"));

      const arthUsd = await arthUsdRebase.balanceOf(operator.address);
      expect(arthUsd).eq(TENe18.mul(2)); // should report 2$
    });

    it("Underlying ARTH balance should be the same", async function () {
      const arthUsd = await arthUsdRebase.underlyingBalanceOf(operator.address);
      expect(arthUsd).eq(TENe18); // should report 1 ARTH
    });

    it("Should perform withdraw properly", async function () {
      // try to deposit 1 token
      const receipt = await arthUsdRebase.withdraw(TENe18);

      await expect(receipt)
        .to.emit(arthUsdRebase, "Withdraw")
        .withArgs(operator.address, TENe18);

      const arthR = await arth.balanceOf(operator.address);
      expect(arthR).eq(TENe18.mul("1000000000"));

      const arthUsd = await arthUsdRebase.balanceOf(operator.address);
      expect(arthUsd).eq("0");
    });
  });

  describe("when gmu is increased after a deposit", async function () {
    beforeEach("deposit some tokens and increase the gmu", async () => {
      await arthUsdRebase.deposit(TENe18);
      await gmuOracle.setPrice(2100000, 6);
    });

    it("ARTH.usd balance should increase", async function () {
      const arthUsd = await arthUsdRebase.balanceOf(operator.address);
      expect(arthUsd).eq(TENe18.mul(21).div(10)); // should report 2.1$
    });

    it("Underlying ARTH balance should be the same", async function () {
      const arthUsd = await arthUsdRebase.underlyingBalanceOf(operator.address);
      expect(arthUsd).eq(TENe18); // should report 1 ARTH
    });

    it("Withdraw should give back the principal amount", async function () {
      // try to deposit 1 token
      const receipt = await arthUsdRebase.withdraw(TENe18);

      await expect(receipt)
        .to.emit(arthUsdRebase, "Withdraw")
        .withArgs(operator.address, TENe18);

      const arthR = await arth.balanceOf(operator.address);
      expect(arthR).eq(TENe18.mul("1000000000"));

      const arthUsd = await arthUsdRebase.balanceOf(operator.address);
      expect(arthUsd).eq("0"); // should report 2$
    });
  });

  describe("when gmu is decreased after a deposit", async function () {
    beforeEach("deposit some tokens and increase the gmu", async () => {
      await arthUsdRebase.deposit(TENe18);
      await gmuOracle.setPrice(1500000, 6);
    });

    it("ARTH.usd balance should decrease", async function () {
      const arthUsd = await arthUsdRebase.balanceOf(operator.address);
      expect(arthUsd).eq(TENe18.mul(15).div(10)); // should report 1.5$
    });

    it("Underlying ARTH balance should be the same", async function () {
      const arthUsd = await arthUsdRebase.underlyingBalanceOf(operator.address);
      expect(arthUsd).eq(TENe18); // should report 1 ARTH
    });

    it("Withdraw should give back the principal amount", async function () {
      // try to deposit 1 token
      const receipt = await arthUsdRebase.withdraw(TENe18);

      await expect(receipt)
        .to.emit(arthUsdRebase, "Withdraw")
        .withArgs(operator.address, TENe18);

      const arthR = await arth.balanceOf(operator.address);
      expect(arthR).eq(TENe18.mul("1000000000"));

      const arthUsd = await arthUsdRebase.balanceOf(operator.address);
      expect(arthUsd).eq("0"); // should report 2$
    });
  });
});
