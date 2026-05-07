# Codebase Analysis Baseline – SINGULAR dataFI

> Generated as the reference baseline for upcoming refactor prompts.
> Architecture: feature-based layout (`src/app`, `src/features/*`, `src/shared/*`, `src/integrations/supabase`, `src/config`, `src/styles`).
> Total LOC under `src/`: **~21,500 lines** across **~150 files**.

---

## 1. Inventario de archivos

### Top archivos por tamaño (líneas)

| Archivo | LOC | Estado |
| --- | ---: | --- |
| `src/shared/lib/i18n/translations.ts` | 1642 | **Crítico** – diccionario monolítico (EN/ES/PT). Dividir por módulo o idioma. |
| `src/features/journal/Journal.tsx` | 1203 | **Crítico** – página gigante, mezcla UI + CRUD + import/export + validación. |
| `src/shared/types/types.ts` | 1007 | **Refactor** – tipos agregados de toda la app en un solo archivo. |
| `src/features/behavioral/Psychology.tsx` | 759 | **Crítico** – check-in, historial, racha, insights y taxímetro juntos. |
| `src/features/settings/Settings.tsx` | 694 | **Crítico** – perfil, cuenta, seguridad, exportación, geolocalización. |
| `src/shared/components/ui/sidebar.tsx` | 638 | Aceptado (shadcn baseline). |
| `src/features/journal/hooks/useImportTrades.ts` | 587 | **Refactor** – parser CSV/XLSX + validación + mapeo. |
| `src/features/study/components/StudyContentForm.tsx` | 459 | **Needs split** – formulario admin demasiado largo. |
| `src/features/journal/hooks/useExportTrades.ts` | 371 | **Refactor candidate** – generación HTML/PDF/XLSX en un hook. |
| `src/features/analytics/Analytics.tsx` | 362 | **Needs split** – múltiples vistas en un mismo archivo. |
| `src/features/auth/Auth.tsx` | 361 | **Needs split** – sign-in / sign-up / reset / language detection. |
| `src/features/behavioral/components/PreMarketCheckInModal.tsx` | 358 | **Needs split** – formulario multi-paso. |
| `src/features/analytics/Insights.tsx` | 354 | **Needs split**. |
| `src/features/journal/components/ImportPreviewModal.tsx` | 330 | Cerca del umbral. |
| `src/shared/components/ui/chart.tsx` | 304 | Baseline shadcn. |

### Archivos > 300 líneas (candidatos a refactor): **15**

### Archivos con responsabilidades múltiples
- `Journal.tsx` – CRUD de trades, importación, exportación, validación de proceso, taxímetro.
- `Psychology.tsx` – check-in, historial, rachas/logros, taxímetro.
- `Settings.tsx` – perfil, cuenta de trading, seguridad, exportación, geolocalización.
- `Analytics.tsx` – tooltips custom + métricas + gráficos en una sola vista.
- `Auth.tsx` – formularios, OAuth, recuperación de password y detección de idioma.

---

## 2. Inventario de componentes React

### Componentes principales (vistas/feature pages)

| Componente | Ruta | useState | useEffect | Custom hooks | Props | LOC | Diagnóstico |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `Journal` | `features/journal/Journal.tsx` | 9+ | 3+ | 6+ | 0 | 1203 | **needs split + reducer** |
| `Psychology` | `features/behavioral/Psychology.tsx` | 5+ | 2+ | 4+ | 0 | 759 | **needs split** |
| `Settings` | `features/settings/Settings.tsx` | 7+ | 2+ | 5+ | 0 | 694 | **needs split + reducer** |
| `Analytics` | `features/analytics/Analytics.tsx` | 2+ | 1 | 3 | 0 | 362 | needs split |
| `Insights` | `features/analytics/Insights.tsx` | 2 | 1 | 2 | 0 | 354 | needs split |
| `Auth` | `features/auth/Auth.tsx` | 6 | 2 | 3 | 0 | 361 | needs split + reducer |
| `Reports` | `features/analytics/Reports.tsx` | 2 | 0 | 2 | 0 | 282 | OK |
| `Dashboard` | `features/dashboard/Dashboard.tsx` | 2 | 1 | 5 | 0 | 181 | OK |
| `StudyContentForm` | `features/study/components/StudyContentForm.tsx` | 4 | 2 | 2 | 2 | 459 | **needs split** |
| `StudyContentList` | `features/study/components/StudyContentList.tsx` | 2 | 0 | 3 | 0 | 219 | needs split |
| `PreMarketCheckInModal` | `features/behavioral/components/PreMarketCheckInModal.tsx` | 5 | 1 | 2 | 2 | 358 | **needs split + reducer** |
| `ProcessValidatorModal` | `features/journal/components/ProcessValidatorModal.tsx` | 4 | 1 | 2 | 3 | 284 | needs split |
| `ImportPreviewModal` | `features/journal/components/ImportPreviewModal.tsx` | 3 | 1 | 2 | 4 | 330 | needs split |
| `OnboardingTour` | `features/auth/components/onboarding/OnboardingTour.tsx` | 3 | 2 | 1 | 1 | 240 | needs split |

### Resumen
- **Componentes > 200 líneas (needs split)**: 14
- **Componentes con > 5 useState (needs reducer/context)**: `Journal`, `Settings`, `Auth`, `PreMarketCheckInModal`.

---

## 3. Inventario de custom hooks

| Hook | Ruta | LOC | Responsabilidad |
| --- | --- | ---: | --- |
| `useTrades` | `features/journal/hooks/useTrades.ts` | 173 | CRUD + sync de balance. Mezcla side-effect de balance. |
| `useImportTrades` | `features/journal/hooks/useImportTrades.ts` | 587 | Parser CSV/XLSX, mapping, validación. |
| `useExportTrades` | `features/journal/hooks/useExportTrades.ts` | 371 | Generación de HTML/PDF/XLSX. |
| `useProcessValidation` | `features/journal/hooks/useProcessValidation.ts` | ~80 | Validación de adherencia al plan. |
| `useTradingAccount` | `features/dashboard/hooks/useTradingAccount.ts` | 135 | Cuenta activa + balance. |
| `useAnalytics` | `features/dashboard/hooks/useAnalytics.ts` | 242 | Cálculo de métricas + curva de equidad. |
| `usePsychologyEntries` | `features/behavioral/hooks/usePsychologyEntries.ts` | 120 | CRUD de entradas. |
| `usePreMarketCheckIn` | `features/behavioral/hooks/usePreMarketCheckIn.ts` | 56 | Check-in diario. |
| `useTaxometer` | `features/behavioral/hooks/useTaxometer.ts` | 112 | Errores psicológicos / pérdidas. |
| `useInsights` | `features/analytics/hooks/useInsights.ts` | ~90 | Lectura de `ai_insights`. |
| `useOnboarding` | `features/auth/hooks/useOnboarding.ts` | ~90 | Estado del onboarding (acceso directo a `profiles`). |
| `useIPGeolocation` | `shared/hooks/useIPGeolocation.ts` | ~80 | Detección IP. |
| `useLanguageDetection` | `shared/hooks/useLanguageDetection.ts` | 76 | Idioma por IP/perfil. |
| `useDebounce` | `shared/hooks/useDebounce.ts` | ~20 | Util. |
| `useRevealOnScroll` | `shared/hooks/useRevealOnScroll.ts` | ~30 | Animación. |

### Lógica duplicada / oportunidades
- **Geolocalización**: `useIPGeolocation` y `useLanguageDetection` consumen el mismo servicio (`shared/lib/geolocation/*`); fusionar en un hook con responsabilidades separadas.
- **Sync de balance**: la función `syncAccountBalance` vive dentro de `useTrades.ts`; debería ser un hook independiente `useAccountBalance` para reutilizar en imports masivos y futuras mutaciones.
- **Acceso a `profiles`**: `useOnboarding`, `LanguageSelector`, `useLanguageDetection`, `Auth.tsx` y `Settings.tsx` hacen `update`/`select` directos a `profiles`. Crear `useProfile` con TanStack Query.

---

## 4. Inventario de queries a Supabase

Tabla agregada por archivo (referencias `supabase.from(...)`):

| Archivo | Refs | Tablas | TanStack Query |
| --- | ---: | --- | --- |
| `features/study/components/StudyContentList.tsx` | 4 | `study_content` | **NO** (calls directos en mutaciones) |
| `features/settings/Settings.tsx` | 3 | `trades`, `psychology_entries`, `trading_accounts` (export) | **NO** |
| `features/study/components/StudyContentForm.tsx` | 2 | `study_content` | **NO** |
| `features/journal/hooks/useTrades.ts` | 2 | `trades`, `trading_accounts` | **SÍ** |
| `features/dashboard/hooks/useTradingAccount.ts` | 1 | `trading_accounts` | **SÍ** |
| `features/behavioral/hooks/usePsychologyEntries.ts` | 1 | `psychology_entries` | **SÍ** |
| `features/behavioral/hooks/usePreMarketCheckIn.ts` | 1 | `pre_market_checkins` | **SÍ** |
| `features/behavioral/hooks/useTaxometer.ts` | 1 | `psychological_errors` | **SÍ** |
| `features/analytics/hooks/useInsights.ts` | 1 | `ai_insights` | **SÍ** |
| `features/auth/hooks/AuthContext.tsx` | 1 | `profiles` | NO (estado React) |
| `features/auth/hooks/useOnboarding.ts` | 1 | `profiles` | **NO** |
| `features/auth/Auth.tsx` | 1 | `profiles` | **NO** |
| `features/behavioral/utils/streak-manager.ts` | 1 | `user_streaks` | **NO** |
| `features/auth/components/onboarding/FirstCheckInStep.tsx` | 1 | `pre_market_checkins` | **NO** (usar hook existente) |
| `shared/components/layout/LanguageSelector.tsx` | 1 | `profiles` | **NO** |

### Detalle de operaciones más relevantes

| Tabla | Operación | Origen | Notas |
| --- | --- | --- | --- |
| `trades` | SELECT/INSERT/UPDATE/DELETE | `useTrades` | OK con TanStack. |
| `trades` | SELECT (export) | `Settings.tsx` | Llamada directa, fuera de TanStack. |
| `trading_accounts` | SELECT/INSERT/UPDATE | `useTradingAccount`, `useTrades` (sync) | OK; el sync interno duplica responsabilidad. |
| `profiles` | UPDATE | `useOnboarding`, `Auth`, `LanguageSelector`, `Settings` | **Riesgo**: cuatro puntos distintos sin invalidación coordinada. |
| `study_content` | SELECT/INSERT/UPDATE/DELETE | `StudyContent*` | Sin TanStack en mutaciones. |
| `psychology_entries` | SELECT/INSERT/UPDATE/DELETE | `usePsychologyEntries`, `Settings` (export) | Mixto. |
| `user_streaks` | INSERT/UPDATE | `streak-manager.ts` | Llamada directa imperativa. |

### Hallazgos
- **Bypass de TanStack Query**: 8 archivos hacen `supabase.from()` fuera del flujo de cache. Genera invalidaciones inconsistentes y dificulta el optimistic update.
- **Falta de selectores tipados**: muchas queries no proyectan columnas (`select('*')`), lo que sobre-fetch y dificulta DTOs.

---

## 5. Inventario de tipos TypeScript

### Tipos declarados
- `src/shared/types/database.ts` (180 LOC): interfaces manuales de dominio (`Profile`, `Trade`, `TradingAccount`, `PsychologyEntry`, `AnalyticsSnapshot`, `AIInsight`, `TradingRule`, `FeatureFlag`, `StudyContent`, `StudyProgress`, `TradeScreenshot`).
- `src/shared/types/types.ts` (1007 LOC): tipos agregados de UI/dominio.
- `src/integrations/supabase/types.ts`: tipos generados por Supabase CLI (fuente de verdad).
- Helpers re-exportados (`Tables`, `TablesInsert`, `TablesUpdate`, `Database`) desde `shared/types/database.ts`.

### Anti-patrones detectados
- **`any` / `as any`**: ~33 ocurrencias relevantes. Hotspots:
  - `shared/hooks/useLanguageDetection.ts` (lectura/escritura de `profiles.language` con `as any`).
  - `shared/lib/i18n/translations.ts` (`frenchOverrides: any`, `deepMerge<T>(base, overrides: any)`).
  - `features/analytics/Analytics.tsx` (tooltip props sin tipar).
  - `features/journal/hooks/useTrades.ts` (cast `as TradeInsert` para conciliar `user_id` con tipos generados).
  - `features/dashboard/hooks/useTradingAccount.ts` (mismo patrón).
  - `features/journal/hooks/useExportTrades.ts` (`(doc as any).lastAutoTable`).
- **Duplicación**: `database.ts` redefine entidades que ya existen en `integrations/supabase/types.ts` → riesgo de divergencia (p. ej. `Trade.commission` no-nullable vs. nullable en BD).

---

## 6. Inventario de strings de UI

### Strings hardcodeados detectados
- `shared/components/feedback/ErrorBoundary.tsx`: mensajes en inglés (“Something went wrong”).
- `features/behavioral/Psychology.tsx`: subtítulos y placeholders en español hardcodeados.
- `features/journal/Journal.tsx`: labels de tablas, botones, toasts y modales escritos directo en JSX.
- `features/analytics/Analytics.tsx`: nombres de métricas y leyendas.
- `features/dashboard/components/*`: títulos como "Portfolio Balance" / "Recent Trades".
- Toasts (`sonner`) con texto fijo en español dentro de hooks (`useTrades`, `useTradingAccount`, etc.).

### Inconsistencias en `translations.ts`
- Diccionarios incompletos para FR y PT (`frenchOverrides: any` con `deepMerge` para fallback).
- Acceso dinámico mediante `(t as any)[key]` en Settings y Auth (problemas de tipado fuerte).

---

## 7. Dependencias

- `package.json`: **58 dependencias**, **22 devDependencies**.
- Stack principal: React 18, Vite, TanStack Query, Radix UI (shadcn), TailwindCSS, Recharts, sonner, react-hook-form + zod, react-router-dom.
- Backend client: `@supabase/supabase-js`, `@lovable.dev/cloud-auth-js`.
- Generación de archivos: `jspdf`, `jspdf-autotable`, `exceljs`, `dompurify`, `canvas-confetti`.

### Vulnerabilidades / riesgos
- **`xlsx` ya no está presente** (sustituido por `exceljs` + `features/journal/utils/xlsx-adapter.ts`). El CVE histórico se considera mitigado.
- Resto de dependencias en versiones recientes; ejecutar `npm audit` antes de release.

### Sospechosas de no usarse
- `input-otp`: sin imports en código (`rg "input-otp"` solo en `package.json` y `components/ui/input-otp.tsx` shadcn baseline).
- `@radix-ui/react-aspect-ratio`, `@radix-ui/react-hover-card`, `@radix-ui/react-menubar`, `@radix-ui/react-navigation-menu`, `embla-carousel-react`, `react-resizable-panels`, `vaul`: shadcn boilerplate sin uso real en features.
- `@types/canvas-confetti` debería ser devDependency.

---

## 8. Score de calidad (0–100)

| Métrica | Score | Comentario |
| --- | ---: | --- |
| Cohesión de componentes | 45 | Páginas monolíticas (Journal, Psychology, Settings). |
| Separación de responsabilidades | 45 | Hooks cargan I/O + lógica + side-effects (sync de balance, parsing, exportación). |
| Consistencia de tipos | 55 | Duplicación entre tipos manuales y generados; `any` puntual; casts forzados. |
| Manejo de errores | 70 | `ErrorBoundary`, `getUserErrorMessage` y sanitización en edge function aplicados. |
| Uso de TanStack Query | 60 | Bien en hooks de dominio principal; ausente en study, settings export y auth. |
| Accesibilidad | 75 | Base Radix sólida; faltan `aria-label` en CTAs custom y validación de focus en modales largos. |
| Responsive design | 85 | Tailwind con breakpoints consistentes; verificado en Auth + Dashboard. |
| Seguridad | 75 | RLS activa en todas las tablas; edge function sanitizada; `xlsx` removido. Pendiente revisar exposición de `profiles` y `user_roles`. |

### **SCORE GLOBAL: 64 / 100**

---

## Top prioridades para próximos prompts

1. **Refactor de `Journal.tsx`** → dividir en `TradeList`, `TradeFormDrawer`, `ImportFlow`, `ExportFlow`, `ProcessValidator` y mover estado a un reducer.
2. **Refactor de `Psychology.tsx` y `Settings.tsx`** → extraer secciones a sub-componentes y migrar accesos directos a Supabase a TanStack Query.
3. **Unificar acceso a `profiles`** en un hook `useProfile` (lectura + actualización + invalidación coherente).
4. **Eliminar `any`** en i18n (`translations.ts`) y en hooks de geolocalización tipando `profiles.language` correctamente.
5. **Dividir `translations.ts`** por módulo o por idioma para reducir el bundle y facilitar traducciones.
6. **Sacar `syncAccountBalance` de `useTrades`** a `useAccountBalance` reutilizable.
7. **Limpiar dependencias** (`input-otp`, radix sin uso, mover `@types/*` a dev).
8. **Cerrar gaps de i18n** en componentes con strings hardcodeados (Journal, Psychology, Dashboard, ErrorBoundary).
