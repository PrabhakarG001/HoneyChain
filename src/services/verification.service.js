import api from './api';

export const verificationService = {
  verifyProduct: async (verificationId) => {
    try {
      const response = await api.get(`/verify/${verificationId}`);
      return response.data;
    } catch (err) {
      console.warn(`Verification query error for ${verificationId}:`, err.message);
      return {
        success: false,
        id: verificationId,
        status: 'Unverified',
        details: { message: err.message || 'Product verification record not found' }
      };
    }
  },

  getGenealogy: async (batchId) => {
    try {
      const response = await api.get(`/genealogy/batch/${batchId}`);
      return response.data;
    } catch (err) {
      console.warn(`Genealogy query error for ${batchId}:`, err.message);
      return null;
    }
  }
};
