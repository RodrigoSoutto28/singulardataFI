## Plan: Desactivar bypass + corregir posicionamiento

### 1. Desactivar bypass de autenticación
- `src/features/auth/components/ProtectedRoute.tsx`: cambiar `BYPASS_AUTH = true` → `false`. Mantener el flag con comentario para reactivación rápida en desarrollo.
- Revisar `src/features/auth/Auth.tsx` para retirar cualquier redirección/atajo de bypass añadido previamente y restaurar el flujo normal de sign-in.

### 2. Corregir StatCards (icono 3D tapa texto)
- `src/features/dashboard/components/StatCard.tsx`:
  - El icono `.icon3d-hero` (128px, top-right, rotado) se superpone al valor en pantallas medianas. Reducir a 96×96 (`h-24 w-24`) en la card, mantener offset suave y aumentar `pr-` del CardContent a `pr-28`.
  - Subir `min-h-[140px]` para que el valor y el badge no compitan con el icono.
  - Asegurar `overflow-hidden` (no `overflow-visible`) para que el icono no se salga de la card en grids estrechos.

### 3. Corregir Sidebar (iconos 40px cortados)
- `src/shared/components/layout/Sidebar.tsx`:
  - Filas `h-14` con icono `h-10 w-10` deja sólo 8px de padding vertical → reducir icono a `h-9 w-9` (36px) o subir fila a `h-16`.
  - Centrar icono en modo colapsado (`w-20`) usando `justify-center` y quitar padding lateral en ese estado.
  - Garantizar que el label expandido use `truncate` y `min-w-0` para evitar desbordes.

### 4. Corregir TopBar
- `src/shared/components/layout/TopBar.tsx`:
  - El grid `grid-cols-[auto_1fr_auto]` en mobile y `flex` en desktop genera saltos. Unificar a `flex items-center justify-between` con un contenedor central oculto en desktop.
  - Alinear `AccountSwitcher`, theme toggle y avatar con `items-center` y `h-9` consistente.
  - Asegurar `min-w-0` y `truncate` en el nombre del perfil.

### 5. Corregir QuickActionsCard
- `src/features/dashboard/components/QuickActionsCard.tsx`:
  - Botones `h-28` con icono `w-14 h-14` + label dejan el label pegado al borde. Pasar a `h-32`, icono `h-16 w-16`, distribución `justify-center gap-2` en lugar de `justify-between`.
  - Añadir `glass-subtle` para coherencia con sistema glass.

### 6. Verificación
- Ejecutar dev server, abrir `/dashboard`, `/journal`, `/analytics`, `/psychology`, `/settings` en desktop (1742px) y mobile (390px) vía `browser--view_preview` + screenshots, confirmando que:
  - Ningún icono 3D tapa texto.
  - Sidebar colapsada y expandida centran correctamente.
  - TopBar no salta entre breakpoints.
  - Auth redirige a `/auth` cuando no hay sesión.

### Archivos a modificar
- `src/features/auth/components/ProtectedRoute.tsx`
- `src/features/auth/Auth.tsx` (revisar)
- `src/features/dashboard/components/StatCard.tsx`
- `src/features/dashboard/components/QuickActionsCard.tsx`
- `src/shared/components/layout/Sidebar.tsx`
- `src/shared/components/layout/TopBar.tsx`

Sin cambios de lógica de negocio ni de datos.
