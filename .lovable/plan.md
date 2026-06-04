## Objetivo

En `/psychology` (pestaña **Hoy**), la tarjeta "Check-in del Día" se ve sobredimensionada frente a la columna izquierda ("Tu Progreso" y "Logros"), y los paddings/headers están desalineados entre ambas columnas. Vamos a unificar tamaños y espacios.

## Cambios (solo presentación, archivo `src/features/behavioral/Psychology.tsx`)

### 1. Unificar headers de todas las cards de la pestaña
- `CardHeader` → `pb-3` en las 3 cards (Progreso, Logros, Check-in/Resumen).
- `CardTitle` → `text-base` consistente (hoy la card de Check-in usa el tamaño por defecto `text-2xl`, lo que la hace desproporcionada).
- `CardDescription` → `text-xs` para alinearla visualmente con el resto.

### 2. Ajustar tamaño de la tarjeta "Check-in del Día" (form)
- `CardContent` → `space-y-5 pt-0 pb-5` (hoy `space-y-6` sin control de padding).
- Botones de emociones: bajar `min-h-[78px]` → `min-h-[68px]`, icono `h-8 w-8` → `h-7 w-7`, padding `p-2.5` → `p-2`.
- Labels de secciones (1, 2, 3, 4): `text-base font-semibold` → `text-sm font-semibold` para alinear con la jerarquía del resto del panel.
- Reducir paddings internos de bloques (sliders, textarea wrappers) a escala compacta uniforme.

### 3. Ajustar tarjeta "Check-in Completado" (resumen)
- Mismas reglas de header (`pb-3`, `text-base`, `text-xs`).
- Grid de 3 métricas (Disciplina/Sueño/Estrés): `p-4` → `p-3`, número `text-3xl` → `text-2xl` para que no domine la pantalla.
- `CardContent` → `space-y-5 pt-0 pb-5`.

### 4. Unificar espaciado entre columnas y cards
- Contenedor principal: `gap-6` → `gap-4 md:gap-6` (coincide con el resto del dashboard).
- Columna izquierda: `space-y-4` → `space-y-4 md:gap-6` (mantener simetría con la derecha).
- Card "Logros": añadir `pb-3` al header (hoy usa el padding por defecto y queda más alto que "Tu Progreso").

### 5. Sin cambios funcionales
- No tocar hooks, validación, mutaciones, ni textos.
- No modificar la grid responsive `lg:grid-cols-[300px_1fr]` (la proporción ya es correcta; el problema era el peso visual interno, no el layout).

## Resultado esperado

- "Check-in del Día" deja de verse sobredimensionado y queda alineado en altura/jerarquía con la columna de stats.
- Padding y tamaños de tipografía consistentes entre las 3 cards.
- Espaciado uniforme con el resto del producto (dashboard).
