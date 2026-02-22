'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { getMergedTranslations } from '@/utils/translations';
import { WeddingConfig } from '@/types/wedding';
import { dayHasCome, isTestEnv } from '@/utils/dateUtils';
import Link from 'next/link';
import AnimateOnScroll from '@/components/AnimateOnScroll';

interface InfoButtonsProps {
  config: WeddingConfig;
}

export default function InfoButtons({ config }: InfoButtonsProps) {
  const [language] = useLanguage();
  const t = getMergedTranslations(language, config);
  const showTimeline = dayHasCome(new Date(config.couple.weddingDate)) || isTestEnv();
  const hideSaveDate = dayHasCome(new Date(config.couple.weddingDate)) || isTestEnv();

  const openMaps = () => {
    window.open(config.couple.location.mapsUrl, '_blank');
  };

  const addToCalendar = () => {
    const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const weddingDate = new Date(config.couple.weddingDate);
    const coupleNames = config.couple.names.join(' & ');
    
    if (isApple || isAndroid) {
      // Mobile devices: download .ics file (both iOS and Android handle it natively)
      window.location.href = config.couple.calendarIcs || '/wedding.ics';
    } else {
      // Desktop / Windows: open Google Calendar
      const startDate = weddingDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endDate = new Date(weddingDate.getTime() + 10 * 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0] + 'Z';
      
      window.open(
        `https://www.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent('Wedding – ' + coupleNames)}` +
        `&dates=${startDate}/${endDate}` +
        `&details=${encodeURIComponent("We can't wait to celebrate together 💍")}` +
        `&location=${encodeURIComponent(config.couple.location.name + ', ' + config.couple.location.address)}`,
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
              🕒 <span>{t.timeline as string}</span>
            </button>
            <br />
          </div>
        )}
        <button onClick={openMaps}>
          📍 <span>{t.btnLocation as string}</span>
        </button>
        {!hideSaveDate && (
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
        )}
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
