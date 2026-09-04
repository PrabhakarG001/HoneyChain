import axios from 'axios';
import { Platform } from 'react-native';
import { getItemAsync } from '../utils/storage';

const getDefaultApiUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL || process.env.VITE_API_URL;
  if (envUrl) return envUrl;

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api';
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const hostname = window.location.hostname || 'localhost';
    return `http://${hostname}:8000/api`;
  }
  return 'http://localhost:8000/api';
};

const API_URL = getDefaultApiUrl();

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
    if (error.response) {
      if (error.response.status === 401) {
        const { useAuthStore } = require('../store/auth.store');
        await useAuthStore.getState().logout();
      }
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_CONNECTION_REFUSED') {
      error.message = `Cannot connect to HoneyChain backend server at ${API_URL}. Please start the backend server (python -m uvicorn backend.main:app --port 8000).`;
    } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      error.message = `Network error connecting to ${API_URL}. Please verify network settings and CORS configuration.`;
    }
    return Promise.reject(error);
  }
);

export default api;
