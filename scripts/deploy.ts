import hre, { ethers } from "hardhat";
// const hre = require("hardhat");

async function main() {
  const arth = "0xb69a424df8c737a122d0e60695382b3eec07ff4b";
  const gmuOracle = "0xdd465b9c68750a02c307744a749954b1f9787efb";
  const governance = "0xeccE08c2636820a81FC0c805dBDC7D846636bbc4";
  const chainId = 56;

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

  await instance.deployed();
  console.log("ArthUSDWrapper deployed to:", instance.address);

  await hre.run("verify:verify", {
    address: "0x88fd584dF3f97c64843CD474bDC6F78e398394f4",
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
