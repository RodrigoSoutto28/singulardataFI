/**
 * Free IP geolocation services with automatic fallback.
 * Only HTTPS endpoints to avoid mixed-content issues.
 */

export interface GeolocationResult {
  countryCode: string;
  countryName: string;
  city?: string;
  region?: string;
  timezone?: string;
  currency?: string;
  ip?: string;
  service: string;
}

interface IpApiCoResponse {
  error?: boolean;
  reason?: string;
  country_code?: string;
  country_name?: string;
  city?: string;
  region?: string;
  timezone?: string;
  currency?: string;
  ip?: string;
}

interface IpWhoIsResponse {
  success?: boolean;
  message?: string;
  country_code?: string;
  country?: string;
  city?: string;
  region?: string;
  timezone?: { id?: string };
  currency?: { code?: string };
  ip?: string;
}

export interface GeolocationService {
  name: string;
  endpoint: string;
  priority: number;
  rateLimit: { requestsPerDay: number; requestsPerMinute: number };
  parse: (response: Record<string, unknown>) => GeolocationResult;
}

const IPAPI_CO: GeolocationService = {
  name: 'ipapi.co',
  endpoint: 'https://ipapi.co/json/',
  priority: 1,
  rateLimit: { requestsPerDay: 1000, requestsPerMinute: 60 },
  parse: (response) => {
    const data = response as unknown as IpApiCoResponse;
    if (!data || data.error || !data.country_code) {
      throw new Error(data?.reason || 'Invalid ipapi.co response');
    }
    return {
      countryCode: data.country_code,
      countryName: data.country_name || '',
      city: data.city,
      region: data.region,
      timezone: data.timezone,
      currency: data.currency,
      ip: data.ip,
      service: 'ipapi.co',
    };
  },
};

const IPWHO_IS: GeolocationService = {
  name: 'ipwho.is',
  endpoint: 'https://ipwho.is/',
  priority: 2,
  rateLimit: { requestsPerDay: 10000, requestsPerMinute: 60 },
  parse: (response) => {
    const data = response as unknown as IpWhoIsResponse;
    if (!data || data.success === false || !data.country_code) {
      throw new Error(data?.message || 'Invalid ipwho.is response');
    }
    return {
      countryCode: data.country_code,
      countryName: data.country || '',
      city: data.city,
      region: data.region,
      timezone: data.timezone?.id,
      currency: data.currency?.code,
      ip: data.ip,
      service: 'ipwho.is',
    };
  },
};

export const GEOLOCATION_SERVICES: GeolocationService[] = [IPAPI_CO, IPWHO_IS];

export async function fetchGeolocation(
  service: GeolocationService,
  timeoutMs = 5000,
): Promise<GeolocationResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(service.endpoint, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    return service.parse(data);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`Timeout: ${service.name} did not respond in ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchGeolocationWithFallback(): Promise<GeolocationResult> {
  const errors: { service: string; error: string }[] = [];
  for (const service of GEOLOCATION_SERVICES) {
    try {
      console.log(`[Geolocation] trying ${service.name}…`);
      const result = await fetchGeolocation(service);
      console.log(`[Geolocation] ✓ ${service.name} → ${result.countryCode}`);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      errors.push({ service: service.name, error: msg });
      console.warn(`[Geolocation] ✗ ${service.name}: ${msg}`);
    }
  }
  throw new Error(
    `All geolocation services failed: ${errors.map((e) => `${e.service} (${e.error})`).join('; ')}`,
  );
}
