'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { getMergedTranslations } from '@/utils/translations';
import { WeddingConfig, TimelineEvent } from '@/types/wedding';
import { parseTime, formatTimeRange } from '@/utils/dateUtils';
import LanguageSwitch from '@/components/LanguageSwitch';

export default function TimelinePage() {
  const [language] = useLanguage();
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [currentEvent, setCurrentEvent] = useState<TimelineEvent | null>(null);
  const [nextEvent, setNextEvent] = useState<TimelineEvent | null>(null);
  const t = getMergedTranslations(language, config);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!config?.couple.timeline) return;

    const updateCurrentEvent = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const schedule = config.couple.timeline!;

      let current: TimelineEvent | null = null;
      let next: TimelineEvent | null = null;

      for (const event of schedule) {
        const start = parseTime(event.start);
        const end = parseTime(event.end);
        if (currentMinutes >= start && currentMinutes <= end) {
          current = event;
        }
        if (currentMinutes < start && !next) {
          next = event;
        }
      }

      setCurrentEvent(current);
      setNextEvent(next);
    };

    updateCurrentEvent();
    const interval = setInterval(updateCurrentEvent, 30000);
    return () => clearInterval(interval);
  }, [config]);

  if (!config || !config.couple.timeline) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <img
            src="/assets/img/vow-logo.png"
            alt="Vow"
            className="loading-logo"
          />
          <div className="loading-bar-track">
            <div className="loading-bar-fill"></div>
          </div>
        </div>
      </div>
    );;
  }

  const getEventTitle = (key: string): string => {
    return (t[`e_${key}` as keyof typeof t] as string) || key;
  };

  const getEventDescription = (key: string): string => {
    return (t[`e_${key}_d` as keyof typeof t] as string) || '';
  };

  const schedule = config.couple.timeline.map(event => ({
    ...event,
    title: getEventTitle(event.key),
    desc: getEventDescription(event.key),
  }));

  return (
    <div className="container">
      <LanguageSwitch />
      <Link href="/" className="back">
        {t.backHome as string}
      </Link>

      <h1>{t.programTitle as string}</h1>
      <p className="muted" style={{ lineHeight: '1.6', maxWidth: '700px', margin: '10px auto 24px' }}>
        {t.programIntro as string}
      </p>

      <div className="card">
        <div className="now-title">{t.nowLabel as string}</div>
        <div className="now-event">
          {currentEvent
            ? `${getEventTitle(currentEvent.key)} (${formatTimeRange(currentEvent.start, currentEvent.end)})`
            : (t.waiting as string)}
        </div>
        <div className="muted">
          {nextEvent
            ? `${t.nextPrefix as string} ${getEventTitle(nextEvent.key)} — ${nextEvent.start}`
            : (t.nextEnd as string)}
        </div>
      </div>

      <div className="card">
        <h2>{t.timelineTitle as string}</h2>
        <div className="timeline">
          {schedule.map((event, i) => {
            const isNow = currentEvent?.key === event.key && 
                         currentEvent?.start === event.start;
            return (
              <div
                key={i}
                className={`tl-row ${isNow ? 'is-now' : ''}`}
                data-i={i}
              >
                <div className="tl-time">{formatTimeRange(event.start, event.end)}</div>
                <div>
                  <div className="tl-title">{event.title}</div>
                  <div className="tl-desc">{event.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="site-footer">
        <p dangerouslySetInnerHTML={{ __html: t.footer as string }}></p>
      </footer>
    </div>
  );
}
