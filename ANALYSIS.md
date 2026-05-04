# codebase Analysis Baseline - Singular Data

## 1. INVENTARIO DE ARCHIVOS

| Archivo | Líneas | Estado |
| :--- | :--- | :--- |
| `src\App.tsx` | 131 | OK |
| `src\index.css` | 700 | Refactor candidate (Huge CSS file) |
| `src\components\admin\StudyContentForm.tsx` | 429 | **Needs split** |
| `src\components\psychology\PreMarketCheckInModal.tsx` | 333 | **Needs split** |
| `src\components\ui\sidebar.tsx` | 584 | Complex (Shadcn default + custom) |
| `src\hooks\useExportTrades.ts` | 361 | Complex logic |
| `src\hooks\useImportTrades.ts` | 521 | **Refactor candidate** |
| `src\i18n\translations.ts` | 1627 | Huge (Split by language/module) |
| `src\pages\Analytics.tsx` | 346 | **Needs split** |
| `src\pages\Auth.tsx` | 340 | OK |
| `src\pages\Insights.tsx` | 336 | OK |
| `src\pages\Journal.tsx` | 1133 | **CRITICAL: Giant file (Refactor required)** |
| `src\pages\Psychology.tsx` | 712 | **CRITICAL: Giant file (Refactor required)** |
| `src\pages\Settings.tsx` | 663 | **CRITICAL: Giant file (Refactor required)** |

### Archivos con responsabilidades múltiples:
- `src\pages\Journal.tsx`: Gestión de trades, importación, exportación, validación de procesos y taxímetro.
- `src\pages\Psychology.tsx`: Check-in diario, historial, racha/logros, insights y taxímetro.
- `src\pages\Settings.tsx`: Perfil, cuenta de trading, seguridad, exportación de datos y geolocalización.

---

## 2. INVENTARIO DE COMPONENTES REACT

| Componente | Hooks | Props | Líneas JSX | Estado |
| :--- | :--- | :--- | :--- | :--- |
| `Journal` | 12+ | 0 | ~800 | **Needs split / Reducer** |
| `Psychology` | 5+ | 0 | ~600 | **Needs split** |
| `Settings` | 10+ | 0 | ~500 | **Needs split** |
| `StudyContentForm` | 6+ | 2 | ~300 | **Needs split** |
| `PreMarketCheckInModal` | 5+ | 2 | ~250 | **Needs split** |

### Alertas de Complejidad:
- **Componentes > 200 líneas:** `Journal`, `Psychology`, `Settings`, `Analytics`, `Auth`, `StudyContentForm`, `PreMarketCheckInModal`, `AccountSetupModal`, `ProcessValidatorModal`.
- **Componentes con > 5 useState:** `Journal` (9+), `Psychology` (4 + multiple subcomponents with states), `Settings` (7+).

---

## 3. INVENTARIO DE CUSTOM HOOKS

| Hook | Responsabilidad | Tamaño |
| :--- | :--- | :--- |
| `useTrades` | CRUD de operaciones y sincronización de balance | 173 |
| `useImportTrades` | Lógica compleja de parsing (XLSX/CSV) | 521 |
| `useExportTrades` | Generación de PDF/Excel/HTML | 361 |
| `useAnalytics` | Cálculo de métricas y curvas de equidad | 207 |
| `useLanguageDetection` | Detección automática por IP y perfil | 76 |
| `useTaxometer` | Registro de errores psicológicos/pérdidas | 100 |

### Lógica Duplicada / Sugerencias:
- **Detección de IP:** `useIPGeolocation` y `useLanguageDetection` comparten servicios de detección que podrían unificarse.
- **Sincronización de Balance:** La lógica en `useTrades` para actualizar el balance podría ser un hook independiente `useAccountBalance`.

---

## 4. INVENTARIO DE QUERIES A SUPABASE

| Tabla | Operación | Archivo | ¿Usa TanStack? |
| :--- | :--- | :--- | :--- |
| `trades` | SELECT | `useTrades.ts` | SÍ |
| `trades` | INSERT/UPDATE/DELETE | `useTrades.ts` | SÍ (Mutations) |
| `profiles` | UPDATE | `useOnboarding.ts` | NO (Oportunidad) |
| `profiles` | UPDATE | `LanguageSelector.tsx` | NO (Oportunidad) |
| `study_content` | SELECT/DELETE | `StudyContentList.tsx` | NO (Direct call) |
| `study_content` | INSERT/UPDATE | `StudyContentForm.tsx` | NO (Direct call) |
| `user_streaks` | INSERT | `streak-manager.ts` | NO (Direct call) |
| `user_data` (multiple) | SELECT | `Settings.tsx` | NO (Export logic) |

---

## 5. INVENTARIO DE TIPOS TYPESCRIPT

### Tipos declarados:
- `src\types\database.ts`: Define interfaces manuales para `Profile`, `Trade`, `PsychologyEntry`, etc.
- `src\integrations\supabase\types.ts`: Tipos auto-generados por Supabase CLI.

### Anti-patrones detectados:
- **Uso excesivo de `any`:**
  - `Journal.tsx`: `commitTrade(payload: any, ...)`
  - `Settings.tsx`: Múltiples `(t as any)` para acceso dinámico a traducciones.
  - `useExportTrades.ts`: `(doc as any).lastAutoTable.finalY` (Tipos de jsPDF incompletos).
  - `Auth.tsx`: `update({ language: ... } as any)`
- **Tipos Duplicados:** Las interfaces en `src\types\database.ts` a menudo replican lo que ya está en `integrations\supabase\types.ts`, aumentando el riesgo de desincronización.

---

## 6. INVENTARIO DE STRINGS DE UI

- **Strings Hardcodeados:**
  - `src\components\ErrorBoundary.tsx`: Mensajes de error en inglés ("Something went wrong").
  - `src\pages\Psychology.tsx`: Subtítulo "Tu bienestar mental es tu ventaja..." hardcodeado.
  - `src\pages\Journal.tsx`: Múltiples labels de tablas y botones sin pasar por `t()`.
- **Inconsistencias:** Algunas traducciones en `translations.ts` tienen claves faltantes para Francés/Portugués, cayendo en fallbacks hardcodeados en inglés.

---

## 7. DEPENDENCIAS

| Dependencia | Versión | Riesgo / Nota |
| :--- | :--- | :--- |
| `xlsx` | `^0.18.5` | **CVE-2023-30535 / CVE-2024-22363 (Alta)** |
| `@tanstack/react-query` | `^5.83.0` | OK (Versión reciente) |
| `lucide-react` | `^0.462.0` | OK |
| `recharts` | `^2.15.4` | OK |

### Dependencias no utilizadas (sospecha):
- `input-otp`: No se ve uso evidente en Auth o Settings.
- `@tailwindcss/typography`: Podría no estar aplicándose si no hay clases `prose`.

---

## 8. SCORE DE CALIDAD (0-100)

| Métrica | Score | Nota |
| :--- | :--- | :--- |
| Cohesión de componentes | 45 | Archivos gigantes con demasiadas responsabilidades. |
| Separación de responsabilidades | 40 | Lógica de negocio mezclada con UI en `Journal` y `Psychology`. |
| Consistencia de tipos | 55 | Demasiado uso de `any` y tipos manuales duplicados. |
| Cobertura de manejo de errores | 70 | Uso correcto de `ErrorBoundary` y `getUserErrorMessage`. |
| Uso de TanStack Query | 65 | Bien en hooks base, mal en componentes administrativos/settings. |
| Accesibilidad | 75 | Basado en Radix/Shadcn, pero faltan algunos aria-labels. |
| Responsive design | 85 | Buen uso de Tailwind y componentes móviles específicos. |
| Seguridad | 60 | Dependencia vulnerable (`xlsx`) y RLS de Supabase requiere auditoría. |

### **SCORE GLOBAL: 62/100**

---

> [!IMPORTANT]
> **Próximos Pasos Prioritarios:**
> 1. Refactorizar `Journal.tsx` y `Psychology.tsx` separando vistas y formularios en archivos independientes.
> 2. Migrar llamadas directas de Supabase a TanStack Query (especialmente en admin y export).
> 3. Tipar fuertemente las traducciones para eliminar el patrón `(t as any)`.
> 4. Actualizar o reemplazar `xlsx` debido a vulnerabilidades críticas.
