## Problema detectado

En `src/features/behavioral/Psychology.tsx` (tarjeta "Tu Progreso" → "Esta semana", líneas ~200-278):

- El cálculo actual sólo cuenta cuántos check-ins hubo en los últimos 7 días (`checkedInThisWeek`) y luego pinta las celdas con `i < checkedInThisWeek`. Es decir, rellena de izquierda a derecha (L, M, X…) sin importar en qué día real ocurrió el check-in. Por eso en la imagen aparecen L/M/X verdes cuando hoy es jueves.
- No existe ninguna marcación para los días pasados sin check-in: se muestran iguales que los días futuros (gris).

## Cambios propuestos

### 1. Mapeo real de la semana (lunes a domingo)
- Calcular el lunes de la **semana calendario actual** (usando la fecha local, no "últimos 7 días").
- Construir un array de 7 fechas (L→D) con su string `YYYY-MM-DD` local.
- Crear un `Set` de fechas con check-in a partir de `entries.entry_date` y marcar cada celda según si su fecha está en ese set.
- El contador `x/7` pasa a contar los check-ins reales de la semana calendario actual.

### 2. Estados visuales por celda
- **Completado** (hay check-in ese día): verde (`bg-success/80`), como hoy.
- **Hoy sin check-in**: neutro con borde de énfasis (anillo primario) para indicar "pendiente", no error.
- **Día pasado sin check-in**: marcación roja (`bg-destructive/15` con borde `border-destructive/60`), tal como se pide.
- **Día futuro**: gris neutro atenuado.
- La etiqueta del día de hoy se resalta en negrita.
- `aria-label` y `title` por celda describiendo fecha + estado (completado / sin check-in / hoy pendiente / próximo).

### Detalles técnicos
- Archivo único: `src/features/behavioral/Psychology.tsx`.
- Sólo cambia el `useMemo` de estadísticas semanales y el render del grid de 7 celdas; racha actual y mejor racha quedan igual.
- Uso de fechas locales (mismo criterio que `localTodayStr` ya presente en el archivo) para evitar desfases UTC.
- Sin cambios en base de datos ni en hooks.
