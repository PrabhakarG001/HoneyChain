const hre = require("hardhat");

async function main() {
  console.log("Deploying HoneyChain contract...");

  const HoneyChain = await hre.ethers.getContractFactory("HoneyChain");
  const honeyChain = await HoneyChain.deploy();

  await honeyChain.waitForDeployment();
  
  const address = await honeyChain.getAddress();
  console.log(`HoneyChain deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
