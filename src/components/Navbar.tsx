'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { WeddingConfig } from '@/types/wedding';
import { getMergedTranslations } from '@/utils/translations';
import { dayHasCome, isTestEnv, shouldShowForm } from '@/utils/dateUtils';

interface NavbarProps {
  videoSkipped: boolean;
  config: WeddingConfig;
}

export default function Navbar({ videoSkipped, config }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [language] = useLanguage();
  const t = getMergedTranslations(language, config);

  useEffect(() => {
    if (videoSkipped) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [videoSkipped]);

  const handleNavClick = (action: string) => {
    setIsOpen(false);
    if (action === 'gift') {
      // Open the gift sheet overlay
      if (window.innerWidth < 768) {
        // Open gift sheet on mobile
        const event = new CustomEvent('openGiftSheet');
        window.dispatchEvent(event);
      } else {
        window.location.href = '/gift';
      }
    } else if (action === 'timeline') {
      window.location.href = '/timeline';
    }
    // For hash links, default <a> behaviour handles scrolling
  };

  const postCountdown = dayHasCome(new Date(config.couple.weddingDate)) || isTestEnv();
  const showRsvp = shouldShowForm(config.couple.formEndingDate);

  const navItems = [
    { href: '#countdownTitle', action: 'countdown', icon: '⏳', label: t.navCountdown as string },
    ...(showRsvp ? [{ href: '#formTitle', action: 'rsvp', icon: '📝', label: t.navRsvp as string }] : []),
    ...(postCountdown ? [{ href: '#instagramShare', action: 'instagram', icon: '📸', label: t.navInstagram as string }] : []),
    { href: '#info-buttons', action: 'location', icon: '📍', label: t.navLocation as string },
    ...(postCountdown ? [{ href: '#', action: 'timeline', icon: '🕒', label: t.navTimeline as string }] : []),
    { href: '#', action: 'gift', icon: '🎁', label: t.navGift as string },
  ];

  return (
    <nav className={`navbar ${isVisible ? '' : 'hidden'}`}>
      <div className="nav-container">
        <a href="#title" className="nav-logo">
          <img src="/assets/img/vowlogo.png" alt="Vow" className="nav-logo-img" />
        </a>
        <button
          className={`nav-toggle ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? '✕' : '☰'}
        </button>
        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <li key={item.action}>
              <a
                href={item.href}
                onClick={(e) => {
                  if (item.action === 'gift' || item.action === 'timeline') {
                    e.preventDefault();
                  }
                  handleNavClick(item.action);
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
