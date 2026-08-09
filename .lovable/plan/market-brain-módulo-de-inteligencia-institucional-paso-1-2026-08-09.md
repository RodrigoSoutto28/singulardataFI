# Market Brain — Módulo de inteligencia institucional (Paso 1)

Nuevo espacio en la app donde el trader alimenta un "cerebro" con capturas de operaciones ganadoras y de stop loss, más el contexto operativo. Cada muestra se analiza con IA para extraer patrones institucionales por sesión de mercado. Biblioteca privada por usuario.

## Qué se construye

1. **Nueva sección "Market Brain"** en la navegación lateral (icono cerebro/3D existente), ruta `/brain`, protegida por login.
2. **Formulario de carga de muestra**
   - Imagen del gráfico (subida a almacenamiento privado, con vista previa en miniatura).
   - Sesión y activo: sesión (Asia / Londres / Nueva York / Overlap), activo, timeframe, fecha y hora.
   - Estructura de mercado (multi-selección): tendencia, rango, liquidez barrida, FVG, order block, breakout falso, alta/baja volatilidad, noticias.
   - Resultado: Ganadora / Stop loss, R obtenido, tipo de setup.
   - Notas libres: descripción del contexto e hipótesis institucional.
3. **Análisis IA por muestra**
   - Al guardar, se envía la imagen + contexto al modelo multimodal y devuelve: lectura del contexto institucional, fase de mercado detectada, comportamiento de liquidez, calidad del setup (0-100), etiquetas de patrón y observaciones.
   - El resultado se guarda junto a la muestra y se muestra en la ficha; botón "Re-analizar".
   - Estados visibles: pendiente / analizando / listo / error (con mensajes claros para límite de uso o créditos agotados).
4. **Biblioteca de muestras**
   - Grilla de tarjetas con miniatura, activo, sesión, resultado y etiquetas de patrón.
   - Filtros por sesión, activo, resultado y etiqueta; buscador por texto.
   - Detalle en modal: imagen ampliada, contexto completo y análisis de la IA; editar y eliminar.
5. **Panel resumen (base para el paso 2)**
   - Conteo de muestras, distribución ganadoras vs stop, muestras por sesión y top de patrones detectados, calculados desde las muestras del usuario.
6. **Idiomas**: todos los textos nuevos en ES/EN/PT vía el diccionario i18n existente. Sin cadenas fijas en los componentes.

## Detalles técnicos

- **Base de datos**: tabla `public.brain_samples` (user_id, image_path, session, symbol, timeframe, occurred_at, structure_tags text[], outcome, r_multiple, setup_type, notes, ai_status, ai_summary, ai_patterns text[], ai_quality_score, ai_raw jsonb, timestamps). GRANT para `authenticated` + `service_role`, RLS habilitado con políticas por `auth.uid()` en select/insert/update/delete. Sin acceso `anon`. Trigger `update_updated_at_column`.
- **Almacenamiento**: bucket privado `brain-samples`, políticas en `storage.objects` restringidas a la carpeta `{user_id}/`; lectura vía URL firmada, igual patrón que `trade-screenshots`.
- **Edge function `analyze-brain-sample`**: recibe el id de la muestra, valida el JWT del usuario, genera URL firmada de la imagen, llama a Lovable AI (`google/gemini-3.6-flash`, entrada multimodal imagen + texto) con salida estructurada, guarda el resultado en la fila y devuelve el análisis. Prompt de sistema: analista cuantitativo institucional, sin señales de compra/venta ni promesas de rentabilidad.
- **Frontend**: `src/features/brain/` con `MarketBrain.tsx`, `components/BrainSampleForm.tsx`, `components/BrainSampleCard.tsx`, `components/BrainSampleDetailModal.tsx`, `components/BrainSummary.tsx`, `hooks/useBrainSamples.ts` (TanStack Query, mismo patrón que `useTrades`), `types.ts`.
- **Rutas y nav**: alta en `src/app/routes.tsx` (lazy) y en `navItems` de `Sidebar.tsx`.
- **Validación**: esquema Zod en el feature (imagen obligatoria, sesión/activo/resultado obligatorios, R numérico opcional), errores inline como en el diario.

## Fuera de alcance de este paso

Correlación cruzada con las operaciones del diario, embeddings/búsqueda semántica, informes agregados avanzados y biblioteca compartida entre usuarios — se estructuran en el siguiente paso.
