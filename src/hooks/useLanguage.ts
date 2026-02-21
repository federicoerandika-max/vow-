import { useState, useEffect, useCallback } from 'react';
import { Language } from '@/types/wedding';

// Store globale per notificare tutti i componenti del cambio lingua
let languageListeners: Set<(lang: Language) => void> = new Set();
let currentLanguage: Language = 'it';

// Inizializza la lingua dal localStorage o browser
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('lang') as Language | null;
  if (saved && (saved === 'it' || saved === 'en')) {
    currentLanguage = saved;
  } else {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    currentLanguage = browserLang.startsWith('en') ? 'en' : 'it';
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = currentLanguage;
  }
}

export function useLanguage(): [Language, (lang: Language) => void] {
  const [language, setLanguageState] = useState<Language>(currentLanguage);

  useEffect(() => {
    // Carica la lingua salvata all'inizio
    const saved = localStorage.getItem('lang') as Language | null;
    if (saved && (saved === 'it' || saved === 'en')) {
      setLanguageState(saved);
      currentLanguage = saved;
    } else {
      const browserLang = navigator.language || (navigator as any).userLanguage;
      const detectedLang = browserLang.startsWith('en') ? 'en' : 'it';
      setLanguageState(detectedLang);
      currentLanguage = detectedLang;
    }

    // Ascolta i cambi di lingua
    const handleLanguageChange = (newLang: Language) => {
      setLanguageState(newLang);
    };

    languageListeners.add(handleLanguageChange);

    return () => {
      languageListeners.delete(handleLanguageChange);
    };
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    localStorage.setItem('lang', lang);
    currentLanguage = lang;
    
    // Notifica tutti i listener
    languageListeners.forEach(listener => listener(lang));
    
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
    
    // Forza re-render della pagina
    window.dispatchEvent(new CustomEvent('languagechange', { detail: lang }));
  }, []);

  return [language, setLanguage];
}
