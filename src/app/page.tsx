'use client';

import { useState, useEffect, useRef } from 'react';
import { WeddingConfig } from '@/types/wedding';
import { useLanguage } from '@/hooks/useLanguage';
import { getMergedTranslations } from '@/utils/translations';
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
import AnimateOnScroll from '@/components/AnimateOnScroll';

export default function HomePage() {
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [language, setLanguage] = useLanguage();
  const [videoEnded, setVideoEnded] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [giftSheetOpen, setGiftSheetOpen] = useState(false);
  const [langSwitchFlash, setLangSwitchFlash] = useState(false);
  const langVideoRef = useRef<HTMLVideoElement>(null);

  const triggerLangVideoFlash = () => {
    if (!config || !videoEnded) return; // Only flash if user already saw the video
    setLangSwitchFlash(true);
    // Lock scroll during flash
    document.body.classList.add('lock-scroll');
  };

  // Handle the flash video lifecycle
  useEffect(() => {
    if (!langSwitchFlash || !config) return;
    const video = langVideoRef.current;
    if (!video) return;

    // Set source to current language video
    video.src = config.couple.videos[language];
    video.currentTime = 1;
    video.play().catch(console.error);

    const timeout = setTimeout(() => {
      video.pause();
      setLangSwitchFlash(false);
      document.body.classList.remove('lock-scroll');
    }, 1500);

    return () => clearTimeout(timeout);
  }, [langSwitchFlash, config, language]);

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

    // Listener per il cambio lingua (solo per il video flash)
    const handleLanguageChange = () => {
      triggerLangVideoFlash();
    };

    loadConfig();
    window.addEventListener('openGiftSheet', handleOpenGiftSheet);
    window.addEventListener('languagechange', handleLanguageChange);
    
    return () => {
      window.removeEventListener('openGiftSheet', handleOpenGiftSheet);
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, [setLanguage]);

  if (!config) {
    return <div>Loading...</div>;
  }

  const T = getMergedTranslations(language, config);
  const showFutureUpdates = !dayHasCome(new Date(config.couple.weddingDate)) && !isTestEnv();

  return (
    <>
      <Navbar config={config} videoSkipped={!showVideo} />
      <div className="container">
        <LanguageSwitch />

        <h1 id="title">{T.title as string}</h1>

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

        <AnimateOnScroll animation="fade-up">
          <h2 id="countdownTitle">
            {T.countdownTitle as string}
          </h2>
        </AnimateOnScroll>
        <Countdown config={config} language={language} />

        <AnimateOnScroll animation="fade-up" delay={150}>
          <p
            id="intro"
            style={{ marginTop: '30px', lineHeight: '1.7', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}
            dangerouslySetInnerHTML={{ __html: T.intro as string }}
          ></p>
        </AnimateOnScroll>

        <br />
        <br />
        <AnimateOnScroll animation="fade-up" delay={300}>
          <div id="signature">
            <span id="signatureText">
              {config.couple.names.join(' & ')}
            </span>
          </div>
        </AnimateOnScroll>

        <RSVPForm config={config} />

        <br />
        <AnimateOnScroll animation="fade-up" delay={150}>
          <div className="future-updates">
            <span className="future-icon">✨</span>
            <p id="futureUpdates">
              {showFutureUpdates
                ? (T.futureUpdates as string)
                : (T.formRevealed as string)}
            </p>
          </div>
        </AnimateOnScroll>

        <InstagramShare config={config} />

        <InfoButtons config={config} />
      </div>

      <GiftSheet
        config={config}
        isOpen={giftSheetOpen}
        onClose={() => setGiftSheetOpen(false)}
      />

      <AnimateOnScroll animation="fade-up">
        <footer className="site-footer" id="footer">
          <p
            id="footerText"
            dangerouslySetInnerHTML={{ __html: T.footer as string }}
          ></p>
        </footer>
      </AnimateOnScroll>

      {/* Language switch fullscreen video flash */}
      <div className={`lang-video-flash ${langSwitchFlash ? 'active' : ''}`}>
        <video
          ref={langVideoRef}
          muted
          playsInline
        />
      </div>
    </>
  );
}
