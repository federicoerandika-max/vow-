'use client';

import { useState, useEffect } from 'react';
import { WeddingConfig } from '@/types/wedding';
import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/config/translations';
import { dayHasCome, isTestEnv } from '@/utils/dateUtils';
import LanguageSwitch from '@/components/LanguageSwitch';
import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/VideoPlayer';
import VideoTooltips from '@/components/VideoTooltips';
import Countdown from '@/components/Countdown';
import RSVPForm from '@/components/RSVPForm';
import InstagramShare from '@/components/InstagramShare';
import InfoButtons from '@/components/InfoButtons';
import GiftSheet from '@/components/GiftSheet';

export default function HomePage() {
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [language] = useLanguage();
  const [videoEnded, setVideoEnded] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [giftSheetOpen, setGiftSheetOpen] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config');
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
          
          // Controlla se l'utente ha già visto il video
          if (typeof window !== 'undefined') {
            const videoKey = `wedding_video_seen_${data.couple.names.join('_')}`;
            const videoSeen = localStorage.getItem(videoKey);
            if (videoSeen === 'true') {
              setShowVideo(false);
              setVideoEnded(true);
              // Mostra navbar e tooltip subito se video già visto
              setTimeout(() => {
                const navbar = document.querySelector('.navbar');
                if (navbar) {
                  navbar.classList.remove('hidden');
                }
              }, 100);
            }
          }
        } else {
          console.error('Failed to load config:', response.statusText);
        }
      } catch (err) {
        console.error('Failed to load config:', err);
      }
    };

    const handleOpenGiftSheet = () => {
      setGiftSheetOpen(true);
    };

    loadConfig();
    window.addEventListener('openGiftSheet', handleOpenGiftSheet);
    
    return () => {
      window.removeEventListener('openGiftSheet', handleOpenGiftSheet);
    };
  }, []);

  if (!config) {
    return <div>Loading...</div>;
  }

  const t = translations[language];
  const showFutureUpdates = !dayHasCome(new Date(config.couple.weddingDate)) && !isTestEnv();

  return (
    <>
      <Navbar config={config} videoSkipped={!showVideo} />
      <div className="container">
        <LanguageSwitch />

        <h1 id="title">{t.title as string}</h1>

        <div className="video-wrapper">
          <VideoPlayer
            config={config}
            language={language}
            skipToEnd={!showVideo}
            onVideoEnd={() => {
              // Salva che l'utente ha visto il video
              if (typeof window !== 'undefined') {
                const videoKey = `wedding_video_seen_${config.couple.names.join('_')}`;
                localStorage.setItem(videoKey, 'true');
              }
              setVideoEnded(true);
              setShowVideo(false);
              if (typeof document !== 'undefined') {
                document.querySelectorAll('.tooltip').forEach((el: Element) => {
                  (el as HTMLElement).style.display = 'block';
                });
              }
            }}
          />
          {videoEnded && <VideoTooltips config={config} />}
        </div>

        <h2 id="countdownTitle" data-aos="fade-up">
          {t.countdownTitle as string}
        </h2>
        <Countdown config={config} language={language} />

        <p
          id="intro"
          style={{ marginTop: '30px', lineHeight: '1.7' }}
          data-aos="fade-up"
          data-aos-delay="150"
          dangerouslySetInnerHTML={{ __html: t.intro as string }}
        ></p>

        <br />
        <br />
        <div
          id="signature"
          data-aos="fade-up"
          data-aos-anchor="#formTitle"
          data-aos-delay="300"
        >
          <span id="signatureText">
            {config.couple.names.join(' & ')}
          </span>
        </div>

        <RSVPForm config={config} />

        <br />
        <div
          className="future-updates"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <span className="future-icon">✨</span>
          <p id="futureUpdates">
            {showFutureUpdates
              ? (t.futureUpdates as string)
              : (t.formRevealed as string)}
          </p>
        </div>

        <InstagramShare config={config} />

        <InfoButtons config={config} />
      </div>

      <GiftSheet
        config={config}
        isOpen={giftSheetOpen}
        onClose={() => setGiftSheetOpen(false)}
      />

      <footer className="site-footer fade-in-up visible" id="footer">
        <p
          id="footerText"
          dangerouslySetInnerHTML={{ __html: t.footer as string }}
        ></p>
      </footer>
    </>
  );
}
