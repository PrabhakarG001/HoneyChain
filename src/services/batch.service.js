let mockBatches = [];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const batchService = {
  createBatch: async (batchData) => {
    await delay(1000);
    const newBatch = {
      ...batchData,
      id: `HC-UP-${new Date().getFullYear()}-${Math.floor(Math.random()*1000000).toString().padStart(6, '0')}`,
      status: 'HARVESTED',
      createdAt: new Date().toISOString()
    };
    mockBatches.push(newBatch);
    return newBatch;
  },
  
  getBatch: async (batchId) => {
    await delay(500);
    const batch = mockBatches.find(b => b.id === batchId);
    if (!batch) throw new Error('Batch not found');
    return batch;
  }
};
