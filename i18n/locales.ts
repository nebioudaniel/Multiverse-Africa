// src/i18n/locales.ts
export const locales = ['am', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'am'; // This ensures Amharic is the default

export const localeNames: Record<Locale, string> = {
  am: 'አማርኛ',
  en: 'English',
};