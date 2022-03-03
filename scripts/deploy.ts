import hre, { ethers } from "hardhat";
// const hre = require("hardhat");

async function main() {
  const arth = "0xe52509181feb30eb4979e29ec70d50fd5c44d590";
  const gmuOracle = "0xBe5514E856a4eb971653BcC74475B26b56763FD0";
  const governance = "0xeccE08c2636820a81FC0c805dBDC7D846636bbc4";
  const chainId = 137;

  const constructorArguments = [
    "ARTH USD Rebase",
    "ARTH.usd",
    arth,
    gmuOracle,
    governance,
    chainId,
  ];

  // We get the contract to deploy
  const ArthUSDWrapper = await ethers.getContractFactory("ArthUSDWrapper");
  const instance = await ArthUSDWrapper.deploy(
    String(constructorArguments[0]),
    String(constructorArguments[1]),
    String(constructorArguments[2]),
    String(constructorArguments[3]),
    String(constructorArguments[4]),
    constructorArguments[5]
  );

  // await instance.deployed();
  console.log("ArthUSDWrapper deployed to:", instance.address);

  await hre.run("verify:verify", {
    address: instance.address,
    contract: "contracts/ArthUSDWrapper.sol:ArthUSDWrapper",
    constructorArguments,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
