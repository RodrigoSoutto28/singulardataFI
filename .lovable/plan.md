# Market Brain: vista de resumen de patrones por sesión

Nueva vista consolidada dentro de `/brain` que agrupa los patrones detectados por la IA según la sesión de mercado (Asia, Londres, Nueva York, Overlap), con métricas de confianza y ejemplos destacados.

## Estructura de la página

La página pasa a tener dos pestañas:
- **Biblioteca** (lo actual: formulario, filtros y grilla de muestras).
- **Patrones por sesión** (nueva vista de resumen).

El resumen de KPIs (`BrainSummary`) se mantiene visible arriba en ambas pestañas.

## Vista "Patrones por sesión"

Una tarjeta por sesión con muestras. Cada tarjeta muestra:
- Cabecera: sesión, número de muestras, win-rate y R medio de la sesión.
- Lista de patrones detectados en esa sesión, ordenados por confianza, cada uno con:
  - Nombre del patrón y número de apariciones.
  - Win-rate del patrón dentro de la sesión (barra + porcentaje).
  - R medio y calidad IA media.
  - Etiqueta de confianza: Alta / Media / Baja / Insuficiente.
  - Miniaturas de hasta 3 ejemplos destacados (mejores muestras por calidad IA y R); al hacer clic se abre el modal de detalle existente.
- Filtro de resultado (todos / win / stop) y un umbral mínimo de apariciones para reducir ruido.
- Estado vacío cuando aún no hay muestras analizadas.

## Cálculo de confianza

Se calcula en cliente, sin cambios de base de datos ni del edge function, a partir de los campos existentes (`ai_patterns`, `session`, `outcome`, `r_multiple`, `ai_quality_score`):
- **Insuficiente**: menos de 3 apariciones.
- **Baja**: 3-4 apariciones.
- **Media**: 5-9 apariciones.
- **Alta**: 10 o más apariciones y win-rate consistente (>=60% o <=40%, es decir, sesgo claro en una dirección).

Se muestra siempre el tamaño de muestra junto a la etiqueta para que la lectura sea honesta, y un aviso de que los patrones con pocas muestras no son estadísticamente concluyentes.

## Notas técnicas

- Nuevos archivos: `src/features/brain/utils/pattern-stats.ts` (agregación y confianza) y `src/features/brain/components/BrainPatternInsights.tsx` (vista).
- Cambios en `src/features/brain/MarketBrain.tsx`: pestañas con el componente `Tabs` existente y reutilización de `BrainSampleDetailModal` para los ejemplos destacados.
- Las miniaturas usan el hook `useSignedImage` ya existente para el bucket privado.
- Todos los textos nuevos se agregan a `translations.ts` en ES, EN y PT; sin strings hardcodeados.
- Solo tokens semánticos del design system; sin colores fijos ni migraciones.
