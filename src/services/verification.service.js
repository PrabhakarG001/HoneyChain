import api from './api';

export const verificationService = {
  verifyProduct: async (verificationId) => {
    const response = await api.get(`/verify/${verificationId}`);
    return response.data;
  }
};
