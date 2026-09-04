import { create } from 'zustand';
import { setItemAsync, getItemAsync, deleteItemAsync } from '../utils/storage';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true, // Start true while restoring session
  
  login: async (user, token) => {
    await setItemAsync('access_token', token);
    await setItemAsync('user', JSON.stringify(user));
    
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      isLoading: false
    });
  },
  
  logout: async () => {
    await deleteItemAsync('access_token');
    await deleteItemAsync('user');
    
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false
    });
  },

  updateUser: (updatedFields) => {
    set((state) => {
      if (!state.user) return state;
      const newUser = { ...state.user, ...updatedFields };
      setItemAsync('user', JSON.stringify(newUser));
      return { user: newUser };
    });
  },

  restoreSession: async () => {
    try {
      const token = await getItemAsync('access_token');
      const userStr = await getItemAsync('user');
      
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
