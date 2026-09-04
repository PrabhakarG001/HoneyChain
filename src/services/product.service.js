import api from './api';

export const productService = {
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  getProduct: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  }
};
