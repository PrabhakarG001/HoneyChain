import api from './api';

export const hiveService = {
  getHivesByFarm: async (farmId) => {
    const response = await api.get(`/farms/${farmId}/hives`);
    return response.data;
  },
  
  getHive: async (hiveId) => {
    const response = await api.get(`/hives/${hiveId}`);
    return response.data;
  },

  createHive: async (hiveData) => {
    const response = await api.post('/hives', hiveData);
    return response.data;
  },

  // Note: Telemetry will now come through WebSockets or specific endpoints
  getHiveTelemetry: async (hiveId) => {
    const response = await api.get(`/hives/${hiveId}/telemetry`);
    return response.data;
  },

  getAllHives: async () => {
    const response = await api.get('/hives');
    return response.data;
  },

  getHiveAnalysis: async (hiveId) => {
    const response = await api.get(`/hives/${hiveId}/analysis`);
    return response.data;
  }
};
