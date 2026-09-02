import api from './api';

export const batchService = {
  createBatch: async (batchData) => {
    const response = await api.post('/batches', batchData);
    return response.data;
  },
  
  getBatch: async (batchId) => {
    const response = await api.get(`/batches/${batchId}`);
    return response.data;
  },
  
  getBatches: async () => {
    const response = await api.get('/batches');
    return response.data;
  }
};
