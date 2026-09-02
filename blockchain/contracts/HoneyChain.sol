// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HoneyChain {
    address public owner;

    struct Hive {
        string hiveId;
        bytes32 apiaryHash;
        bool exists;
    }

    struct Harvest {
        string harvestId;
        string hiveId;
        uint256 timestamp;
        uint256 quantityKg;
        bool exists;
    }

    struct Batch {
        string batchId;
        string[] harvestIds;
        address currentOwner;
        bytes32 processStepHash;
        bytes32 labTestHash;
        bool labPassed;
        bool exists;
    }

    struct Product {
        string productId;
        string batchId;
        bool exists;
    }

    mapping(string => Hive) public hives;
    mapping(string => Harvest) public harvests;
    mapping(string => Batch) public batches;
    mapping(string => Product) public products;

    // Events
    event HiveRegistered(string hiveId, bytes32 apiaryHash);
    event HarvestCreated(string hiveId, string harvestId, uint256 timestamp, uint256 quantityKg);
    event BatchCreated(string batchId, string[] harvestIds);
    event CustodyTransferred(string batchId, address fromOwner, address toOwner);
    event BatchesMerged(string newBatchId, string[] parentBatchIds);
    event ProcessingRecorded(string batchId, bytes32 processStepHash);
    event LabTestRecorded(string batchId, bytes32 labTestHash, bool passed);
    event ProductCreated(string productId, string batchId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerHive(string memory hiveId, bytes32 apiaryHash) external {
        require(!hives[hiveId].exists, "Hive already registered");
        hives[hiveId] = Hive({
            hiveId: hiveId,
            apiaryHash: apiaryHash,
            exists: true
        });
        emit HiveRegistered(hiveId, apiaryHash);
    }

    function createHarvest(string memory hiveId, string memory harvestId, uint256 timestamp, uint256 quantityKg) external {
        require(hives[hiveId].exists, "Hive does not exist");
        require(!harvests[harvestId].exists, "Harvest already exists");

        harvests[harvestId] = Harvest({
            harvestId: harvestId,
            hiveId: hiveId,
            timestamp: timestamp,
            quantityKg: quantityKg,
            exists: true
        });
        emit HarvestCreated(hiveId, harvestId, timestamp, quantityKg);
    }

    function createBatch(string memory batchId, string[] memory harvestIds) external {
        require(!batches[batchId].exists, "Batch already exists");
        
        batches[batchId] = Batch({
            batchId: batchId,
            harvestIds: harvestIds,
            currentOwner: msg.sender,
            processStepHash: 0,
            labTestHash: 0,
            labPassed: false,
            exists: true
        });
        emit BatchCreated(batchId, harvestIds);
    }

    function transferCustody(string memory batchId, address toOwner) external {
        require(batches[batchId].exists, "Batch does not exist");
        require(batches[batchId].currentOwner == msg.sender, "Not the owner");
        
        address fromOwner = msg.sender;
        batches[batchId].currentOwner = toOwner;
        
        emit CustodyTransferred(batchId, fromOwner, toOwner);
    }

    function mergeBatches(string memory newBatchId, string[] memory parentBatchIds) external {
        require(!batches[newBatchId].exists, "New batch already exists");
        
        // In a simple model, we just record the merge. 
        // We simulate bringing the harvest IDs from parents into the new batch.
        string[] memory emptyHarvests;
        
        batches[newBatchId] = Batch({
            batchId: newBatchId,
            harvestIds: emptyHarvests, // Simplification for demo
            currentOwner: msg.sender,
            processStepHash: 0,
            labTestHash: 0,
            labPassed: false,
            exists: true
        });
        
        emit BatchesMerged(newBatchId, parentBatchIds);
    }

    function recordProcessing(string memory batchId, bytes32 processStepHash) external {
        require(batches[batchId].exists, "Batch does not exist");
        batches[batchId].processStepHash = processStepHash;
        emit ProcessingRecorded(batchId, processStepHash);
    }

    function recordLabTest(string memory batchId, bytes32 labTestHash, bool passed) external {
        require(batches[batchId].exists, "Batch does not exist");
        batches[batchId].labTestHash = labTestHash;
        batches[batchId].labPassed = passed;
        emit LabTestRecorded(batchId, labTestHash, passed);
    }

    function createProduct(string memory productId, string memory batchId) external {
        require(batches[batchId].exists, "Batch does not exist");
        require(!products[productId].exists, "Product already exists");

        products[productId] = Product({
            productId: productId,
            batchId: batchId,
            exists: true
        });
        emit ProductCreated(productId, batchId);
    }

    function verifyProduct(string memory productId) external view returns (
        string memory batchId,
        bytes32 processStepHash,
        bytes32 labTestHash,
        bool labPassed
    ) {
        require(products[productId].exists, "Product does not exist");
        
        Product memory p = products[productId];
        Batch memory b = batches[p.batchId];
        
        return (
            b.batchId,
            b.processStepHash,
            b.labTestHash,
            b.labPassed
        );
    }
}
