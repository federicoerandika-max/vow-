'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { getMergedTranslations } from '@/utils/translations';
import { WeddingConfig } from '@/types/wedding';

interface VideoTooltipsProps {
  config: WeddingConfig;
}

export default function VideoTooltips({ config }: VideoTooltipsProps) {
  const [language] = useLanguage();
  const t = getMergedTranslations(language, config);

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
