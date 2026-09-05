import { create } from 'zustand';
import { setItemAsync, getItemAsync, deleteItemAsync } from '../utils/storage';
import { useThemeStore } from './theme.store';

const normalizeUser = (userObj) => {
  if (!userObj) return null;
  const photo = 
    userObj.photoURL || 
    userObj.avatarUrl || 
    userObj.avatar_url || 
    userObj.profileImage || 
    userObj.profile_image || 
    userObj.picture || 
    userObj.avatar || 
    userObj.image || 
    '';
  return {
    ...userObj,
    photoURL: photo,
    avatarUrl: photo,
    avatar_url: photo,
    profileImage: photo,
    picture: photo,
    image: photo
  };
};

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true, // Start true while restoring session
  
  login: async (user, token) => {
    const normalized = normalizeUser(user);
    await setItemAsync('access_token', token);
    await setItemAsync('user', JSON.stringify(normalized));
    
    // Requirement 4: Beekeeper System Theme After Login (default to system theme automatically)
    try {
      useThemeStore.getState().setThemeMode('system');
    } catch (e) {}

    set({
      user: normalized,
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
      const newUser = normalizeUser({ ...state.user, ...updatedFields });
      setItemAsync('user', JSON.stringify(newUser));
      return { user: newUser };
    });
  },

  restoreSession: async () => {
    try {
      const token = await getItemAsync('access_token');
      const userStr = await getItemAsync('user');
      
      if (token && userStr) {
        const parsed = JSON.parse(userStr);
        const normalized = normalizeUser(parsed);
        set({
          user: normalized,
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
