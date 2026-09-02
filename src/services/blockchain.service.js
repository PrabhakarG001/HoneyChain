import api from './api';

export const blockchainService = {
  getBlockchainStatus: async () => {
    const response = await api.get('/blockchain/status');
    return response.data;
  },
  
  getTransaction: async (hash) => {
    const response = await api.get(`/blockchain/transaction/${hash}`);
    return response.data;
  }
};
