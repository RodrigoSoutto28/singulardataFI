## Objetivo
El sistema ya tiene importación CSV con autodetección de broker (cTrader, MT4, MT5, TradingView, genérico) y bloqueo por hash de archivo. Esta iteración refuerza el reconocimiento CSV, mejora la alerta visual de duplicado y agrega tests automáticos que validen el flujo.

## Cambios

### 1. Reconocimiento CSV más robusto (`useImportTrades.ts`)
- Detectar fila de encabezado en CSV con el mismo scoring que ya se usa para Excel (`scoreHeaderRow`), para tolerar archivos con líneas de metadatos arriba (ej. exports de cTrader/MT4 con "Account: …", "Statement", etc.).
- Saltar filas de totales/subtotales al final ("Total", "Summary", "Closed P/L").
- Aceptar BOM UTF-8 al inicio del archivo.
- Mejorar detección de delimitador con desempate por consistencia entre filas, no solo la primera línea.
- Devolver en `errors` un mensaje informativo cuando se descartaron filas no parseables, indicando cuántas se reconocieron.

### 2. Alerta de duplicado más visible (`Journal.tsx`)
- Reemplazar el `toast.error` actual por un diálogo modal de confirmación (usando `Dialog` ya importado) que muestre:
  - Nombre del archivo previamente cargado
  - Fecha/hora de la importación previa
  - Cantidad de operaciones que trajo
  - Botón "Entendido" y botón "Ir a Deshacer último proceso" que dispara `handleUndoLastImport`.
- Agregar textos i18n en ES/EN/PT (`translations.ts`) para el modal.

### 3. Tests automatizados (Vitest)
Crear `src/features/journal/hooks/__tests__/useImportTrades.test.ts`:
- CSV genérico con headers estándar → parsea N trades.
- CSV con BOM y líneas de metadatos antes del header → autodetecta header.
- CSV cTrader real (snippet) → broker = ctrader, mapea symbol/direction/pnl correctamente.
- CSV con punto y coma como delimitador → parsea bien.
- Fila de "Total" al final → se ignora sin error.

Crear `src/features/journal/hooks/__tests__/useImportBatches.test.ts`:
- `hashFile` produce el mismo hash para el mismo contenido y distinto para contenido diferente.
- `hashRow` es estable y depende del `userId`.

Ejecutar con `bunx vitest run` y validar que pasan antes de cerrar.

## Detalle técnico
- No se modifica el esquema de base de datos (la tabla `import_batches` y los índices únicos ya existen).
- No se toca lógica de negocio del dashboard ni de balance.
- El modal de duplicado solo es UI; la verificación sigue siendo `findActiveBatchByFileHash` por `(user_id, file_hash)` con `is_undone = false`.

## Archivos afectados
- `src/features/journal/hooks/useImportTrades.ts` (reconocimiento CSV)
- `src/features/journal/Journal.tsx` (modal duplicado)
- `src/shared/lib/i18n/translations.ts` (textos)
- `src/features/journal/hooks/__tests__/useImportTrades.test.ts` (nuevo)
- `src/features/journal/hooks/__tests__/useImportBatches.test.ts` (nuevo)
