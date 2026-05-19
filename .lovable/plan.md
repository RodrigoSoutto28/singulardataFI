
## Objetivo

Corregir el lector/analizador automático de trades para que entienda correctamente el formato real de exportación de cTrader (`Position History List`) — donde cada operación se compone de dos filas (apertura + cierre) unidas por el ID de posición — y validar el comportamiento con tests usando el archivo que subiste como fixture.

## Problema detectado (basado en tu archivo)

Tu archivo `icmarkets_cTrader_position_history_6462681_April_2026.xlsx` tiene esta estructura:

```text
Fila 1: Report
Fila 2: Name / Produced At (metadata)
Fila 3: Symbol | Account Number | Position | Position Status | Date Time | Transaction Type | Trade Volume Lots | Open Price | Profit
Fila 4: BTCUSD | 6096132 | 83669833 | Closed | 1/31/2026 5:21 PM | Trade Buy  | 0.05 | 0 | 0
Fila 5: BTCUSD | 6096132 | 83669833 | Closed | 1/31/2026 6:32 PM | Trade Sell | 0.05 | 0 | 4.77
...
```

El parser actual:
- Detecta como `generic` (busca exactamente "position id" y "open price" con precios reales).
- Trata cada fila como una operación independiente → o descarta todo, o crea trades duplicados al subir 2 veces.
- No agrupa pares apertura/cierre por `Position`.

## Cambios

### 1. Nuevo parser específico para cTrader Position History List
Archivo: `src/features/journal/hooks/useImportTrades.ts`

- Ampliar `detectBroker(headers)` para reconocer la firma:
  cabeceras que contengan `position`, `transaction type`, `date time` y `trade volume lots`. Marcar como `ctrader-position-history`.
- Agregar función `aggregateCtraderPositions(headers, rows)` que:
  1. Recorre filas y agrupa por valor de columna `Position`.
  2. Por cada grupo (esperado: 2 filas) toma:
     - `symbol` (trim de espacios — viene como `"BTCUSD    "`).
     - `direction` = `long` si la primera fila (más antigua por Date Time) es `Trade Buy`, `short` si es `Trade Sell`.
     - `entryDate` = Date Time de la fila más antigua.
     - `exitDate` = Date Time de la fila más reciente.
     - `quantity` = `Trade Volume Lots` (cualquiera de las dos filas — son iguales).
     - `pnl` = suma de `Profit` de ambas filas (la apertura es 0).
     - `entryPrice` = `Open Price` de la primera fila si > 0; si es 0, dejar 0 y agregar nota "Precio no incluido en el export de cTrader".
     - `exitPrice` = `Open Price` de la segunda fila si > 0; si no, undefined.
     - `notes` = `Position #<id>` para trazabilidad.
  3. Si un grupo tiene una sola fila (posición aún abierta) → marcar como `status` open y omitir si no hay precio.
- Incrustar este parser en `processRows` cuando el broker sea `ctrader-position-history` (en lugar del path de `mapRowWithBroker` por fila).
- Ajustar `detectBroker` en `BROKER_MAPS` solo para el caso clásico de cTrader desktop (con Open/Close Price reales) y dejar el nuevo como variante.

### 2. Mejor manejo del autodetector de cabecera
- En `parseExcelBuffer`, las dos primeras filas son metadata (`Report`, `Name: ... / Produced At`). El scoring actual ya las salta, pero validar que `headerIdx` cae en fila 3 (índice 2) y registrar `metadata.headerRowIndex` para diagnóstico.

### 3. Tests con el archivo real
- Copiar `user-uploads://icmarkets_cTrader_position_history_6462681_April_2026.xlsx` a `src/features/journal/hooks/__tests__/fixtures/ctrader-position-history.xlsx`.
- Ampliar `src/features/journal/hooks/__tests__/useImportTrades.test.ts` con:
  - `it('parses cTrader Position History List from real fixture')`:
    - Carga el .xlsx, llama `parseExcelBuffer`.
    - Verifica: número de trades > 0, todos los trades tienen `entryDate < exitDate`, `direction` correctamente derivada de `Trade Buy/Trade Sell`, `pnl` total ≈ suma de columna `Profit` original.
    - Verifica que NO hay trades duplicados (cada `Position` aparece una sola vez).
  - `it('handles ctrader pairs with single open leg')`: pasa un buffer/CSV sintético con un único `Trade Buy` sin cierre y comprueba que no se importa como cerrado.

### 4. Tests de no-regresión
Conservar los tests existentes de CSV, BOM, MT-like, etc. para asegurar que el nuevo path no rompe nada.

## Archivos afectados

Modificados:
- `src/features/journal/hooks/useImportTrades.ts`
- `src/features/journal/hooks/__tests__/useImportTrades.test.ts`

Creados:
- `src/features/journal/hooks/__tests__/fixtures/ctrader-position-history.xlsx` (copia del archivo subido)

## Fuera de alcance

- No tocar UI (`Journal.tsx`, `ImportPreviewModal.tsx`, `ImportHistorySection.tsx`).
- No tocar lógica de hash/duplicados ni `useImportBatches.ts` — esos ya funcionan; solo cambia lo que se interpreta.
- No tocar exportación (`useExportTrades.ts`).

## Validación

Tras los cambios ejecutaré `vitest run` sobre los suites de `journal/hooks/__tests__/*` y confirmaré que:
1. El archivo real se interpreta en N trades (uno por `Position`).
2. P&L total coincide con la suma de la columna `Profit`.
3. No se generan duplicados.
4. Los tests existentes siguen pasando.
