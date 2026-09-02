const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HoneyChain Smart Contract", function () {
  let HoneyChain, honeyChain, owner, processor, consumer;

  beforeEach(async function () {
    [owner, processor, consumer] = await ethers.getSigners();
    HoneyChain = await ethers.getContractFactory("HoneyChain");
    honeyChain = await HoneyChain.deploy();
  });

  it("Should register a new hive", async function () {
    const hiveId = "HIVE_001";
    const apiaryHash = ethers.encodeBytes32String("APIARY_01");
    
    await expect(honeyChain.registerHive(hiveId, apiaryHash))
      .to.emit(honeyChain, "HiveRegistered")
      .withArgs(hiveId, apiaryHash);
  });

  it("Should prevent duplicate hive registration", async function () {
    const hiveId = "HIVE_001";
    const apiaryHash = ethers.encodeBytes32String("APIARY_01");
    await honeyChain.registerHive(hiveId, apiaryHash);

    await expect(honeyChain.registerHive(hiveId, apiaryHash))
      .to.be.revertedWith("Hive already registered");
  });

  it("Should log harvest for registered hive", async function () {
    const hiveId = "HIVE_001";
    const harvestId = "HARVEST_001";
    const apiaryHash = ethers.encodeBytes32String("APIARY_01");

    await honeyChain.registerHive(hiveId, apiaryHash);
    await expect(honeyChain.createHarvest(hiveId, harvestId, 1690000000, 25))
      .to.emit(honeyChain, "HarvestCreated")
      .withArgs(hiveId, harvestId, 1690000000, 25);
  });

  it("Should create batch and transfer custody", async function () {
    const batchId = "BATCH_001";
    await honeyChain.createBatch(batchId, ["HARVEST_001"]);
    
    await expect(honeyChain.connect(owner).transferCustody(batchId, processor.address))
      .to.emit(honeyChain, "CustodyTransferred")
      .withArgs(batchId, owner.address, processor.address);
  });

  it("Should record lab test, create product, and verify QR product details", async function () {
    const hiveId = "HIVE_001";
    const harvestId = "HARVEST_001";
    const batchId = "BATCH_100";
    const productId = "HONEY_JAR_999";
    const labHash = ethers.encodeBytes32String("PASSED_PURITY_99");
    const processHash = ethers.encodeBytes32String("FILTERED_AND_BOTTLED");

    await honeyChain.registerHive(hiveId, ethers.encodeBytes32String("APIARY"));
    await honeyChain.createHarvest(hiveId, harvestId, 1690000000, 50);
    await honeyChain.createBatch(batchId, [harvestId]);

    await honeyChain.recordProcessing(batchId, processHash);
    await honeyChain.recordLabTest(batchId, labHash, true);
    await honeyChain.createProduct(productId, batchId);

    const verification = await honeyChain.verifyProduct(productId);
    expect(verification.batchId).to.equal(batchId);
    expect(verification.labPassed).to.equal(true);
  });
});
