'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/config/translations';
import { WeddingConfig } from '@/types/wedding';
import { dayHasCome, isTestEnv } from '@/utils/dateUtils';

interface NavbarProps {
  config: WeddingConfig;
  videoSkipped?: boolean;
}

export default function Navbar({ config, videoSkipped = false }: NavbarProps) {
  const [language] = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(videoSkipped);
  const t = translations[language];

  useEffect(() => {
    // Navbar diventa visibile dopo il video (o subito se video saltato)
    if (videoSkipped) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [videoSkipped]);

  const showTimeline = dayHasCome(new Date(config.couple.weddingDate)) || isTestEnv();
  const coupleNames = config.couple.names.join(' & ');

  return (
    <header className={`navbar ${isVisible ? '' : 'hidden'}`}>
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          {coupleNames}
        </Link>
        <button
          className="nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
          aria-expanded={isOpen}
        >
          ☰
        </button>
      </div>
      <nav className={`nav-links ${isOpen ? 'open' : ''}`}>
        <Link href="/" className="nav-link">
          Home
        </Link>
        {showTimeline && (
          <Link href="/timeline" className="nav-link navTimeline">
            Timeline
          </Link>
        )}
        <Link href="/gift" className="nav-link">
          {t.navGift as string}
        </Link>
        {config.couple.wedshoots && (
          <a
            href="https://itunes.apple.com/it/app/wedshoots/id660256196?ls=1"
            className="nav-link last"
          >
            {t.navWedshoots as string}
          </a>
        )}
      </nav>
    </header>
  );
}
