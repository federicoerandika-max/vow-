'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/config/translations';
import { WeddingConfig } from '@/types/wedding';

interface VideoTooltipsProps {
  config: WeddingConfig;
}

export default function VideoTooltips({ config }: VideoTooltipsProps) {
  const [language] = useLanguage();
  const t = translations[language];

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
    <>
      <div className="tooltip location" onClick={openMaps} style={{ display: 'block' }}>
        📍 <span id="locationLabel">{t.location as string}</span>
      </div>
      <div className="tooltip date" onClick={addToCalendar} style={{ display: 'block' }}>
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
        <span id="dateLabel">{t.date as string}</span>
      </div>
    </>
  );
}
