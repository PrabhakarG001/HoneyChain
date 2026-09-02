const hre = require("hardhat");

async function main() {
  console.log("Deploying HoneyChain contract...");

  const HoneyChain = await hre.ethers.getContractFactory("HoneyChain");
  const honeyChain = await HoneyChain.deploy();

  await honeyChain.waitForDeployment();
  
  const address = await honeyChain.getAddress();
  console.log(`HoneyChain deployed to: ${address}`);

  const fs = require("fs");
  const path = require("path");
  const envPath = path.join(__dirname, "../../backend/.env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");
    if (envContent.includes("CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(/CONTRACT_ADDRESS=.*/, `CONTRACT_ADDRESS=${address}`);
    } else {
      envContent += `\nCONTRACT_ADDRESS=${address}`;
    }
    fs.writeFileSync(envPath, envContent);
    console.log("Updated CONTRACT_ADDRESS in backend/.env");
  } else {
    fs.writeFileSync(envPath, `CONTRACT_ADDRESS=${address}\n`);
    console.log("Created backend/.env with CONTRACT_ADDRESS");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
