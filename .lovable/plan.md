# Plan: Efectos psicológicos y micro-animaciones

Añadir un set de utilidades CSS y aplicarlas como clases en componentes existentes del Dashboard, sin tocar lógica, imports ni tipos.

## 1. `src/index.css` — nuevas utilidades
Añadir al final del bloque `@layer components` (sin tocar `@layer base`, `.dark` ni `@layer utilities`):
- Keyframes y clases: `pulse-loss`, `pulse-profit`, `progress-animate`, `pulse-incomplete`, `shimmer-elite`, `number-pop`, `lift-strong`, `icon-spring`.
- Extensión de `stagger-item` para hijos 9–12.

## 2. `src/pages/Dashboard.tsx`
- Quick Stats grid: añadir `[&>*]:animate-fade-in [&>*]:stagger-item` al contenedor de las 4 `StatCard`.
- Main Content grid: la columna principal (`lg:col-span-2`) recibe `animate-fade-in`; la sidebar derecha recibe `[&>*]:animate-fade-in [&>*]:stagger-item` para escalonar `MentalStateCard` y `TaxometerWidget`.

## 3. `src/components/psychology/TaxometerWidget.tsx`
- Card raíz: añadir `lift-strong`.
- Monto perdido: añadir `number-pop` (sesgo de aversión a la pérdida).

## 4. `src/components/dashboard/MentalStateCard.tsx`
Sólo el bloque "Score Visual":
- Emoji: `text-5xl mb-2` → `text-4xl mb-1.5` + `animate-subtle-bounce`.
- Score `{disciplineScore}/10`: añadir `number-pop`.

## 5. `src/components/dashboard/AchievementBadges.tsx`
En `getStatusStyles`:
- `completed.container`: + `lift-strong`.
- `in-progress.container`: + `lift-strong`; `in-progress.icon`: + `pulse-incomplete` (efecto Zeigarnik).
- `default.container`: + `opacity-70`.

## 6. `src/components/dashboard/QuickActionsCard.tsx`
- Contenedor del grid: + `[&>*]:animate-fade-in [&>*]:stagger-item`.
- Cada `<button>`: ya usa `group`; añadir si falta.
- `<action.icon>`: + `icon-spring` para rotar/escalar al hover del grupo.

## Reglas
- Sin cambios de lógica, imports, tipos, hooks ni navegación.
- Sin tocar `tailwind.config.ts` ni variables de color.
- Si alguna utilidad ya referenciada (`animate-subtle-bounce`) no existe, se mantiene la clase: si falta el keyframe la app sigue funcionando (no rompe build). Verificar tras aplicar; añadirla sólo si el usuario lo confirma.

## Verificación
- Build OK.
- Cascadas visibles en stat cards, sidebar y quick actions.
- Hover lift en taxómetro y achievements.
- Pulso en achievements "in-progress", atenuación en "locked".
- Funcionalidad y responsive intactos.
