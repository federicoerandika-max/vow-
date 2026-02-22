'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { getMergedTranslations } from '@/utils/translations';
import { WeddingConfig } from '@/types/wedding';
import { copyToClipboard } from '@/utils/clipboard';

export default function GiftPage() {
  const [language] = useLanguage();
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [ibanCopied, setIbanCopied] = useState(false);
  const [nameCopied, setNameCopied] = useState(false);
  const t = getMergedTranslations(language, config);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(console.error);
  }, []);

  if (!config) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <img
            src="/assets/img/vow-logo.png"
            alt="Vow"
            className="loading-logo"
          />
          <div className="loading-bar-track">
            <div className="loading-bar-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyIban = async () => {
    const ibanText = config.couple.gift.iban.replace(/\s/g, '').replace('IBAN:', '');
    const success = await copyToClipboard(ibanText);
    if (success) {
      setIbanCopied(true);
      setTimeout(() => setIbanCopied(false), 2000);
    }
  };

  const handleCopyName = async () => {
    const nameText = config.couple.gift.accountHolder;
    const success = await copyToClipboard(nameText);
    if (success) {
      setNameCopied(true);
      setTimeout(() => setNameCopied(false), 2000);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>{t.giftTitle as string}</h1>
        <p dangerouslySetInnerHTML={{ __html: t.giftText as string }}></p>

        <div className="iban" onClick={handleCopyName}>
          <span>
            {t.name as string} <br />
            {config.couple.gift.accountHolder}
          </span>
          <br />
          <small>{nameCopied ? (t.copied as string) : (t.copy as string)}</small>
        </div>
        <div className="iban" onClick={handleCopyIban}>
          <span>
            {t.iban as string} {config.couple.gift.iban}
          </span>
          <br />
          <small>{ibanCopied ? (t.copied as string) : (t.copy as string)}</small>
        </div>

        <Link href="/">{t.backHome as string}</Link>
      </div>
    </div>
  );
}
