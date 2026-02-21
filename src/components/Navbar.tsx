'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { getMergedTranslations } from '@/utils/translations';
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
  const t = getMergedTranslations(language, config);

  useEffect(() => {
    // Navbar only becomes visible when the video has ended / been skipped
    if (videoSkipped) {
      setIsVisible(true);
    }
  }, [videoSkipped]);

  const showTimeline = dayHasCome(new Date(config.couple.weddingDate)) || isTestEnv();
  const coupleNames = config.couple.names.join(' & ');

  return (
    <header className={`navbar ${isVisible ? '' : 'hidden'}`}>
      <div className="nav-container">
        <Link href="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          {coupleNames}
        </Link>
        <button
          className={`nav-toggle ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
          aria-expanded={isOpen}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>
      <nav className={`nav-links ${isOpen ? 'open' : ''}`}>
        <Link href="/" className="nav-link" onClick={() => setIsOpen(false)}>
          Home
        </Link>
        {showTimeline && (
          <Link href="/timeline" className="nav-link navTimeline" onClick={() => setIsOpen(false)}>
            {t.timeline as string}
          </Link>
        )}
        <Link href="/gift" className="nav-link" onClick={() => setIsOpen(false)}>
          {t.navGift as string}
        </Link>
        {config.couple.wedshoots && (
          <a
            href="https://itunes.apple.com/it/app/wedshoots/id660256196?ls=1"
            className="nav-link last"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
          >
            <span dangerouslySetInnerHTML={{ __html: t.navWedshoots as string }}></span>
          </a>
        )}
      </nav>
    </header>
  );
}
