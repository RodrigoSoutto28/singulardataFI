# Reparar overflow de Logros bajo el Taxímetro

## Problema
`AchievementBadges` se reubicó dentro de la columna derecha (estrecha) del dashboard, pero su grid de escritorio sigue siendo `sm:grid-cols-2 lg:grid-cols-4`. En ese contenedor angosto las 4 columnas no caben, por lo que los íconos/textos quedan apretados y fuera de su caja, y el carrusel móvil (`sm:hidden`) ya no aplica porque en desktop se pinta el grid.

## Solución

### 1. `src/features/dashboard/components/AchievementBadges.tsx`
Agregar prop opcional `variant?: 'grid' | 'stack'` (por defecto `grid` para no romper otros usos).

- `variant="grid"` (actual): conserva `sm:grid-cols-2 lg:grid-cols-4` para vistas full-width.
- `variant="stack"`: render en columna única `flex flex-col gap-3` tanto en mobile como desktop, sin carrusel horizontal. Cada badge ocupa el ancho completo del card y se centra verticalmente, con `min-w-0` y `truncate` ya presentes para evitar overflow.

### 2. `src/features/dashboard/Dashboard.tsx`
Envolver `AchievementBadges` en una `Card` con header propio ("Logros / Disciplina") para mantener consistencia visual con `MentalStateCard` y `TaxometerWidget`, y pasar `variant="stack"`.

## Fuera de alcance
- No se cambia el comportamiento de `AchievementBadges` cuando se use en otra vista.
- No se tocan datos, hooks ni traducciones existentes (se reutiliza `t.disciplineMetrics`).
- No se modifican `MentalStateCard` ni `TaxometerWidget`.
