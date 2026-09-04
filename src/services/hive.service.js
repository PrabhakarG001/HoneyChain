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

  /**
   * REST Endpoint: Fetch bounded historical sensor readings for a hive.
   * @param {string} hiveId
   * @param {Object} options - { range: '24h'|'7d'|'30d'|'1h'|'all', limit: number, offset: number }
   */
  getHiveReadings: async (hiveId, options = {}) => {
    const params = {
      range: options.range || '24h',
      limit: options.limit || 100,
      offset: options.offset || 0
    };
    const response = await api.get(`/hives/${hiveId}/readings`, { params });
    return response.data;
  },

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
