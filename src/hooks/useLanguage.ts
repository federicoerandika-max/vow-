import { useState, useEffect } from 'react';
import { Language } from '@/types/wedding';

export function useLanguage(): [Language, (lang: Language) => void] {
  const [language, setLanguageState] = useState<Language>('it');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Language | null;
    if (saved && (saved === 'it' || saved === 'en')) {
      setLanguageState(saved);
    } else {
      const browserLang = navigator.language || navigator.userLanguage;
      const detectedLang = browserLang.startsWith('en') ? 'en' : 'it';
      setLanguageState(detectedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('lang', lang);
    setLanguageState(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  return [language, setLanguage];
}
