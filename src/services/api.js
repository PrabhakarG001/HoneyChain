import axios from 'axios';
import { getItemAsync } from '../utils/storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || process.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await getItemAsync('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and logout
      const { useAuthStore } = require('../store/auth.store');
      await useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
