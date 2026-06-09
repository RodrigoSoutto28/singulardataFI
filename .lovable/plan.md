## Objetivo

Auditar punta a punta SINGULAR dataFI (Auth, Dashboard, Journal/Import-Export, Analytics Hub, Behavioral/Pre-Market, Settings, i18n, layout) y corregir todos los bugs detectados en una sola pasada, dejando seguridad, UX, performance y SEO listos para comercialización.

## Alcance

### 1. Seguridad backend (crítico)
- Resolver los 2 warnings del linter Supabase: revocar `EXECUTE ... TO public/authenticated` y otorgar sólo a `service_role` para las funciones `SECURITY DEFINER` que no necesitan llamarse desde el cliente (`update_updated_at_column`, `handle_new_user`, `prevent_profile_privilege_escalation`). Mantener `has_role` / `is_admin` accesibles a `authenticated`.
- Revisar policies y GRANTs de cada tabla (`trades`, `trading_accounts`, `psychology_entries`, `pre_market_checkins`, `import_batches`, `profiles`, `user_roles`, `ai_insights`, `analytics_snapshots`, `study_*`, `process_validations`, `trade_screenshots`, `trading_rules`, `user_streaks`, `feature_flags`) y completar GRANTs faltantes según el patrón estándar.
- Verificar `supabase/functions/delete-account`: validación JWT en código, CORS, manejo de errores y borrado en cascada del usuario.
- Confirmar que no se exponen `service_role`/`SUPABASE_SECRET_KEYS` en el cliente.

### 2. Funcional end-to-end
Recorrer y testear cada módulo, corrigiendo bugs detectados:

- **Auth**: signup/signin/Google OAuth, validación zod, reset password, detección de idioma por IP en montaje, redirecciones, errores traducidos.
- **Onboarding**: Welcome → AccountSetup → Tour, persistencia, skip, primera check-in.
- **Dashboard**: greeting i18n, métricas (balance, P&L hoy, win rate, disciplina), edición de balance, equity chart, recent trades, taxometer, achievement badges, quick actions, AI Insight card.
- **Journal / Trades**: crear/editar/eliminar trade, validaciones, sincronización de balance, paginación infinita, screenshots.
- **Import**: detección de broker (MT4/MT5/cTrader/TradingView), CSV/XLSX, modal de preview obligatorio, deduplicación por `import_row_hash`, historial e undo.
- **Export**: HTML/PDF/XLSX con datos y estadísticas correctas.
- **Analytics Hub**: tabs Analytics / Reports / Insights, métricas avanzadas, estados vacíos, exportación de reportes.
- **Behavioral**: Pre-Market Check-In gate, Taxometer (widget, dashboard, alert), psychology entries, errores psicológicos, streaks.
- **Settings / Profile**: avatar uploader (bucket `avatars`), datos de perfil, idioma, tema, eliminar cuenta.
- **Layout**: Sidebar, TopBar, AccountSwitcher (cambio activo refresca trades/balance), LanguageSelector, NavLinks, mobile.
- **Study Admin** (rol admin): CRUD de contenidos, subida a `study-pdfs`.

### 3. i18n por ubicación (cierre)
- Confirmar `detectUserLanguage(null, true)` en Auth y `LanguageContext` (orden: DB → browser+IP → browser → fallback ES).
- Barrido por strings hardcodeadas en todos los componentes y mover al diccionario `extra` o namespace correspondiente (EN/ES/PT).
- Verificar `LanguageSelector` persiste en `profiles.preferred_language` cuando hay usuario y en `localStorage` siempre.
- Sin claves huérfanas: tipar el diccionario y corregir referencias rotas.

### 4. UX/UI y consistencia
- Estados vacíos, loading skeletons y mensajes de error claros en cada módulo.
- Responsive: revisar Dashboard, Journal, Analytics, modales en mobile (sm) y tablet (md).
- Tap targets ≥44px en mobile, `aria-label` en botones icon-only, IDs únicos en listas.
- Toast: confirmar duración (success 4s, error 10s) y mensajes traducidos.
- Dark/Light mode: contraste y tokens semánticos (sin colores hardcoded).
- Eliminar restos de `console.log` y datos mock.

### 5. Performance
- Lazy-load de rutas pesadas (Analytics, StudyAdmin, ReportPDF) si no lo están.
- Revisar `useQuery` `staleTime`/`gcTime` razonables; eliminar refetches innecesarios.
- Memoización en listas grandes (Journal infinite, RecentTrades).
- Verificar tamaño de bundle (chunks dinámicos para XLSX/PDF).

### 6. SEO + metadata pública
- `index.html`: título <60 chars, meta description <160, canonical a `https://singulardatafi.lovable.app`, OG/Twitter, JSON-LD Organization.
- `public/robots.txt` y `public/sitemap.xml` con rutas públicas (`/`, `/auth`, `/terms`, `/privacy`).
- Favicons y manifest verificados.
- `noindex` en rutas privadas/admin si aplica (vía Helmet en rutas; opcional).

### 7. Comercialización
- Páginas legales `Terms` y `Privacy` revisadas (i18n).
- Footer público con enlaces correctos.
- Verificación final con `bun run build` (la harness lo corre automáticamente) y smoke-test manual de los flujos críticos.

## Estrategia de ejecución

1. Migración SQL única con GRANTs/REVOKEs de funciones y tablas pendientes.
2. Barrido i18n + corrección de strings hardcodeadas.
3. Recorrido módulo por módulo aplicando fixes (commit lógico por módulo).
4. SEO + sitemap/robots + metadata.
5. Re-scan de seguridad y linter al final; marcar findings como `fixed`.

## Entregable

Reporte final en chat con: issues encontrados, fixes aplicados (por módulo), warnings que requieren acción del usuario (ej: configurar Google OAuth en backend, dominio personalizado, leaked password protection), y checklist de comercialización.

## Notas

- No se activa Stripe en esta iteración (lo confirmaste).
- Si durante la ejecución aparecen decisiones de producto (textos legales, copy de marketing), las preguntaré antes de inventar contenido.
