## Objetivo

En el formulario "Agregar / Editar operación", reemplazar el campo **Stop Loss (precio)** por **Tamaño del Stop** expresado en la moneda de la cuenta de trading activa (por defecto USD). El resto del formulario queda intacto.

## Cambios

### 1. Base de datos — nueva columna `stop_size`

Agregar a `public.trades`:

- `stop_size numeric(15,2)` — monto en dinero que el usuario está dispuesto a perder en el trade, en la moneda de la cuenta.

Se mantiene `stop_loss numeric(20,8)` para no romper imports de brokers (MT4/MT5/cTrader siguen guardando precio del SL). El formulario manual deja de escribir en `stop_loss`.

(Migración separada, aprobada por el usuario antes de tocar código.)

### 2. Hook de cuenta activa → moneda

Reutilizar `useSelectedAccountId` + el hook que ya carga la cuenta activa (`useTradingAccount` / `useTradingAccounts`) para exponer `activeAccount.currency` (default `'USD'`). No se agrega selector visible: la moneda viene de la cuenta.

### 3. Formulario `src/features/journal/Journal.tsx`

- `formData`: renombrar `stop_loss: ''` a `stop_size: ''` (estado del formulario únicamente; el nombre del campo en DB sigue siendo `stop_size`). `take_profit` queda igual (precio).
- Reemplazar el `<Input>` de Stop Loss (líneas ~1264-1277) por:
  - Label: `Tamaño del Stop ({currency})` — ej. "Tamaño del Stop (USD)".
  - `Input` `type="number" step="any" min="0"` con prefijo visual del símbolo de moneda dentro del input (`$`, `€`, `R$`, etc., derivado de `currency`).
  - Placeholder: `ej. 50.00`.
  - Help text debajo: "Cuánto dinero estás dispuesto a perder si se ejecuta el stop".
- `handleAddTrade`: en el `payload` quitar `stop_loss: num(formData.stop_loss)` y agregar `stop_size: num(formData.stop_size)`. `stop_loss` se envía como `null` desde el formulario manual.
- `openEditTrade`: hidratar `stop_size` desde `trade.stop_size?.toString() ?? ''` en vez de `stop_loss`.
- `recommendedChecks` (línea ~220): cambiar `stop_loss` → `stop_size` (`parseFloat(formData.stop_size) > 0`).
- Detector psicológico (`detectPsychologicalErrors`): el chequeo de "missing stop loss" debe considerar válido si `stop_size > 0` (pasarle `stop_size` además de `stop_loss`, o calcular `hasRiskDefined = stop_size > 0 || stop_loss > 0`).
- Preview R:R (líneas ~1322-1364): se elimina el bloque R:R basado en `entry/sl/tp` y se reemplaza por un resumen simple cuando hay datos:
  - **P&L Estimado** (igual que hoy, sin tocar).
  - **Riesgo** = `stop_size` formateado en la moneda (`$50.00`).
  - **R:R** se muestra solo si hay `stop_size > 0` Y `take_profit > 0` Y `entry_price > 0` Y `quantity > 0` Y `direction`. Cálculo: `reward = (direction==='long' ? tp-entry : entry-tp) * qty`; `rr = reward / stop_size`.

### 4. Validación `src/shared/lib/validation.ts`

En `tradeFormSchema`:

- Eliminar el campo `stop_loss` del schema (el formulario ya no lo envía).
- Agregar:
  ```ts
  stop_size: z
    .union([z.literal(''), z.coerce.number().positive('El tamaño del stop debe ser mayor a 0')])
    .optional()
    .nullable(),
  ```
- `take_profit` queda como está.

### 5. i18n `src/shared/lib/i18n/translations.ts`

Agregar claves nuevas (ES/EN/PT):

- `stopSize`: "Tamaño del Stop" / "Stop Size" / "Tamanho do Stop"
- `stopSizeHint`: "Cuánto dinero estás dispuesto a perder…" / "How much money you're willing to lose…" / "Quanto dinheiro está disposto a perder…"
- `risk`: "Riesgo" / "Risk" / "Risco"

La clave `stopLoss` se mantiene (la usan vistas de detalle y ledger para imports).

### 6. Tests

Actualizar `src/features/journal/__tests__/Journal.addTradeFlow.test.tsx`:

- En el happy-path, escribir `'50'` en el nuevo input "Tamaño del Stop" y assert que el payload contiene `stop_size: 50` y `stop_loss: null`.
- El caso de error de Stop negativo pasa a usar `-50` en `stop_size` y verifica el mensaje "tamaño del stop debe ser mayor a 0" y `aria-invalid` en ese input.
- Eliminar la línea que tipea `take_profit` negativo si la combinación deja de tener sentido, o ajustar el regex del toast a "Tamaño del Stop".

## Fuera de alcance (no se toca)

- Ledger, AnalyticsHub, exportadores, importadores: siguen leyendo `stop_loss` (precio) como hoy. La nueva columna `stop_size` es solo lectura/escritura desde el formulario manual por ahora.
- Edición de trades importados: si un trade no tiene `stop_size`, el campo aparece vacío y el usuario puede llenarlo.
- Selector de moneda en el formulario: no se agrega; sale automáticamente de la cuenta activa.

## Plan de prueba

1. Abrir "Agregar operación" con cuenta USD → label muestra "Tamaño del Stop (USD)" con prefijo `$`.
2. Llenar todos los requeridos + `Tamaño del Stop = 50` + `Take Profit = 4350` + `Entry = 4300`, qty=1, long → R:R = `(4350-4300)*1 / 50 = 1.00` se muestra "1 : 1.00".
3. Cambiar la cuenta activa a una con `currency='EUR'` → label cambia a "Tamaño del Stop (EUR)" con `€`.
4. Guardar → en DB el trade tiene `stop_size = 50.00` y `stop_loss = NULL`.
5. Editar el trade guardado → el campo se rehidrata con `50`.
6. Importar un CSV MT5 con SL precio → el trade aparece con `stop_loss` (precio) y `stop_size` NULL; el ledger sigue mostrando todo bien.
