# Detección de idioma por geolocalización IP

## Estado actual

- `src/lib/i18n/detector.ts` ya existe con `SupportedLanguage = 'es'|'en'|'pt'|'fr'`, `detectBrowserLanguage()` y `detectUserLanguage(saved?)`. Tiene `LanguageDetectionResult` con `source: 'database' | 'browser' | 'ip' | 'fallback'` (`'ip'` ya está previsto en el tipo).
- `useLanguageDetection.ts` invoca `detectUserLanguage(saved)` y persiste en `profiles.language`.
- `Settings.tsx`, `LanguageSelector.tsx` y la migración de `profiles.language` ya están en producción.
- No existen archivos en `src/lib/geolocation/` ni `useIPGeolocation`.

## Decisiones de diseño

1. **Solo HTTPS** entre los servicios free para evitar mixed-content (descarto `http://ip-api.com`; uso `https://ipapi.co` y `https://ipwho.is` — endpoint actual de ipwhois).
2. **No bloquear el primer render**: en `useLanguageDetection`, la IP se consulta solo si:
   - No hay idioma guardado en BD ni en `localStorage`, **o**
   - El usuario activa explícitamente la opción en Settings.
   El resultado se aplica de forma asíncrona; si llega antes de que el usuario interactúe, se actualiza el contexto.
3. **Cache de 7 días en `localStorage`** (`singular_geolocation_cache`) con `expiresAt` para evitar requests repetidos. No persiste la IP en BD.
4. **Override del usuario es ley**: si el usuario eligió un idioma manualmente (existe en `localStorage`), nunca lo sobrescribimos por IP.
5. **Tabla de analytics OPCIONAL**: la dejo fuera del scope inicial para no añadir migraciones/RLS hasta que el usuario lo pida.
6. **Sin secretos / sin API keys**: todos los servicios usados son free-tier sin auth. Omito `ipgeolocation.io`.

## Archivos nuevos

1. **`src/lib/geolocation/services.ts`**
   - `GeolocationResult`, `GeolocationService` (interfaces).
   - Servicios HTTPS: `IPAPI_CO` (`https://ipapi.co/json/`) y `IPWHO_IS` (`https://ipwho.is/`).
   - `fetchGeolocation(service, timeoutMs=5000)` con `AbortController`.
   - `fetchGeolocationWithFallback()` itera por prioridad y devuelve el primer éxito; agrega errores acumulados al fallar todos.

2. **`src/lib/geolocation/country-language-map.ts`**
   - `COUNTRY_TO_LANGUAGE` con ~70 países cubriendo ES/EN/PT/FR.
   - **Fix duplicado del spec**: el spec mapea `CA` dos veces (en y fr). Lo defino como `'en'` por defecto y muevo Quebec/New Brunswick a `MULTILINGUAL_COUNTRIES.regions`.
   - `getLanguageFromCountry(code, fallback='en')`.
   - `MULTILINGUAL_COUNTRIES` (CA, BE, CH) con `regions` para sub-detección.
   - `getLanguageFromCountryAndRegion(code, region?)`.
   - `getCountryMappingConfidence(code) -> 'high'|'medium'|'low'`.

3. **`src/lib/geolocation/cache.ts`**
   - Constantes: `CACHE_KEY = 'singular_geolocation_cache'`, `CACHE_DURATION_MS = 7d`.
   - `cacheGeolocation`, `getCachedGeolocation` (auto-limpia si expiró), `clearGeolocationCache`, `isCacheValid`, `getCacheTimeRemaining`.

4. **`src/lib/geolocation/ip-detector.ts`**
   - `IPLanguageDetection` interface.
   - `detectLanguageByIP()`: lee cache → si no hay, llama `fetchGeolocationWithFallback()` → cachea → mapea país+región a idioma → confianza. En error, devuelve `{ language: 'en', confidence: 'low', country: 'UNKNOWN', cached: false }`.
   - `detectLanguageByIPFromCache()`: variante síncrona, solo cache.

5. **`src/hooks/useIPGeolocation.ts`**
   - Estado `{ detection, isLoading, error }`.
   - Lee cache al montar (síncrono, vía `detectLanguageByIPFromCache`).
   - `detectLocation()` async para disparar fetch manual.
   - Opción `{ autoDetect?: boolean }`.

## Archivos modificados

6. **`src/lib/i18n/detector.ts`**
   - Añadir `'browser+ip'` y `'ip'` ya cubiertos por el tipo `source` (extender union si falta).
   - Sobrecargar `detectUserLanguage(saved?, useIPDetection=false)`:
     - Si `saved` válido → devolver `database` (sin tocar IP).
     - Detectar navegador.
     - Si `useIPDetection`: intentar IP con `try/catch`.
       - Coinciden → `confidence='high', source='browser+ip'`.
       - IP `high` y navegador no `high` → IP gana.
       - Navegador `high` y diferentes (probable VPN) → navegador gana.
       - Si IP `medium`/`high` → IP.
     - Fallback navegador.
   - **Default `useIPDetection=false`** para preservar comportamiento actual; los call-sites deciden si activar.

7. **`src/hooks/useLanguageDetection.ts`**
   - Leer flag `localStorage.getItem('singular_use_ip_detection') !== 'false'` (opt-out, default ON).
   - Solo activar IP cuando NO hay `saved` en BD ni en `localStorage('app-language')`.
   - Pasar `useIPDetection` a `detectUserLanguage`.
   - Mantener no-bloqueante: la detección sigue corriendo en background.

8. **`src/pages/Settings.tsx`** — añadir card "Detección de Ubicación":
   - Toggle `Switch` que escribe `localStorage('singular_use_ip_detection')`.
   - Bloque informativo de privacidad.
   - Si está activo, mostrar país/ciudad/idioma/servicio del cache (vía `useIPGeolocation()`).
   - Botón "Detectar ahora" que llama `detectLocation()` y refresca.
   - Botón "Limpiar cache" que llama `clearGeolocationCache()`.
   - Strings i18n: agregar claves `t.settings.geolocation.*` en ES/EN/PT (FR cae a EN por el proxy de fallback existente).

## Fuera de scope (mencionado en el spec, lo omito intencionalmente)

- **Tabla `language_detection_logs`** y `analytics.ts`: requeriría migración + RLS y captura de datos por usuario. Lo dejo para una iteración posterior si lo confirmás — agregar telemetría de IP toca privacidad y conviene decidir explícitamente.
- **`ipgeolocation.io`**: necesita API key; lo agregamos cuando quieras.

## Notas técnicas

- Todos los fetch usan `AbortController` con timeout 5s.
- Logging con `console.log/warn` con prefijo `[Geolocation]` para debug; ningún `console.error` que rompa.
- Sin nuevas dependencias.
- TypeScript estricto: tipos exportados, sin `any` salvo en parsers de respuestas externas.
- El mapeo `getLanguageFromCountry` con fallback a `'en'` significa que países no listados (ej. JP, DE, IT) no fuerzan cambio de idioma vs. navegador, lo cual es deseado.
