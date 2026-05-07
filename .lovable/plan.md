# Plan: completar la migración a feature-based architecture

## Estado actual

La estructura objetivo **ya está casi totalmente implementada**:

- `src/app/` con `App.tsx`, `main.tsx`, `routes.tsx`, `providers.tsx` ✅
- `src/config/` con `supabase.ts`, `queryClient.ts`, `lovable.ts` ✅
- `src/features/{dashboard,journal,analytics,behavioral,auth,settings,study}/` con `components/`, `hooks/`, `index.ts` ✅
- `src/shared/{components/{ui,layout,feedback},hooks,lib,types}/` ✅
- `src/styles/index.css` ✅
- Alias `@/` configurado en `tsconfig.json` y `vite.config.ts` ✅

Faltan solo **scaffolds/archivos accesorios** descritos en la spec.

## Cambios a aplicar

### 1. `src/config/`
- **Crear** `constants.ts` — `ROLES`, `PLANS`, `LIMITS`, `SUPPORTED_LANGUAGES`, `QUERY_KEYS`.

### 2. `src/shared/`
- **Crear** `types/common.ts` — `Pagination`, `ApiResponse`, `SortState`, `AsyncStatus`, `ID`.
- **Crear** `lib/formatters.ts` — `formatCurrency`, `formatNumber`, `formatPercent`, `formatDate`, `formatDateTime`.
- **Crear** `lib/validators.ts` — schemas zod compartidos (email, password, fecha ISO, etc.).
- **Crear** `hooks/useMediaQuery.ts` — listener `matchMedia` SSR-safe.
- **Crear** `hooks/useLocalStorage.ts` — estado persistido con sync entre pestañas.

### 3. `src/features/auth/`
- **Crear** `hooks/useAuth.ts` — re-export de `useAuth` desde `AuthContext`.
- **Crear** `hooks/useSession.ts` — wrapper que expone solo `session`/`user`/`loading`.
- **Crear** `types.ts` — `Profile` re-export, `AuthCredentials`, `SignUpInput`.
- **Actualizar** `index.ts` para exportar nuevos hooks/types.

### 4. Resto de features (`dashboard`, `journal`, `analytics`, `behavioral`, `settings`)
- **Crear** `types.ts` por feature, re-exportando desde `@/shared/types/database` los `Tables<>` específicos del dominio + un par de tipos UI propios (KPI, EquityPoint, etc.).
- **Actualizar** cada `index.ts` para exportar `* from './types'`.

### 5. `src/features/journal/utils/brokerParsers/`
- **Crear** scaffolds: `ctrader.ts`, `mt4.ts`, `mt5.ts`, `tradingview.ts`, `index.ts`.
- Cada parser exporta una función `parse(input: string | ArrayBuffer): BrokerParseResult` que por ahora delega a `useImportTrades` lógica existente o devuelve `{ rows: [], warnings: ['not implemented'] }`. La división lógica real se hará en el prompt 03.
- `index.ts` exporta `detectBroker(filename, sample) → BrokerId` que retorna `'unknown'` por defecto.
- **No tocar** `useImportTrades.ts` ni `xlsx-adapter.ts` en este prompt.

## Reglas que respeto

- **No elimino** ningún archivo existente.
- **No muevo** archivos (todos los movimientos previstos en la spec ya estaban hechos).
- **No divido** componentes con responsabilidades mezcladas (queda para prompt 03).
- Imports nuevos usan exclusivamente alias `@/`.
- Verifico que el build (`tsc --noEmit`) siga limpio al terminar.

## Out of scope

- Refactorizar `Journal.tsx`, `Psychology.tsx`, `Settings.tsx`, `useImportTrades.ts`.
- Cambiar contenidos de archivos existentes salvo los `index.ts` de feature para añadir los nuevos exports.
- Tocar `src/integrations/supabase/*` (auto-generado).

Commit message al aplicar: `refactor(structure): migrate to feature-based architecture`.
