import hre, { ethers } from "hardhat";
// const hre = require("hardhat");

async function main() {
  const arth = "0x8CC0F052fff7eaD7f2EdCCcaC895502E884a8a71";
  const gmuOracle = "0x288961ee2805a1961d6a98092aa83b00f3065514";
  const governance = "0x6357EDbfE5aDA570005ceB8FAd3139eF5A8863CC";
  const chainId = 1;

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
