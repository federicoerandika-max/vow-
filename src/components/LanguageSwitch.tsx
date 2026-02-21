'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { Language } from '@/types/wedding';

export default function LanguageSwitch() {
  const [language, setLanguage] = useLanguage();

  return (
    <div className="lang-switch">
      <button onClick={() => setLanguage('it')}>
        🇮🇹 Italiano
      </button>
      <button onClick={() => setLanguage('en')}>
        🇬🇧 English
      </button>
    </div>
  );
}
