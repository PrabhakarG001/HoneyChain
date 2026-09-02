import api from './api';

export const farmService = {
  getFarms: async (userId) => {
    const response = await api.get('/farms');
    return response.data;
  },
  
  getFarm: async (farmId) => {
    const response = await api.get(`/farms/${farmId}`);
    return response.data;
  },

  createFarm: async (farmData, userId) => {
    const response = await api.post('/farms', farmData);
    return response.data;
  }
};
