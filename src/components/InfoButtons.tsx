'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/config/translations';
import { WeddingConfig } from '@/types/wedding';
import { dayHasCome, isTestEnv } from '@/utils/dateUtils';
import Link from 'next/link';
import AnimateOnScroll from '@/components/AnimateOnScroll';

interface InfoButtonsProps {
  config: WeddingConfig;
}

export default function InfoButtons({ config }: InfoButtonsProps) {
  const [language] = useLanguage();
  const t = translations[language];
  const showTimeline = dayHasCome(new Date(config.couple.weddingDate)) || isTestEnv();

  const openMaps = () => {
    window.open(config.couple.location.mapsUrl, '_blank');
  };

  const addToCalendar = () => {
    const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
    const weddingDate = new Date(config.couple.weddingDate);
    
    if (isApple) {
      window.location.href = config.couple.calendarIcs || '/wedding.ics';
    } else {
      const startDate = weddingDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endDate = new Date(weddingDate.getTime() + 10 * 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0] + 'Z';
      
      window.open(
        `https://www.google.com/calendar/render?action=TEMPLATE` +
        `&text=Wedding` +
        `&dates=${startDate}/${endDate}` +
        `&location=${encodeURIComponent(config.couple.location.address)}`,
        '_blank'
      );
    }
  };

  return (
    <AnimateOnScroll animation="fade-up" className="info-buttons-wrapper">
      <div className="info-buttons" id="info-buttons">
        {showTimeline && (
          <div className="btn-timeline">
            <button onClick={() => window.location.href = '/timeline'}>
              <span>{t.timeline as string}</span>
            </button>
            <br />
          </div>
        )}
        <button onClick={openMaps}>
          📍 <span>{t.btnLocation as string}</span>
        </button>
        <button onClick={addToCalendar}>
          <img
            src="/assets/img/june-11-calendar.png"
            alt="calendar icon"
            width="50"
            height="50"
            style={{
              border: 'none',
              margin: '-13px',
              position: 'relative',
              top: '4px',
            }}
          />{' '}
          <span>{t.btnDate as string}</span>
        </button>
        <button onClick={() => {
          if (window.innerWidth < 768) {
            // Open gift sheet on mobile
            const event = new CustomEvent('openGiftSheet');
            window.dispatchEvent(event);
          } else {
            window.location.href = '/gift';
          }
        }}>
          🎁 <span>{t.btnGift as string}</span>
        </button>
      </div>
    </AnimateOnScroll>
  );
}
