'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/config/translations';
import { WeddingConfig } from '@/types/wedding';
import { shouldShowForm, isTestEnv } from '@/utils/dateUtils';
import AnimateOnScroll from '@/components/AnimateOnScroll';

interface RSVPFormProps {
  config: WeddingConfig;
}

export default function RSVPForm({ config }: RSVPFormProps) {
  const [language] = useLanguage();
  const t = translations[language];
  const showForm = shouldShowForm(config.couple.formEndingDate) || isTestEnv();

  if (!showForm) return null;

  return (
    <>
      <AnimateOnScroll animation="fade-up">
        <h2 id="formTitle">
          {t.formTitle as string}
        </h2>
      </AnimateOnScroll>
      <div id="moduleForm">
        <iframe
          src={config.couple.formUrl}
          width="100%"
          height="900"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
        ></iframe>
      </div>
    </>
  );
}
