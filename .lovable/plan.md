# Plan: Glassmorphism global + iconos 3D ampliados

## 1. Actualizar memoria del proyecto
- Reescribir la regla central de estilo en `mem://index.md`: pasar de "Solid backgrounds, NO glassmorphism" a **"Glassmorphism global: fondos translúcidos con backdrop-blur, bordes suaves rounded-2xl, borde 1px translúcido, sombra difusa"**.
- Guardar un nuevo memo `mem://style/glass-system` con los tokens y reglas de uso.

## 2. Tokens de diseño (src/styles/index.css)
Añadir tokens semánticos para el sistema glass (modo claro y oscuro):
- `--glass-bg`, `--glass-bg-strong`, `--glass-border`, `--glass-highlight`, `--glass-shadow`, `--glass-blur` (ej. 18px).
- Utilities reutilizables:
  - `.glass-card` — fondo `hsl(var(--glass-bg))`, `backdrop-blur-xl`, borde translúcido, `rounded-2xl`, sombra suave, highlight superior.
  - `.glass-card-strong` — variante con más opacidad para modales/sidebar.
  - `.glass-panel` — variante sin sombra para contenedores anidados.
- Mantener fallback sólido para navegadores sin `backdrop-filter`.

## 3. Aplicar glass a toda la web
Reemplazar fondos sólidos por `.glass-card` / `.glass-card-strong` en:
- Sidebar (`Sidebar.tsx`) — `glass-sidebar` actualizado a versión glass real con blur.
- TopBar (`TopBar.tsx`).
- Todas las cards del Dashboard: `StatCard`, `MentalStateCard`, `QuickActionsCard`, `CapitalCard`, `EquityChart`, `RecentTrades`, `AIInsightCard`, `TasksCard`, `AchievementBadges`, `MetricCard`.
- Cards de Analytics, Journal, Psychology, Settings, Profile.
- Modales (`AccountSetupModal`, `PreMarketCheckInModal`, `ImportPreviewModal`, `ProcessValidatorModal`, dialogs shadcn).
- Componente base `card.tsx` shadcn — cambiar a glass por defecto.
- Tooltips, Popovers, Dropdowns, Select, Sheet, Drawer — versión glass.
- Inputs, Selects, Botones secundarios — bordes suaves translúcidos.
- Bordes globales: subir `--radius` a `1rem` (rounded-2xl por defecto).

## 4. Iconos 3D de la sidebar → 40px
- `Sidebar.tsx`: aumentar `h-[26px] w-[26px]` a `h-10 w-10` en el render del icono nav.
- Aumentar altura de fila de `h-10` a `h-14` para acomodar el icono.
- Sidebar colapsada: ancho `w-[64px]` → `w-[80px]`.
- Ajustar gap y padding para mantener equilibrio visual.

## 5. Iconos 3D del Dashboard → 128px fusionados arriba-derecha
Mover de la disposición inline actual a una **fusión hero en esquina superior derecha** de cada card:
- `StatCard.tsx`: icono `h-32 w-32` posicionado `absolute -top-4 -right-4` con `pointer-events-none`, ligeramente saliente, máscara/gradient radial para que se "funda" con el fondo glass. Texto vuelve a layout vertical normal con `pr-24` para reservar espacio.
- `MentalStateCard.tsx`: Brain3D `h-32 w-32` absolute esquina superior derecha; quitar del CardTitle.
- `TaxometerWidget.tsx`: igual con Taxometer3D `h-32 w-32`.
- `QuickActionsCard.tsx`: los 4 botones internos mantienen icono pequeño (ya centrados); la card en sí recibe un icono hero opcional o se omite (decidir: omitir para no saturar).
- `CapitalCard`, `EquityChart`, `RecentTrades`, `AIInsightCard`, `TasksCard`, `AchievementBadges`: añadir su Icon3D correspondiente (`balance`, `equity_curve`, `journal`, `brain`, `checkin`, `discipline`) en `h-32 w-32` absolute top-right con opacidad 90% y ligera rotación.
- Container card: `overflow-hidden` con `rounded-2xl` para recortar el icono al borde glass.
- Añadir un "glow" sutil radial detrás del icono usando el color de acento de la card.

## 6. Icon3D helper
- `Icon3D.tsx`: añadir variante `hero` que aplique drop-shadow más fuerte y un radial-gradient mask para fusión suave con la card glass.

## 7. Verificación
- Revisar contraste de texto sobre fondos glass en modo claro y oscuro.
- Confirmar que `CorporateGrid` de fondo sigue visible detrás del blur.
- Probar viewport 1780px (actual) y mobile.

## Detalles técnicos
- Sin cambios de lógica de negocio, solo presentación.
- Sin nuevas dependencias.
- Archivos principales a editar: `src/styles/index.css`, `src/shared/components/ui/card.tsx`, `src/shared/components/ui/Icon3D.tsx`, `src/shared/components/layout/Sidebar.tsx`, `src/shared/components/layout/TopBar.tsx`, todos los `src/features/dashboard/components/*.tsx`, modales y dialogs.
- Actualizar memoria: `mem://index.md` + nuevo `mem://style/glass-system`.
