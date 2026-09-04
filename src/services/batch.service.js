import api from './api';

export const batchService = {
  createBatch: async (data) => {
    let harvestIds = data.harvest_ids || data.harvestIds || [];
    if (typeof harvestIds === 'string') {
      harvestIds = [harvestIds];
    }
    
    // If no harvest ID is provided directly, register or reuse harvest
    if (harvestIds.length === 0 && data.hiveId) {
      try {
        const harvestRes = await api.post('/harvests', {
          hive_id: data.hiveId,
          weight_kg: Number(data.quantity) || 10.0
        });
        const hId = harvestRes.data?.data?.harvestId || harvestRes.data?.id;
        if (hId) harvestIds = [hId];
      } catch (err) {
        console.warn('Harvest auto-creation notice during batch creation:', err.message);
      }
    }

    // Fallback if still empty
    if (harvestIds.length === 0) {
      harvestIds = ['HV_DEFAULT_SEED'];
    }

    const payload = {
      harvest_ids: harvestIds,
      batch_code: data.batch_code || data.batchCode || (data.honeyType ? `${data.honeyType.toUpperCase()}_BATCH_${Date.now().toString().slice(-4)}` : undefined),
      status: data.status || 'CREATED'
    };

    const response = await api.post('/batches', payload);
    return response.data;
  },

  mergeBatches: async (mergeData) => {
    const response = await api.post('/batches/merge', mergeData);
    return response.data;
  },

  transferCustody: async (batchId, toOwner) => {
    const response = await api.post(`/batches/${batchId}/transfer`, { to_owner: toOwner });
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
