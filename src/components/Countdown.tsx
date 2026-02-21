'use client';

import { useMemo } from 'react';
import { useCountdown } from '@/hooks/useCountdown';
import { Language } from '@/types/wedding';
import { WeddingConfig } from '@/types/wedding';
import AnimateOnScroll from '@/components/AnimateOnScroll';

interface CountdownProps {
  config: WeddingConfig;
  language: Language;
}

export default function Countdown({ config, language }: CountdownProps) {
  const weddingDate = useMemo(() => new Date(config.couple.weddingDate), [config.couple.weddingDate]);
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
    <AnimateOnScroll animation="zoom-in" delay={300}>
      <div className="countdown">
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
    </AnimateOnScroll>
  );
}
