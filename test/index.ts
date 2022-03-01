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

  it("Should perform deposit properly", async function () {
    // try to deposit 1 token
    const receipt = await arthUsdRebase.deposit(TENe18);

    await expect(receipt)
      .to.emit(arthUsdRebase, "Deposit")
      .withArgs(operator.address, TENe18);

    const arthR = await arth.balanceOf(operator.address);
    expect(arthR).eq(TENe18.mul("999999999"));

    const arthUsd = await arthUsdRebase.balanceOf(operator.address);
    expect(arthUsd).eq(TENe18.mul(2)); // should report 2$
  });
});
