'use client';

import { useState, useRef, useCallback } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { getMergedTranslations } from '@/utils/translations';
import { WeddingConfig } from '@/types/wedding';
import { copyToClipboard } from '@/utils/clipboard';

interface GiftSheetProps {
  config: WeddingConfig;
  isOpen: boolean;
  onClose: () => void;
}

export default function GiftSheet({ config, isOpen, onClose }: GiftSheetProps) {
  const [language] = useLanguage();
  const [ibanCopied, setIbanCopied] = useState(false);
  const [nameCopied, setNameCopied] = useState(false);
  const t = getMergedTranslations(language, config);

  // Drag-down state
  const sheetContentRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const draggingRef = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    currentYRef.current = e.touches[0].clientY;
    draggingRef.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    currentYRef.current = e.touches[0].clientY;
    const diff = currentYRef.current - startYRef.current;
    if (diff > 0 && sheetContentRef.current) {
      sheetContentRef.current.style.transform = `translateY(${diff}px)`;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const diff = currentYRef.current - startYRef.current;
    if (diff > 120) {
      // Close with animation
      if (sheetContentRef.current) {
        sheetContentRef.current.style.transform = 'translateY(100%)';
      }
      setTimeout(() => {
        if (sheetContentRef.current) {
          sheetContentRef.current.style.transform = '';
        }
        onClose();
      }, 350);
    } else {
      // Snap back
      if (sheetContentRef.current) {
        sheetContentRef.current.style.transform = 'translateY(0)';
      }
    }
    startYRef.current = 0;
    currentYRef.current = 0;
  }, [onClose]);

  if (!isOpen) return null;

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
    <div
      id="giftSheet"
      className={isOpen ? 'active' : ''}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sheet-content" ref={sheetContentRef}>
        <div
          className="sheet-handle"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={onClose}
        ></div>
        <h2>{t.giftTitle as string}</h2>
        <p dangerouslySetInnerHTML={{ __html: t.giftText as string }}></p>

        <div className="name" onClick={handleCopyName}>
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

        <button id="closeButton" onClick={onClose}>
          {t.closeButton as string}
        </button>
      </div>
    </div>
  );
}
