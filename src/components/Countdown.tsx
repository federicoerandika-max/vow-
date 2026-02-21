'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { Language } from '@/types/wedding';
import { WeddingConfig } from '@/types/wedding';

interface CountdownProps {
  config: WeddingConfig;
  language: Language;
}

export default function Countdown({ config, language }: CountdownProps) {
  const weddingDate = new Date(config.couple.weddingDate);
  const countdown = useCountdown(weddingDate);

  const labels = {
    it: {
      days: 'Giorni',
      hours: 'Ore',
      minutes: 'Min',
      seconds: 'Sec',
    },
    en: {
      days: 'Days',
      hours: 'Hours',
      minutes: 'Min',
      seconds: 'Sec',
    },
  };

  const t = labels[language];

  return (
    <div className="countdown" data-aos="zoom-in" data-aos-delay="300">
      <div>
        {countdown.days}
        <br />
        {t.days}
      </div>
      <div>
        {countdown.hours}
        <br />
        {t.hours}
      </div>
      <div>
        {countdown.minutes}
        <br />
        {t.minutes}
      </div>
      <div>
        {countdown.seconds}
        <br />
        {t.seconds}
      </div>
    </div>
  );
}
