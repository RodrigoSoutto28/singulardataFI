# Plan de ajustes — Singular dataFI

Tres tareas: (1) edición inline del Balance Inicial con recálculo de métricas, (2) diseño responsive mobile-first en layout/tablas/gráficos, (3) limpieza de la marca en el header.

---

## Tarea 1 — Edición inline del Balance Inicial

**Componentes**: `src/components/dashboard/CapitalCard.tsx`, `src/pages/Dashboard.tsx`, `src/hooks/useTradingAccount.ts`, `src/hooks/useAnalytics.ts`.

- Agregar a `CapitalCard` un modo edición opcional (`editableValue`, `onSaveValue`):
  - Click en el icono lápiz → `isEditing = true` y muestra un `Input` numérico inline (regex `^\d*\.?\d*$`, sin negativos).
  - En modo edición, el lápiz se reemplaza por dos botones minimalistas: `Check` (confirmar) y `X` (cancelar) de `lucide-react`.
  - `Enter` confirma, `Esc` cancela. Botón confirmar deshabilitado si el valor es vacío o inválido.
- En `Dashboard.tsx`, usar este modo edición en la card "Balance" para `initial_balance`:
  - `onSaveValue` llama a un nuevo `updateInitialBalance({ accountId, initialBalance })` en `useTradingAccount` (mutación que actualiza solo `initial_balance`).
  - Tras guardar, `react-query` invalida `trading_account` y `trades`, lo que dispara recálculo automático de equity curve, drawdown, P&L % y win-rate histórico en `useAnalytics` (ya derivan del `initial_balance`).
- Mantener el modal completo (`AccountSetupModal`) accesible desde un menú "Editar cuenta" para edición avanzada (broker, nombre, etc.); la edición inline cubre solo el balance inicial.
- Toast `sonner` de éxito/error; estética alineada al sistema (`surface-card`, botones ghost, iconos h-4 w-4).

## Tarea 2 — Responsive Mobile-First global

Breakpoints Tailwind ya disponibles: `sm 640`, `md 768`, `lg 1024`, `xl 1280`. Estrategia:

- **Mobile < 768px**: stack vertical, sidebar oculta tras hamburguesa (ya existe en `AppLayout` vía `Sheet`), cards a 1 columna, padding reducido.
- **Tablet 768–1024px**: grid de 2 columnas en dashboard, sidebar colapsable.
- **Desktop > 1024px**: layout actual completo.

Cambios:
- **Layout/Sidebar**: el `Sheet` ya cubre el menú hamburguesa móvil. Verificar que el botón Menu del `TopBar` sea visible siempre `< md`. Reducir padding del `<main>` a `p-3 sm:p-4 md:p-6` (ya parcialmente aplicado).
- **Dashboard** (`src/pages/Dashboard.tsx`): cambiar grids `grid-cols-1 lg:grid-cols-3` a `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` y eliminar el `mx-[25px]` fijo que rompe en mobile (usar `md:mx-6`).
- **Tablas de operaciones** (`src/pages/Journal.tsx`, `RecentTrades.tsx`): envolver las `<Table>` en un `<div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">` para scroll horizontal suave; en `< md` renderizar variante "card" con un map de filas mostrando Activo, R:R, P&L y fecha como tarjetas apiladas (toggle por breakpoint con `hidden md:table` / `md:hidden space-y-2`).
- **Gráficos** (`EquityChart.tsx` y otros que usen `recharts`): envolver con `<ResponsiveContainer width="100%" height={...}>` (ya lo hace recharts). Añadir un `ResizeObserver` ligero solo donde haga falta forzar re-render (ej. al rotar dispositivo) — en la práctica `ResponsiveContainer` lo gestiona; añadir `key={breakpoint}` si se detectan glitches.
- **Cards de métricas** (`MetricCard`, `CapitalCard`): tipografía responsive `text-2xl md:text-3xl`, padding `p-4 md:p-5`.
- **Topbar**: ocultar el selector de idioma en `< sm` (ya hecho), colapsar el nombre del perfil con `hidden md:block` (ya hecho).

## Tarea 3 — Limpieza de marca en el header

**Archivo**: `src/i18n/translations.ts` (claves `topbar.title` en ES/EN/PT).

- Reemplazar `"SINGULAR dataFI - Trading Intelligence Platform"` por solo **`"Trading Intelligence Platform"`** (igual en las 3 lenguas para mantener identidad técnica; PT puede mantenerse en inglés como término de marca).
- En `TopBar.tsx`, mantener `text-sm font-medium text-muted-foreground tracking-wide` (sans-serif Geist, peso medio = 500). Si se quiere peso "ligero" estricto, cambiar a `font-light` (300) o `font-normal` (400) según preferencia. Color ya integrado (`text-muted-foreground`).
- Alineación: dejar a la izquierda (grid actual del header).

## Detalles técnicos

- Validación numérica del input inline: `onChange` filtra con regex `/^\d*\.?\d{0,2}$/` y bloquea negativos.
- Mutación nueva en `useTradingAccount`:
  ```ts
  updateInitialBalance: useMutation(async ({ accountId, initialBalance }) => {
    await supabase.from('trading_accounts')
      .update({ initial_balance: initialBalance })
      .eq('id', accountId);
  })
  ```
  invalida `['trading_account']` y `['trades']`.
- `useAnalytics` ya recibe `trades` y deriva equity, drawdown y win-rate; al cambiar `initial_balance` desde `Dashboard`, se recalculan automáticamente porque la prop entra como nuevo valor a `CapitalCard` y a la equity curve (revisar que `useAnalytics` use `account.initial_balance` como base; si no, agregarlo como argumento).
- Tablas mobile: helper `<TradeRowCard>` reusable en Journal y RecentTrades.
- Sin cambios en colores institucionales — solo se tocan tipografías y layouts.

## Archivos que se modificarán

- `src/components/dashboard/CapitalCard.tsx` — modo edición inline
- `src/hooks/useTradingAccount.ts` — mutación `updateInitialBalance`
- `src/hooks/useAnalytics.ts` — asegurar uso del `initial_balance` para drawdown
- `src/pages/Dashboard.tsx` — wiring + grids responsive
- `src/pages/Journal.tsx` + `src/components/dashboard/RecentTrades.tsx` — tabla con scroll horizontal y variante card móvil
- `src/components/dashboard/EquityChart.tsx` — verificación de `ResponsiveContainer`
- `src/components/layout/TopBar.tsx` — peso tipográfico
- `src/i18n/translations.ts` — texto del header en ES/EN/PT

## Resumen post-implementación

Al terminar entregaré: lista exacta de archivos tocados y una guía breve de cómo se ven Dashboard, Journal y header en mobile (< 768px), tablet y desktop.
