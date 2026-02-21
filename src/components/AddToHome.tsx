'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { getMergedTranslations } from '@/utils/translations';
import { WeddingConfig } from '@/types/wedding';
import AnimateOnScroll from '@/components/AnimateOnScroll';

interface AddToHomeProps {
  config: WeddingConfig;
}

export default function AddToHome({ config }: AddToHomeProps) {
  const [language] = useLanguage();
  const t = getMergedTranslations(language, config);

  return (
    <AnimateOnScroll animation="fade-up">
      <section className="add-to-home">
        <h2>{t.addHomeTitle as string}</h2>

        <div style={{ maxWidth: 700, margin: 'auto', fontSize: '15px', lineHeight: 1.6 }}>
          <p>{t.addHomeIntro as string}</p>

          <div style={{ textAlign: 'left', marginTop: 20 }}>
            <p>
              <strong>📱 iPhone (Safari)</strong><br />
              <span dangerouslySetInnerHTML={{ __html: t.iosSteps as string }}></span>
            </p>

            <p>
              <strong>🤖 Android (Chrome)</strong><br />
              <span dangerouslySetInnerHTML={{ __html: t.androidSteps as string }}></span>
            </p>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
}
