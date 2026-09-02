const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HoneyChain", function () {
  let HoneyChain, honeyChain, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    HoneyChain = await ethers.getContractFactory("HoneyChain");
    honeyChain = await HoneyChain.deploy();
    // await honeyChain.deployed(); // In newer hardhat it's waitForDeployment() depending on ethers v6
  });

  it("Should register a new hive", async function () {
    const hiveId = "HIVE_001";
    const apiaryHash = ethers.encodeBytes32String("APIARY_DATA");
    
    await expect(honeyChain.registerHive(hiveId, apiaryHash)).to.not.be.reverted;
  });

  it("Should create a batch successfully", async function () {
    const hiveId = "HIVE_001";
    const harvestId = "HARVEST_001";
    const batchId = "BATCH_001";
    
    await honeyChain.registerHive(hiveId, ethers.encodeBytes32String("APIARY"));
    await honeyChain.createHarvest(hiveId, harvestId, 1690000000, 20);
    
    await expect(honeyChain.createBatch(batchId, [harvestId])).to.not.be.reverted;
  });
});
