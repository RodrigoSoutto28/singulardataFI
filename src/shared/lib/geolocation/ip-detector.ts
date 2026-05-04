import type { SupportedLanguage } from '@/shared/lib/i18n/detector';
import { fetchGeolocationWithFallback } from './services';
import {
  getCountryMappingConfidence,
  getLanguageFromCountryAndRegion,
} from './country-language-map';
import { cacheGeolocation, getCachedGeolocation } from './cache';

export interface IPLanguageDetection {
  language: SupportedLanguage;
  confidence: 'high' | 'medium' | 'low';
  country: string;
  countryName: string;
  city?: string;
  region?: string;
  cached: boolean;
  service?: string;
}

function fromCache(): IPLanguageDetection | null {
  const cached = getCachedGeolocation();
  if (!cached) return null;
  return {
    language: getLanguageFromCountryAndRegion(cached.countryCode, cached.region),
    confidence: getCountryMappingConfidence(cached.countryCode),
    country: cached.countryCode,
    countryName: cached.countryName,
    city: cached.city,
    region: cached.region,
    cached: true,
    service: cached.service,
  };
}

export function detectLanguageByIPFromCache(): IPLanguageDetection | null {
  return fromCache();
}

export async function detectLanguageByIP(): Promise<IPLanguageDetection> {
  const cached = fromCache();
  if (cached) return cached;
  try {
    const geo = await fetchGeolocationWithFallback();
    cacheGeolocation(geo);
    return {
      language: getLanguageFromCountryAndRegion(geo.countryCode, geo.region),
      confidence: getCountryMappingConfidence(geo.countryCode),
      country: geo.countryCode,
      countryName: geo.countryName,
      city: geo.city,
      region: geo.region,
      cached: false,
      service: geo.service,
    };
  } catch (err) {
    console.warn('[IP detection] all services failed:', err);
    return {
      language: 'en',
      confidence: 'low',
      country: 'UNKNOWN',
      countryName: 'Unknown',
      cached: false,
    };
  }
}

