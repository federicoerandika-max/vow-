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
  wedshoots?: {
    code: string;
    url: string;
  };
  calendarIcs?: string;
}

export interface WeddingConfig {
  couple: Couple;
  metadata?: {
    siteName?: string;
    ogImage?: string;
    ogUrl?: string;
  };
}

export type Language = 'it' | 'en';

export interface Translations {
  [key: string]: string | Translations;
}
