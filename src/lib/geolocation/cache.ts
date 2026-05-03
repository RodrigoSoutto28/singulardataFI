import type { GeolocationResult } from './services';

const CACHE_KEY = 'singular_geolocation_cache';
const CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedGeolocation {
  result: GeolocationResult;
  timestamp: number;
  expiresAt: number;
}

export function cacheGeolocation(result: GeolocationResult): void {
  try {
    const now = Date.now();
    const payload: CachedGeolocation = {
      result,
      timestamp: now,
      expiresAt: now + CACHE_DURATION_MS,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[Geolocation cache] save failed:', err);
  }
}

export function getCachedGeolocation(): GeolocationResult | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedGeolocation;
    if (Date.now() > parsed.expiresAt) {
      clearGeolocationCache();
      return null;
    }
    return parsed.result;
  } catch (err) {
    console.warn('[Geolocation cache] read failed:', err);
    return null;
  }
}

export function clearGeolocationCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (err) {
    console.warn('[Geolocation cache] clear failed:', err);
  }
}

export function isCacheValid(): boolean {
  return getCachedGeolocation() !== null;
}

export function getCacheTimeRemaining(): number {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as CachedGeolocation;
    return Math.max(0, Math.floor((parsed.expiresAt - Date.now()) / 1000));
  } catch {
    return 0;
  }
}
