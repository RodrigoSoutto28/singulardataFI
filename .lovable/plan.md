## Objetivo

Regenerar los iconos 3D del dashboard con **fondo transparente** y reubicarlos para que se integren mejor con las tarjetas (sin tapar texto ni invadir otros elementos), inspirado en la imagen de referencia (estética cobre/bronce + verde salvia + púrpura profundo sobre fondo oscuro, iconos flotando limpios sin caja de color sólido detrás).

## Diagnóstico actual

Mirando la captura adjunta, los iconos actuales tienen problemas:
1. **Fondos sólidos cuadrados** (verde, púrpura, naranja) que crean "parches" visuales que rompen la composición del dashboard.
2. **Posicionamiento invasivo**: los iconos sobresalen fuera de las tarjetas (Quick Actions, StatCards) y se solapan con tarjetas vecinas.
3. **Tamaño excesivo** en algunos casos (h-28 w-28 en StatCard, h-20 w-20 en QuickActions) que compite con los números/labels.
4. Los iconos de Estado Mental (cerebro) y Taxímetro (engranajes) son demasiado grandes y desbordan la tarjeta.

## Cambios propuestos

### 1. Regenerar los 13 iconos 3D con fondo transparente
Usar `imagegen` con `transparent_background: true` y prompt consistente:
- Estilo: render 3D fotorrealista, materiales **cobre pulido + verde salvia + púrpura profundo**, iluminación cinematográfica suave, sin fondo, sin plataforma/base.
- Iconos a regenerar (mismas rutas en `src/assets/icons3d/`):
  `dashboard, journal, analytics, brain, new_trade, checkin, balance, pnl, winrate, discipline, equity_curve, taxometer, activity`.

### 2. Reubicar y redimensionar iconos en componentes

**`StatCard.tsx`** — icono actual `h-20 w-20 md:h-28 w-28` absoluto top-right.
- Reducir a `h-16 w-16 md:h-20 w-20`.
- Ajustar márgenes del contenido (`mr-24 md:mr-32` → `mr-20 md:mr-24`).
- Reposicionar a `right-3 top-3` con leve rotación.

**`QuickActionsCard.tsx`** — iconos `h-16 md:h-20` que sobresalen del botón.
- Mantener tamaño pero asegurar `overflow-hidden` en lugar de `overflow-visible` para que no invadan tarjetas vecinas.
- Reposicionar a esquina inferior-derecha sutil (`bottom-2 right-2`) y mover el label arriba para mejor legibilidad.

**`MentalStateCard.tsx`** — cerebro `h-16 md:h-20`.
- Mantener tamaño; ajustar a `right-3 top-3`. Ya está OK tras transparencia.

**`TaxometerWidget.tsx`** — `h-20 w-20`.
- Reducir a `h-14 w-14` y posicionar `right-3 top-3`.

### 3. Limpieza del helper Icon3D
- Eliminar `drop-shadow-xl` del componente base `Icon3D.tsx` (genera halo oscuro que con PNG transparente se nota feo); reemplazar por sombra sutil `drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]` aplicada solo en hover.

### 4. (Opcional) Script post-proceso
Ya existe `remove-white-bg.js` — si algún icono nuevo viniera con fondo blanco residual, ejecutarlo una vez sobre `src/assets/icons3d/` para garantizar transparencia total.

## Fuera de alcance
- No se tocan colores semánticos del tema ni layout general (grid de tarjetas).
- No se modifican datos, hooks ni lógica.

## Entregable
Dashboard con iconos 3D flotantes limpios, sin parches de color de fondo, correctamente contenidos en sus tarjetas y proporcionados al contenido — coherente con la referencia visual aportada.
