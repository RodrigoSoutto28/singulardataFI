## Cambios visuales en Dashboard y Tema Claro

### 1. Modo claro: más contraste y color en texto (`src/index.css`)
Ajustar tokens del bloque `:root`:
- `--background`: `210 35% 97%` → `210 40% 98%` (lienzo más limpio)
- `--foreground`: `205 45% 12%` → `205 60% 8%` (texto casi negro azulado, máximo contraste)
- `--card-foreground` y `--popover-foreground`: igualar a `205 60% 8%`
- `--muted-foreground`: `205 25% 40%` → `205 40% 28%` (texto secundario más legible)
- `--secondary-foreground`: `205 50% 18%` → `205 60% 12%`
- `--border`: `210 35% 88%` → `210 40% 82%` (bordes más visibles)
- `--input`: `210 35% 90%` → `210 40% 85%`
- `--primary`: `197 100% 35%` → `197 100% 32%` (azul más profundo y saturado)
- `--sidebar-foreground`: `205 30% 35%` → `205 50% 20%`
- `--sidebar-accent-foreground`: igualar a `205 60% 8%`

Añadir refuerzo tipográfico al final de `@layer base` (solo modo claro):
```css
:root body {
  font-weight: 450;
}
:root h1, :root h2, :root h3, :root h4 {
  color: hsl(205 65% 6%);
  font-weight: 700;
}
:root .text-muted-foreground {
  font-weight: 500;
}
```

### 2. Eliminar espacio inferior del gráfico de Equity (`src/pages/Dashboard.tsx`)
Dentro de la `Card` "Curva de Equity":
- `CardContent` → añadir `className="pb-0"` (elimina el `padding-bottom` por defecto del card).
- A `<EquityChart>` quitar `className="border-0 bg-transparent p-0"` y reemplazar por `className="border-0 bg-transparent p-0 pb-0"`.
- Dentro de `EquityChart.tsx`, reducir altura inferior: cambiar `margin={{ top: 10, right: 10, left: -20, bottom: 0 }}` ya está en 0, pero el contenedor `h-[220px] sm:h-[280px]` queda; añadir `mb-0` al div raíz y quitar `mb-4` del header → `mb-3`.

### 3. Reorganizar Quick Actions (`src/pages/Dashboard.tsx` + `QuickActionsCard.tsx`)
**Quitar** `<QuickActionsCard />` de la columna lateral derecha (debajo de MentalStateCard).

**Mover** a una barra horizontal destacada justo debajo del Hero Section y antes de `AchievementBadges`, en formato más visible y profesional:

Refactor de `QuickActionsCard.tsx` a layout horizontal tipo "action bar":
- Card con `bg-gradient-to-r from-primary/5 via-card to-accent/5 border-primary/20`
- `CardContent` en `grid grid-cols-2 md:grid-cols-4 gap-3 p-4`
- Cada acción: botón grande horizontal con icono en círculo de color sólido a la izquierda, label en negrita y subtítulo descriptivo:
  - Nuevo Trade — "Registrar operación"
  - Mi Journal — "Ver historial"
  - Check-in — "Estado mental"
  - Analytics — "Ver métricas"
- Hover: `hover:scale-[1.02] hover:shadow-lg transition-all`
- Iconos con fondo coloreado (`bg-primary/15`, `bg-success/15`, `bg-accent/15`, `bg-warning/15`) y texto del color correspondiente.

En `Dashboard.tsx`:
- Mover `<QuickActionsCard />` arriba (después del Hero, antes de AchievementBadges).
- Eliminar la instancia en la columna `space-y-4` derecha.
- La columna derecha queda con `MentalStateCard` + `TaxometerWidget` solamente, más equilibrada con la columna del gráfico.

### Verificación
- `/dashboard` en modo claro: textos más oscuros, bordes más definidos.
- Gráfico de Equity sin hueco inferior visible.
- Acciones Rápidas en barra horizontal prominente debajo del saludo.
- Columna derecha más corta y limpia.
