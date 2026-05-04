## Goal

Añadir un fondo animado de partículas conectadas (estilo "constellation") que aparezca:
1. En la **página de Auth** (`/auth`), detrás del formulario, como bienvenida.
2. Como fondo global sutil en las rutas públicas/landing.

## Cambios

### 1. Nuevo componente `src/components/effects/ParticleBackground.tsx`
- Adaptación del snippet aportado por el usuario, corrigiendo:
  - Typo `w-fulnavl` → `w-full`.
  - `canvas.getContext('2d')` con guard de null (TS strict).
  - `Math.floor(Math.random() * 360)` reemplazado por radianes (`Math.random() * Math.PI * 2`) para que `Math.cos/sin` funcionen correctamente.
  - Velocidad reducida (0.4) para look institucional, no distraer.
  - Cap de partículas (máx 120) para rendimiento en pantallas grandes.
  - Re-inicializar partículas al `resize`.
  - Color de líneas usando el brand primary `rgba(66,158,189)` (#429EBD) en lugar del azul neón original — coherente con la regla de marca "NO neon glows".
  - Color de partículas blanco con opacidad 0.85.
  - Prop opcional `className` para override.
  - Default: `pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-60`.
  - `aria-hidden` para accesibilidad.

### 2. `src/pages/Auth.tsx`
- Importar `ParticleBackground` y renderizarlo como primer hijo del contenedor raíz, antes del header/formulario, para que quede de fondo.
- El canvas usa `fixed inset-0 -z-10`, así que no interfiere con la interacción del formulario.

## Detalles técnicos

- El componente es client-only (usa `useEffect` + `canvas`); compatible con Vite/React 18.
- No se añade `'use client'` (es directiva de Next.js, no aplica a este proyecto Vite).
- Respeta la marca: usa el azul primario `#429EBD` para las líneas, sin glow ni glassmorphism.
- Sin dependencias nuevas.

## Fuera de alcance

- No se añade el fondo a rutas autenticadas del dashboard (ya tienen `CorporateGrid`).
- No se añaden controles de usuario para activar/desactivar el efecto.
