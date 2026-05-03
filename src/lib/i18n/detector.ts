/**
 * Language detection utilities.
 * Internal context codes are uppercase ('ES'|'EN'|'PT'|'FR') while
 * BCP-47 / DB codes are lowercase ('es'|'en'|'pt'|'fr').
 */
import type { Language } from '@/i18n/translations';

export type SupportedLanguage = 'es' | 'en' | 'pt' | 'fr';

export interface LanguageDetectionResult {
  language: SupportedLanguage;
  confidence: 'high' | 'medium' | 'low';
  source: 'database' | 'browser' | 'ip' | 'fallback';
}

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['es', 'en', 'pt', 'fr'];
const DEFAULT_LANGUAGE: SupportedLanguage = 'es';

const LANGUAGE_MAPPING: Record<string, SupportedLanguage> = {
  es: 'es', 'es-ES': 'es', 'es-MX': 'es', 'es-AR': 'es', 'es-CO': 'es', 'es-CL': 'es', 'es-PE': 'es',
  en: 'en', 'en-US': 'en', 'en-GB': 'en', 'en-CA': 'en', 'en-AU': 'en',
  pt: 'pt', 'pt-BR': 'pt', 'pt-PT': 'pt',
  fr: 'fr', 'fr-FR': 'fr', 'fr-CA': 'fr', 'fr-BE': 'fr',
};

export function detectBrowserLanguage(): LanguageDetectionResult {
  try {
    const browserLanguages = navigator.languages || [navigator.language];
    for (const lang of browserLanguages) {
      const base = lang.split('-')[0];
      const mapped = LANGUAGE_MAPPING[lang] || LANGUAGE_MAPPING[base];
      if (mapped && SUPPORTED_LANGUAGES.includes(mapped)) {
        return { language: mapped, confidence: 'high', source: 'browser' };
      }
    }
  } catch (e) {
    console.warn('Error detecting browser language:', e);
  }
  return { language: DEFAULT_LANGUAGE, confidence: 'low', source: 'fallback' };
}

export async function detectUserLanguage(
  userSavedLanguage?: string | null,
): Promise<LanguageDetectionResult> {
  if (userSavedLanguage && SUPPORTED_LANGUAGES.includes(userSavedLanguage as SupportedLanguage)) {
    return { language: userSavedLanguage as SupportedLanguage, confidence: 'high', source: 'database' };
  }
  return detectBrowserLanguage();
}

export function validateLanguage(lang: string | null | undefined): SupportedLanguage {
  return lang && SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
    ? (lang as SupportedLanguage)
    : DEFAULT_LANGUAGE;
}

export function getLanguageName(lang: SupportedLanguage): string {
  return { es: 'Español', en: 'English', pt: 'Português', fr: 'Français' }[lang];
}

export function getLanguageFlag(lang: SupportedLanguage): string {
  return { es: '🇪🇸', en: '🇺🇸', pt: '🇧🇷', fr: '🇫🇷' }[lang];
}

/** Bridge helpers between BCP-47 lowercase and the in-app uppercase context code. */
export function toContextCode(lang: SupportedLanguage): Language {
  return lang.toUpperCase() as Language;
}

export function toDbCode(lang: Language): SupportedLanguage {
  return lang.toLowerCase() as SupportedLanguage;
}

export const SUPPORTED_LANGUAGE_LIST = SUPPORTED_LANGUAGES;
