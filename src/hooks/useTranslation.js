import { useEffect } from 'react';
import { useLanguageStore } from '../store/language.store';
import { translations } from '../i18n/translations';

export function useTranslation() {
  const languageCode = useLanguageStore((state) => state.languageCode);
  const setLanguageCode = useLanguageStore((state) => state.setLanguageCode);
  const loadPersistedLanguage = useLanguageStore((state) => state.loadPersistedLanguage);
  const getCurrentLanguageObj = useLanguageStore((state) => state.getCurrentLanguageObj);

  useEffect(() => {
    loadPersistedLanguage();
  }, []);

  const t = (key, fallbackText = '') => {
    const langDict = translations[languageCode] || {};
    if (langDict[key]) return langDict[key];

    const enDict = translations['en'] || {};
    if (enDict[key]) return enDict[key];

    return fallbackText || key;
  };

  return {
    t,
    languageCode,
    setLanguageCode,
    currentLanguage: getCurrentLanguageObj()
  };
}
