
# Plan: Motor de importación de operaciones potenciado

## Objetivo
Mejorar `useImportTrades` para que detecte e interprete con mayor precisión datos de brokers reales (cTrader, MT4, MT5, TradingView, Binance, Bybit, IBKR, NinjaTrader, ThinkorSwim) y permita importar varios archivos a la vez con resultados unificados.

## Alcance funcional

### 1. Multi-archivo
- `useImportTrades` expone una nueva función `importFromFiles(files: File[])` que procesa N archivos en paralelo (Promise.all) y devuelve un `ParseResult` consolidado (trades + errores etiquetados por archivo + metadata por archivo).
- `Journal.tsx`: el `<input type="file" />` cambia a `multiple`. Si se sube 1 archivo se comporta igual que antes; si son varios, el `ImportPreviewModal` recibe los trades fusionados y muestra una columna "Origen" con el nombre del archivo.
- Deduplicación cruzada entre archivos por `(symbol, entryDate, exitDate, entryPrice, quantity)`.

### 2. Detección de broker reforzada
Ampliar `detectBroker` y `BROKER_MAPS` para:
- **MT5 Detailed (HTML)**: cabeceras "Position", "S/L", "T/P", "Commission", "Swap".
- **MT4 statement (HTML)**: secciones "Closed Transactions".
- **Binance Spot/Futures CSV**: `Date(UTC), Pair, Side, Price, Executed, Amount, Fee, Realized Profit`.
- **Bybit**: `Contracts, Closed P&L`.
- **IBKR Flex/Activity**: `Symbol, DateTime, Quantity, T. Price, Proceeds, Comm/Fee, Realized P/L`.
- **NinjaTrader**: `Instrument, Account, Strategy, Market pos., Qty, Entry price, Exit price, Entry time, Exit time, Profit`.
- **TradingView Strategy Tester**: filas pareadas Entry/Exit por `Trade #`.
- **DXTrade / Match-Trader / TradeLocker**: aliases adicionales.

### 3. Parsers nuevos / mejorados
- **PDF**: integrar `pdfjs-dist` (ya disponible vía Vite) para extraer texto y, si se detecta una tabla tipo statement, derivar filas; si no, devolver error claro con recomendación de exportar CSV.
- **HTML/MHTML real**: mejorar `parseHTML` para iterar TODAS las tablas, detectar la que tiene más cabeceras reconocidas, soportar reportes MT4/MT5 multi-tabla (Closed Transactions, Open Trades, Working Orders), y descartar tablas resumen.
- **XML**: detectar y soportar reportes XML genéricos (MT5 `<order>` / FIX-like) usando `DOMParser`.
- **TSV/PRN**: ya cubierto por detector de delimitador; añadir delimitador de ancho fijo cuando todas las líneas tienen `\s{2,}` consistente.

### 4. Mejoras del motor de identificación
- **Fuzzy header matching**: usar distancia Levenshtein ≤ 2 contra aliases cuando no hay match exacto/substring, para tolerar typos y variaciones de idioma (ej. "Quantidade", "Quantité").
- **Detección de cabecera multi-fila**: cuando una cabecera ocupa 2 filas (común en MT5), fusionar texto antes de scoring.
- **Inferencia de dirección**: si falta columna, deducirla por `exitPrice vs entryPrice + pnl` (ya parcial) y por símbolo del lote (negativo = sell en algunos brokers).
- **Normalización de símbolos**: stripear sufijos `.a`, `.r`, `-PRO`, `_ECN`, etc., manteniendo el ticker base + guardar el sufijo en `notes`.
- **Fechas**: añadir formatos `YYYY.MM.DD HH:mm:ss` (MT4/MT5), `DD-MMM-YYYY`, `MMM DD, YYYY`, epoch ms.
- **Moneda**: detectar columna `Currency` o símbolos $/€/£ en P&L y guardar en metadata.
- **Comisión + swap**: capturar como campos separados y restar/sumar al pnl bruto cuando solo viene "Gross Profit".

### 5. Validaciones y diagnóstico (preview)
- El `ImportPreviewModal` ya muestra metadata; añadir:
  - Resumen por archivo (cuando es multi-archivo).
  - Conteo de operaciones duplicadas entre archivos.
  - Aviso cuando >30% de filas fueron ignoradas (probable formato no reconocido).
  - Lista de cabeceras NO mapeadas para que el usuario detecte gaps.

### 6. Tests
Ampliar `useImportTrades.test.ts` con fixtures:
- Binance Spot CSV.
- MT4 HTML statement (mini).
- IBKR CSV.
- Multi-archivo (2 CSVs con duplicados cruzados).
- Cabecera multi-fila MT5.

## Detalles técnicos

### Archivos a tocar
- `src/features/journal/hooks/useImportTrades.ts` — núcleo de cambios.
- `src/features/journal/Journal.tsx` — input `multiple`, llamada a `importFromFiles`.
- `src/features/journal/components/ImportPreviewModal.tsx` — columna origen + resumen multi-archivo + cabeceras no mapeadas.
- `src/features/journal/hooks/__tests__/useImportTrades.test.ts` — tests nuevos + fixtures en `__tests__/fixtures/`.
- (Opcional) `package.json` — añadir `pdfjs-dist` si se confirma soporte PDF.

### Estructuras nuevas
```ts
interface FileParseResult extends ParseResult {
  fileName: string;
  fileSize: number;
  brokerDetected: BrokerFormat | 'unknown';
}
interface MultiParseResult {
  files: FileParseResult[];
  mergedTrades: ImportedTrade[];
  crossFileDuplicates: number;
  totalErrors: string[];
}
```

### Estrategia de fuzzy matching
Helper local `levenshtein(a, b)` (≤30 líneas, sin deps). Solo se invoca para headers no resueltos por match exacto/substring.

## Fuera de alcance
- OCR de PDFs escaneados.
- Conexión directa a APIs de brokers.
- Reescritura del flujo de batches/duplicados ya existente (`useImportBatches`).
- Cambios visuales fuera del modal de import.

## Preguntas abiertas
1. ¿Querés soporte real de PDF (añade `pdfjs-dist` ~2 MB) o mantenemos el mensaje actual de "exportá como CSV"?
2. ¿Confirmás importación multi-archivo simultánea desde el botón "Importar"?
