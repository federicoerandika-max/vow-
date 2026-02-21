import { translations } from '@/config/translations';
import { WeddingConfig, Language, Translations } from '@/types/wedding';

/**
 * Returns merged translations: default translations + custom overrides from config.
 * Custom translations (from admin panel) take priority over defaults.
 */
export function getMergedTranslations(language: Language, config?: WeddingConfig | null): Translations {
  const defaults = translations[language];
  const custom = config?.customTranslations?.[language];
  if (!custom) return defaults;
  return { ...defaults, ...custom };
}
