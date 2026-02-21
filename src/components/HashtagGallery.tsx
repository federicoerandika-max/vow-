'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { getMergedTranslations } from '@/utils/translations';
import { WeddingConfig } from '@/types/wedding';
import { dayHasCome, isTestEnv } from '@/utils/dateUtils';
import AnimateOnScroll from '@/components/AnimateOnScroll';

interface HashtagGalleryProps {
  config: WeddingConfig;
}

export default function HashtagGallery({ config }: HashtagGalleryProps) {
  const [language] = useLanguage();
  const t = getMergedTranslations(language, config);
  const show = dayHasCome(new Date(config.couple.weddingDate)) || isTestEnv();

  if (!show) return null;

  return (
    <AnimateOnScroll animation="fade-up">
      <section id="hashtagGallery" className="hashtag-gallery">
        <h3>{t.hashtagGalleryTitle as string}</h3>
        <p dangerouslySetInnerHTML={{ __html: t.publishedPhotos as string }}></p>
      </section>
    </AnimateOnScroll>
  );
}
