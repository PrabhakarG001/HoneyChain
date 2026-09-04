import api from './api';

export const harvestService = {
  createHarvest: async (harvestData) => {
    const response = await api.post('/harvests', harvestData);
    return response.data;
  },

  getHarvests: async (hiveId = null) => {
    const params = hiveId ? { hive_id: hiveId } : {};
    const response = await api.get('/harvests', { params });
    return response.data;
  },

  getHarvest: async (harvestId) => {
    const response = await api.get(`/harvests/${harvestId}`);
    return response.data;
  }
};
