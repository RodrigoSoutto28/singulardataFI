# Plan: Auditoría Crítica + Textura Públicas

## 1. Auditoría crítica (bloqueantes de comercialización)

### Auth & Sesión
- Confirmar `BYPASS_AUTH=false` en `ProtectedRoute.tsx` (ya está).
- `Auth.tsx`: hoy redirige a `/dashboard` si hay sesión antes de evaluar `loading` (línea 41 usa `!loading && user`, OK). Verificar que tras login con Google el `redirect_uri` no rompa el flujo PKCE — usar `${origin}/` y dejar que `ProtectedRoute` decida.
- `useSession`: validar uso de `getUser()` en chequeos sensibles y `onAuthStateChange` registrado una sola vez.
- `/reset-password`: confirmar que sea ruta pública (lo es) y que detecte `type=recovery`.

### RLS / Backend
- Linter reporta 2 WARN: `SECURITY DEFINER` callables por authenticated. Revisar `has_role` e `is_admin`: ambas son seguras por diseño (no exponen datos), se documentará y se hará `REVOKE EXECUTE FROM PUBLIC` dejando solo `authenticated` donde aplique.
- Correr `security--run_security_scan` y revisar findings persistidos.
- Validar GRANTs en todas las tablas `public.*` y políticas RLS por tabla (trades, profiles, user_roles, psychology_entries, import_batches, study_content, trading_accounts).
- Confirmar `auth.users` no expuesto y que `profiles` no permita escalado de `role`/`subscription_plan` (trigger `prevent_profile_privilege_escalation` ya existe).

### Tiers de suscripción
- Verificar `useFeatureFlag` / gating Free/Pro/Power en: import masivo, export PDF/XLSX, AI insights, backtesting, study content.
- Asegurar que cambios de `subscription_plan` solo vengan de backend (service_role o función), nunca del cliente.

### Runtime & errores
- ErrorBoundary global activo en `providers.tsx`.
- Revisar manejo de errores en hooks Supabase (`useTrades`, `useImportTrades`, `useTradingAccounts`) → toasts user-facing en ES/EN/PT.
- `Index.tsx` es un placeholder de Lovable (no se usa en rutas) → eliminar para evitar confusión.
- Console logs y network: chequear el preview en `/dashboard`, `/auth`, `/journal`, `/analytics`, `/psychology`, `/settings`, `/reset-password`.

### Responsive
- Probar 390×844 (móvil) y 1742×965 (desktop actual) en cada ruta clave.
- Sidebar colapsable, TopBar, modales (ImportPreview, AccountSetup, PreMarketCheckIn), tablas (Trade Ledger).

### SEO público (auth, landing si la hubiera, terms, privacy)
- `index.html`: title <60c con keyword, meta description <160c, OG, Twitter, canonical, JSON-LD Organization.
- Confirmar `sitemap.xml` y `robots.txt` actualizados.

## 2. Textura "Grid técnico" en públicas

### Alcance
Solo rutas **públicas**: `/auth`, `/reset-password`, `/terminos`, `/privacidad`. Dashboard mantiene `CorporateGrid` actual sin tocar.

### Implementación
- Nuevo componente `src/shared/components/effects/TechGridTexture.tsx`: SVG fixed full-screen con:
  - Grid fino 32×32 px en `hsl(var(--primary) / 0.04)` con líneas de 1px.
  - Cruces/ticks acentuados cada 4 celdas (estilo terminal Bloomberg).
  - Overlay radial-gradient con `--accent` muy sutil top-right para profundidad.
  - Mask radial para fade en los bordes (vignette suave).
  - `pointer-events-none`, `z-index: 0`, respeta dark/light mode vía tokens HSL.
- Reemplazar `ParticleBackground` en `Auth.tsx` por `TechGridTexture` (o componer ambos con grid debajo). Mantener Particle solo si el usuario lo pide.
- Agregar `TechGridTexture` a `Terms.tsx`, `Privacy.tsx`, `ResetPassword.tsx`.

### Justificación ADN
Encaja con la identidad institucional fintech del proyecto (terminal de datos, JetBrains Mono, sin glassmorphism). Refuerza el lenguaje cuantitativo sin romper la regla "static CorporateGrid bg, no glow".

## 3. Verificación
- `browser--view_preview` en `/auth` (1742 y 390), `/dashboard`, `/journal`, `/analytics`, `/psychology`, `/settings`.
- Screenshots antes/después.
- Console + network: cero errores 4xx/5xx ni warnings de React.
- Re-correr `supabase--linter` y `security--run_security_scan`.

## Archivos a modificar/crear
- **Nuevo:** `src/shared/components/effects/TechGridTexture.tsx`
- **Editar:** `src/features/auth/Auth.tsx`, `src/features/auth/ResetPassword.tsx`, `src/app/Terms.tsx`, `src/app/Privacy.tsx`
- **Eliminar:** `src/app/Index.tsx` (placeholder no usado)
- **Migración SQL:** REVOKE en `has_role` / `is_admin` para PUBLIC, mantener grant a `authenticated`.
- **Posibles tweaks RLS** según hallazgos del scan.

## Fuera de alcance
- Cambios visuales en dashboard interno (ya cubiertos en iteración anterior).
- Implementación de pagos reales (solo gating de tiers ya existente).
- Nuevas features.
