export interface Location {
  name: string;
  address: string;
  mapsUrl: string;
}

export interface Gift {
  iban: string;
  accountHolder: string;
}

export interface Instagram {
  bride: string;
  groom: string;
}

export interface Videos {
  it: string;
  en: string;
}

export interface TimelineEvent {
  start: string;
  end: string;
  key: string;
}

export interface WedShoots {
  code: string;
  url: string;
}

export interface Couple {
  names: [string, string];
  weddingDate: string;
  location: Location;
  gift: Gift;
  formUrl: string;
  formEndingDate?: string;
  hashtag: string;
  instagram: Instagram;
  videos: Videos;
  timeline?: TimelineEvent[];
  wedshoots?: WedShoots;
  calendarIcs?: string;
}

export interface Metadata {
  siteName?: string;
  ogImage?: string;
  ogUrl?: string;
  coupleSlug?: string;
}

export interface WeddingConfig {
  couple: Couple;
  metadata?: Metadata;
  customTranslations?: {
    it?: Record<string, string>;
    en?: Record<string, string>;
  };
}

export type Language = 'it' | 'en';

export interface Translations {
  [key: string]: string | Translations;
}
