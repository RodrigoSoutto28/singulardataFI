# Sistema de internacionalización (i18n) con detección automática

## Estado actual

- `src/contexts/LanguageContext.tsx` ya existe y maneja `Language = 'ES' | 'EN' | 'PT'` (uppercase) con persistencia en `localStorage('app-language')`.
- `src/i18n/translations.ts` (1472 líneas) tiene un diccionario muy completo en ES/EN/PT con tipo `Translations` estructurado.
- `TopBar.tsx` ya incluye un mini-selector de idioma con códigos uppercase.
- No existe columna `language` en `profiles`, ni `useLanguageDetection`, ni archivo `src/lib/i18n/*`.
- El hook de auth real es `useAuth` desde `@/contexts/AuthContext` (no `@/hooks/useAuth`).

## Decisiones de diseño

Para no romper las 1472 líneas de traducciones existentes ni todos los componentes que usan `language: 'ES'|'EN'|'PT'` y `t.xxx`:

1. **Mantener** los códigos internos del contexto (`'ES' | 'EN' | 'PT'`) y **agregar** `'FR'` como cuarto idioma soportado.
2. El detector trabaja con códigos minúsculos (`es/en/pt/fr`) por convención BCP-47, y se mapea a/desde los códigos uppercase del contexto.
3. La columna `language` en BD se guarda en minúsculas (`es/en/pt/fr`) para alinearse con estándar y con `navigator.language`.
4. Reemplazar el mini-selector inline del `TopBar` por el nuevo `<LanguageSelector variant="compact" />` reutilizable.

## Cambios

### Base de datos (migración)

```sql
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'es'
    CHECK (language IN ('es','en','pt','fr'));

CREATE INDEX IF NOT EXISTS idx_profiles_language ON public.profiles(language);
```

Tras la migración, `src/integrations/supabase/types.ts` se regenera automáticamente con la nueva columna.

### Archivos nuevos

1. **`src/lib/i18n/detector.ts`** — `SupportedLanguage = 'es'|'en'|'pt'|'fr'`, `detectBrowserLanguage()`, `detectUserLanguage(saved?)`, `validateLanguage()`, `getLanguageName()`, `getLanguageFlag()`. Helpers `toContextCode('es') -> 'ES'` y `toDbCode('ES') -> 'es'` para puentear ambos sistemas. (Sin `detectLanguageByIP` activo: queda comentado para evitar llamadas externas no deseadas.)

2. **`src/hooks/useLanguageDetection.ts`** — Hook que en el primer render:
   - Si hay user, lee `profiles.language` de la BD.
   - Si no hay valor en BD ni en `localStorage('app-language')`, ejecuta `detectUserLanguage()` y aplica el resultado vía `setLanguage(toContextCode(...))`.
   - Si hay user pero su perfil no tenía `language`, persiste el detectado en BD.
   - Devuelve `{ isDetecting, detectionComplete }`. No bloquea UI por defecto (la detección es no-bloqueante; solo evita parpadeos).

3. **`src/components/LanguageSelector.tsx`** — Dropdown con bandera + nombre. Variantes:
   - `variant="default"`: botón ancho con `Globe` + bandera + nombre actual.
   - `variant="compact"`: solo bandera (para `TopBar`).
   - Al cambiar: actualiza contexto y, si hay usuario, persiste `profiles.language` (en minúsculas). Toast de confirmación en el nuevo idioma.

### Archivos modificados

4. **`src/i18n/translations.ts`** — Añadir `'FR'` al type `Language` y un objeto `fr` con la misma forma que `es/en/pt`. Para no expandir 1472 líneas en una sola pasada, el objeto `fr` se construye reutilizando claves: traducción completa de las secciones críticas (common, nav, topbar, auth, dashboard, settings, journal, analytics, psychology, insights, reports, onboarding, errors, toasts) y para el resto se hace fallback automático a `en` mediante un proxy `Proxy`-based deep-merge en runtime, garantizando que `t.xxx.yyy` nunca devuelva `undefined`.

5. **`src/contexts/LanguageContext.tsx`** — Añadir `'FR'` al inicializador (validar contra los 4 idiomas). Sin cambios estructurales.

6. **`src/components/layout/TopBar.tsx`** — Reemplazar el bloque `languages.map(...)` actual por `<LanguageSelector variant="compact" />`.

7. **`src/pages/Auth.tsx`** — En `useEffect` al montar: si no hay user y no hay `localStorage('app-language')`, ejecutar `detectUserLanguage()` y aplicar. En `handleSignUp`, tras `signUp` exitoso, guardar el idioma actual en `profiles.language` (al perfil recién creado por el trigger `handle_new_user`).

8. **`src/App.tsx`** — Montar `useLanguageDetection()` dentro del provider para que se ejecute una vez por sesión. **No** mostrar splash bloqueante (la detección inicial usa el valor de `localStorage` sincrónicamente; solo persiste/sincroniza con BD en background).

## Flujo resultante

```text
Primera visita (sin login)
  -> detectBrowserLanguage() -> setLanguage en contexto + localStorage
  
Sign up
  -> trigger crea profile -> Auth.tsx update profiles.language = idioma actual
  
Login posterior
  -> useLanguageDetection lee profiles.language -> setLanguage si difiere
  
Cambio manual via LanguageSelector
  -> setLanguage + localStorage + (si user) update profiles.language
```

## Notas técnicas

- No se usa detección por IP (latencia + privacidad). El stub queda en el detector pero no se invoca.
- El selector usa `getLanguageFlag` con emojis Unicode; no se añaden imágenes.
- El hook `useAuth` correcto es `from '@/contexts/AuthContext'` (no `@/hooks/useAuth` como sugería el spec).
- Las traducciones FR cubren todas las strings visibles en navegación principal; cualquier clave no traducida cae a EN automáticamente vía proxy de fallback (sin romper TypeScript ni mostrar `undefined`).
