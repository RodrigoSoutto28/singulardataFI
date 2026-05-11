## Reestructurar Métricas Conductuales — Iconos Lucide y compactación

Aplicaremos 5 ediciones quirúrgicas en `src/features/behavioral/Psychology.tsx`. Cada cambio respeta las reglas globales: sin tocar hooks, tipos, schemas, el array `emotions` (solo se usa la propiedad `Icon` ya existente), ni las pestañas Historial/Insights/Taxímetro fuera de los puntos indicados.

### Paso 1 — Selector de emociones (tab Hoy)
Reemplazar el render de `emotion.emoji` (text-2xl) por `<emotion.Icon />` dentro de un contenedor circular 32px. Estados seleccionados muestran ring + color destructive (negativas) o primary (positivas). Añadir `aria-pressed` y `aria-label`. Botón ~25% más compacto (min-h 78px).

### Paso 2 — AchievementBadge
Cambiar la prop `icon: string` por `Icon: LucideIcon`. Renderizar el icono en un cuadrado 36px con fondo según estado. Actualizar las 3 llamadas para pasar `Flame`, `Target`, `BookOpen` (ya importados).

### Paso 3 — Card "Tu Progreso"
- Añadir icono `TrendingUp` al título; `pb-3` en header.
- Reducir spacing global a `space-y-3`, progress a `h-1.5`.
- Reorganizar Racha actual / Mejor racha en grid 2-col con cards muted.
- Tracker semanal: añadir labels `L M X J V S D` arriba, cambiar cuadrados `aspect-square` por barras `h-6`, agregar contador `X/7`.

### Paso 4 — Badge de emoción en Historial
Sustituir `<span>{emotionData.emoji}</span>` por `<emotionData.Icon className="h-3 w-3" />` y aplicar color del badge según `emotionData.negative` (destructive vs primary).

### Paso 5 — Layout de columnas
- `grid-cols-1 lg:grid-cols-3` → `grid-cols-1 lg:grid-cols-[300px_1fr]`.
- Eliminar `lg:col-span-2` de la columna derecha.
- Mobile sin cambios (sigue 1 columna).

### Verificación
- Confirmar que el bloque del selector (líneas ~423-454), el componente AchievementBadge (~253-280) y sus 3 llamadas (~222-241), la card Progreso (~170-213), el badge en historial (~617-622) y las dos líneas del grid (~167 y ~246) coinciden exactamente. Si alguno difiere, reportar y detener.
- Build sin errores nuevos; todos los iconos usados ya están importados.
- Funcionalidad de selección/submit/streaks/i18n intacta.
