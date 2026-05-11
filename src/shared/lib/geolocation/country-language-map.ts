import type { SupportedLanguage } from '@/shared/lib/i18n/detector';

/** ISO 3166-1 alpha-2 → preferred app language. */
export const COUNTRY_TO_LANGUAGE: Record<string, SupportedLanguage> = {
  // Spanish
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es', EC: 'es',
  GT: 'es', CU: 'es', BO: 'es', DO: 'es', HN: 'es', PY: 'es', SV: 'es', NI: 'es',
  CR: 'es', PA: 'es', UY: 'es', GQ: 'es',
  // English
  US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en', ZA: 'en', SG: 'en',
  IN: 'en', PK: 'en', NG: 'en', KE: 'en', GH: 'en', ZW: 'en', JM: 'en', TT: 'en',
  BB: 'en', BZ: 'en', GY: 'en', PH: 'en', MY: 'en', HK: 'en', MT: 'en', CY: 'en',
  // Portuguese
  BR: 'pt', PT: 'pt', AO: 'pt', MZ: 'pt', GW: 'pt', TL: 'pt', MO: 'pt', CV: 'pt',
  ST: 'pt',
};

export function getLanguageFromCountry(
  countryCode: string,
  fallback: SupportedLanguage = 'en',
): SupportedLanguage {
  return COUNTRY_TO_LANGUAGE[countryCode.toUpperCase()] || fallback;
}

export interface MultilingualCountry {
  countryCode: string;
  languages: SupportedLanguage[];
  primary: SupportedLanguage;
  regions?: Record<string, SupportedLanguage>;
}

export const MULTILINGUAL_COUNTRIES: MultilingualCountry[] = [];

export function getLanguageFromCountryAndRegion(
  countryCode: string,
  region?: string,
): SupportedLanguage {
  const code = countryCode.toUpperCase();
  const ml = MULTILINGUAL_COUNTRIES.find((c) => c.countryCode === code);
  if (ml && region && ml.regions) {
    const match =
      ml.regions[region] ||
      ml.regions[region.trim()] ||
      Object.entries(ml.regions).find(([k]) => k.toLowerCase() === region.toLowerCase())?.[1];
    if (match) return match;
    return ml.primary;
  }
  return getLanguageFromCountry(code);
}

const HIGH_CONFIDENCE = new Set([
  'ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'BR', 'PT', 'US', 'GB', 'AU', 'IE', 'NZ',
]);

export function getCountryMappingConfidence(
  countryCode: string,
): 'high' | 'medium' | 'low' {
  const code = countryCode.toUpperCase();
  if (HIGH_CONFIDENCE.has(code)) return 'high';
  if (MULTILINGUAL_COUNTRIES.some((c) => c.countryCode === code)) return 'medium';
  if (COUNTRY_TO_LANGUAGE[code]) return 'high';
  return 'low';
}

