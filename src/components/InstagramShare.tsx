'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/config/translations';
import { WeddingConfig } from '@/types/wedding';
import { dayHasCome, isTestEnv } from '@/utils/dateUtils';
import AnimateOnScroll from '@/components/AnimateOnScroll';

interface InstagramShareProps {
  config: WeddingConfig;
}

export default function InstagramShare({ config }: InstagramShareProps) {
  const [language] = useLanguage();
  const t = translations[language];
  const show = dayHasCome(new Date(config.couple.weddingDate)) || isTestEnv();

  if (!show) return null;

  const openInstagram = () => {
    const instagramApp = 'instagram://camera';
    const instagramWeb = 'https://www.instagram.com/';

    if (/iPhone|iPad|iPod|Android/.test(navigator.userAgent)) {
      window.location.href = instagramApp;
    } else {
      setTimeout(() => {
        window.open(instagramWeb, '_blank');
      }, 800);
    }
  };

  const onClickShareAPhoto = () => {
    if (config.couple.wedshoots) {
      navigator.clipboard.writeText(config.couple.wedshoots.code);
      if ('vibrate' in navigator) {
        navigator.vibrate([150, 80, 150]);
      }
      window.open(config.couple.wedshoots.url, '_blank');
    }
  };

  return (
    <AnimateOnScroll animation="zoom-in">
      <div id="instagramShare" className="instagram-share">
        <p style={{ marginTop: '12px', fontSize: '0.85rem', opacity: 0.7 }}>
          {t.tagAdvice as string}{' '}
          <strong id="tagEra">{config.couple.instagram.bride}</strong> e{' '}
          <strong id="tagFede">{config.couple.instagram.groom}</strong>
        </p>

        <button className="ig-button" onClick={openInstagram}>
          {t.shareOnInstagram as string}
        </button>
        <br />
        {config.couple.wedshoots && (
          <>
            <button
              id="wedshootsBtn"
              className="action-btn"
              onClick={onClickShareAPhoto}
            >
              <span dangerouslySetInnerHTML={{ __html: t.wedshoots_btn as string }}></span>
            </button>
            <br />
          </>
        )}
      </div>
    </AnimateOnScroll>
  );
}
