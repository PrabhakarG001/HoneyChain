import { create } from 'zustand';
import { setItemAsync, getItemAsync } from '../utils/storage';

export const useThemeStore = create((set) => ({
  themeMode: 'system', // 'system' | 'light' | 'dark'

  setThemeMode: async (mode) => {
    set({ themeMode: mode });
    await setItemAsync('theme_preference', mode);
  },

  loadPersistedTheme: async () => {
    try {
      const savedMode = await getItemAsync('theme_preference');
      if (savedMode && ['system', 'light', 'dark'].includes(savedMode)) {
        set({ themeMode: savedMode });
      }
    } catch (e) {
      // default system mode
    }
  }
}));
