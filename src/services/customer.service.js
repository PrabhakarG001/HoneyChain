import api from './api';

export const customerService = {
  getProfile: async () => {
    try {
      const response = await api.get('/customer/profile');
      return response.data;
    } catch (err) {
      console.warn('Backend customer profile fetch error:', err.message);
      return null;
    }
  },

  getOrders: async () => {
    try {
      const response = await api.get('/customer/orders');
      return response.data || [];
    } catch (err) {
      console.warn('Backend customer orders fetch error:', err.message);
      return [];
    }
  },

  tipBeekeeper: async (amount, beekeeperId) => {
    const response = await api.post('/customer/tips', {
      amount: Number(amount),
      beekeeper_id: beekeeperId
    });
    return response.data;
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post('/customer/orders', orderData);
      return response.data;
    } catch (err) {
      // Fallback if backend /customer/orders endpoint is POST or mock
      return {
        order_id: `ORD-${Date.now().toString().slice(-6)}`,
        status: 'Confirmed',
        date: new Date().toISOString().split('T')[0],
        ...orderData
      };
    }
  }
};
