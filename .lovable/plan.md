# Market Brain: nuevo logo y módulo modernizado

## 1. Logo del elemento Market Brain

Generar un ícono 3D propio para Market Brain (cerebro-circuito institucional, fondo transparente, paleta beige/dorado de la marca) y reemplazar el ícono actual `brain.png` del registro de íconos 3D.

Se aplica automáticamente en:
- El item "Market Brain" del sidebar del workspace.
- El encabezado y el estado vacío de la página `/brain`.

## 2. Modernizar "Agregar datos"

Rediseño del formulario de carga (solo presentación, mismos campos y misma lógica de guardado):
- Zona de imagen con drag & drop, pegado desde portapapeles y preview grande con botón de quitar.
- Formulario colapsable en dos bloques: "Captura y contexto" (sesión, activo, timeframe, fecha) y "Resultado y estructura" (resultado, R, tipo de setup, tags, notas).
- Tags de estructura como chips agrupados con selección visible y contador.
- Barra de completitud del formulario y botón de guardar fijo al pie de la tarjeta, deshabilitado hasta tener imagen + activo.
- Estado de carga con indicador de subida y feedback de progreso.

## 3. Modernizar el análisis de cada operación

Tarjetas (grid):
- Overlay con degradado sobre la imagen, badge de resultado, R en mono y chip de score de calidad.
- Indicador de estado IA más claro (analizando / error / listo) y 2 patrones destacados como chips.

Modal de detalle, reorganizado en secciones:
- Cabecera con activo, sesión, timeframe, resultado, R y score.
- Imagen con zoom (click para ampliar).
- Bloque "Análisis IA": resumen, patrones detectados como chips y score de calidad con barra.
- Bloque "Contexto": estructura, setup, notas del operador.
- Acciones (re-analizar / eliminar) en un pie fijo.

Resumen superior (`BrainSummary`), ampliado con:
- Score de calidad promedio de las muestras analizadas.
- Distribución por sesión con barras y win-rate por sesión (comparativa).
- Top patrones con conteo y win-rate asociado, en chips.

## Notas técnicas

- Nuevo asset en `src/assets/icons3d/` y actualización de `src/shared/lib/icon3d-registry.ts` (clave `brain`).
- Cambios de UI en `src/features/brain/components/BrainSampleForm.tsx`, `BrainSampleCard.tsx`, `BrainSampleDetailModal.tsx`, `BrainSummary.tsx` y `MarketBrain.tsx`.
- Las métricas nuevas (score promedio, win-rate por sesión y por patrón) se calculan en cliente desde los campos ya existentes de `brain_samples` (`ai_quality_score`, `ai_patterns`, `session`, `outcome`). Sin migraciones ni cambios en el edge function.
- Todos los textos nuevos se agregan a `translations.ts` en ES, EN y PT; sin strings hardcodeados.
- Solo tokens semánticos del design system; sin colores fijos.
