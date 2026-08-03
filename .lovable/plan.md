## Objetivo

Mostrar métricas de racha (actual y mejor racha) en el Historial de check-ins, con vista semanal y mensual, reutilizando la lógica que hoy vive dentro de `TodayCheckInView`.

## Estado actual (verificado)

- `src/features/behavioral/Psychology.tsx` calcula `currentStreak` y `bestStreak` en un `useMemo` dentro de `TodayCheckInView` (líneas 181-234), a partir de `entries[].entry_date`.
- `HistoryView` (líneas 723-759) solo lista `EntryCard` sin ninguna métrica agregada.
- Existe `src/features/behavioral/utils/streak-manager.ts`, pero solo escribe en la tabla `user_streaks`; no se usa para el cálculo mostrado en la UI.

## Cambios propuestos

1. **Nuevo util `src/features/behavioral/utils/streak-metrics.ts`**
   - `toDateKey(date)` → "YYYY-MM-DD" local (hoy duplicado en 4 lugares).
   - `calcStreaks(dateKeys: string[], todayKey)` → `{ currentStreak, bestStreak }` (misma regla actual: la racha sigue viva si hay check-in hoy o ayer).
   - `periodStats(dateKeys, start, end, todayKey)` → `{ completed, total, missed, currentStreak, bestStreak, completionRate }` para un rango.

2. **`TodayCheckInView`**: reemplazar el `useMemo` de rachas por llamadas al util (sin cambio visual).

3. **`HistoryView`**: agregar una barra de métricas arriba de la lista con:
   - Racha actual y Mejor racha (global), con icono `Flame`/`Trophy`, mismo estilo de tarjetas `bg-muted/40` usado en "Tu Progreso".
   - Selector semanal/mensual (`Tabs` o `ToggleGroup` shadcn ya disponible).
   - Según la selección: check-ins completados / días del período, % de cumplimiento (`Progress`), y mejor racha dentro del período.
   - Semanal = semana calendario lunes-domingo actual; Mensual = mes calendario actual. Los días futuros no cuentan como fallados.
   - Lista de entradas filtrada al período seleccionado, agrupada por encabezado de semana/mes.

4. **i18n**: agregar claves en `src/shared/lib/i18n/translations.ts` (EN/ES/PT) para "Racha actual", "Mejor racha", "Semanal", "Mensual", "Cumplimiento", "check-ins completados". Sin strings hardcodeados nuevos.

5. **Test**: `src/features/behavioral/utils/__tests__/streak-metrics.test.ts` cubriendo racha rota, racha viva desde ayer, día único, y conteo por período con días futuros excluidos.

## Notas técnicas

- Todo se calcula en cliente desde `usePsychologyEntries().entries`; no hay cambios de base de datos ni de la tabla `user_streaks`.
- Las fechas se comparan siempre como claves "YYYY-MM-DD" locales para evitar el desfase UTC de `new Date("YYYY-MM-DD")`.
