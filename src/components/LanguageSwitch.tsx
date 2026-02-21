'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { Language } from '@/types/wedding';

export default function LanguageSwitch() {
  const [language, setLanguage] = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    // Forza re-render della pagina cambiando la lingua
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('languagechange'));
    }
  };

  return (
    <div className="lang-switch">
      <button 
        onClick={() => handleLanguageChange('it')}
        style={{
          color: '#333',
          fontWeight: language === 'it' ? '600' : 'normal',
        }}
      >
        🇮🇹 Italiano
      </button>
      <button 
        onClick={() => handleLanguageChange('en')}
        style={{
          color: '#333',
          fontWeight: language === 'en' ? '600' : 'normal',
        }}
      >
        🇬🇧 English
      </button>
    </div>
  );
}
