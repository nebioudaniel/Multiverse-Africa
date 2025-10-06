// src/i18n/useTranslation.ts
"use client"; // <--- Add this line at the very top

import { usePathname } from 'next/navigation';
import { defaultLocale, locales, Locale } from './locales';
import translations from './translations'; // Assuming your translation data is here

// Define a type for your translation keys if you have a complex structure
// For example: type TranslationKeys = typeof translations['en'];

export function useTranslation() {
  const pathname = usePathname();

  // Extract the locale from the pathname
  // This assumes your locale is the first segment in the path, e.g., /en/register/step1
  const pathSegments = pathname.split('/').filter(Boolean); // Filters out empty strings
  const currentLocale = (pathSegments[0] as Locale) || defaultLocale;

  // Ensure the extracted locale is one of your defined locales, otherwise fall back to default
  const locale = locales.includes(currentLocale) ? currentLocale : defaultLocale;

  // A simple way to access translations based on the current locale
  // This assumes translations is an object like { en: { common: { ... } }, am: { ... } }
  const t = (key: string) => {
    // Basic deep access for translation keys, e.g., 'common.next'
    const keys = key.split('.');
    let text = translations[locale] as any; // Start with the locale's translation object
    for (const k of keys) {
      if (text && typeof text === 'object' && k in text) {
        text = text[k];
      } else {
        // Fallback for missing keys, optionally log a warning
        console.warn(`Translation key "${key}" not found for locale "${locale}"`);
        return key; // Return the key itself as a fallback
      }
    }
    return text || key; // Return the translated text or the key if text is empty
  };

  return { t: t, locale: locale };
}