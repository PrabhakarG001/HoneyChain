import { create } from 'zustand';
import { setItemAsync, getItemAsync } from '../utils/storage';
import { INDIAN_LANGUAGES } from '../constants/languages';

export const useLanguageStore = create((set, get) => ({
  languageCode: 'en',

  setLanguageCode: async (code) => {
    const validLang = INDIAN_LANGUAGES.find(l => l.code === code);
    if (!validLang) return;
    set({ languageCode: code });
    await setItemAsync('language_preference', code);
  },

  loadPersistedLanguage: async () => {
    try {
      const savedCode = await getItemAsync('language_preference');
      if (savedCode && INDIAN_LANGUAGES.some(l => l.code === savedCode)) {
        set({ languageCode: savedCode });
      }
    } catch (e) {
      // fallback to English ('en')
    }
  },

  getCurrentLanguageObj: () => {
    const code = get().languageCode;
    return INDIAN_LANGUAGES.find(l => l.code === code) || INDIAN_LANGUAGES[0];
  }
}));
