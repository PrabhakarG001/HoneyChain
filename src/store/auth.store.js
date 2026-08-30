import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: async (user, token) => {
    await SecureStore.setItemAsync('access_token', token);
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      isLoading: false
    });
  },
  
  logout: async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('user');
    
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false
    });
  },

  restoreSession: async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      const userStr = await SecureStore.getItemAsync('user');
      
      if (token && userStr) {
        set({
          user: JSON.parse(userStr),
          accessToken: token,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      set({ isLoading: false });
    }
  }
}));
