# Corregir: "Listo para registrar 80%" pero no se puede guardar

## Diagnóstico

En la captura, el usuario ingresó **Stop Loss = -105.60** y **Take Profit = -105.60** (valores negativos, probablemente confundiendo "precio" con "P&L").

El schema `tradeFormSchema` (`src/shared/lib/validation.ts`) exige que `stop_loss` y `take_profit` sean **`positive`** (mayores a 0). Al enviar:

1. `safeParse` falla con dos issues: `stop_loss` y `take_profit` → "debe ser mayor a 0".
2. `handleAddTrade` setea `formErrors` y muestra el toast genérico **"Revisa los campos marcados"**.
3. Pero los inputs de **Stop Loss, Take Profit, Exit Price, Exit Date, Commission, Strategy** **no renderizan** `formErrors[...]` debajo del campo (solo Símbolo, Dirección, Entry, Quantity lo hacen). El usuario no ve qué corregir.
4. La barra muestra **80 %** porque `recommendedChecks` evalúa `parseFloat(stop_loss) > 0` → con -105.60 falla, y 8/10 ítems verdaderos = 80 %. La barra dice "Listo para registrar" porque sólo evalúa requeridos (los 7 requeridos están OK), por eso el botón **se ve habilitado** pero el submit es rechazado por zod.

Es un problema de **visibilidad de errores**, no de lógica de guardado.

## Cambios (solo `src/features/journal/Journal.tsx`)

### 1. Renderizar `formErrors` en los campos faltantes

Agregar `aria-invalid` + `<p className="text-xs text-destructive">` debajo de:

- Exit Price (`formErrors.exit_price`)
- Exit Date (`formErrors.exit_date`)
- Stop Loss (`formErrors.stop_loss`)
- Take Profit (`formErrors.take_profit`)
- Commission (`formErrors.commission`)
- Strategy (`formErrors.strategy`)
- Notes (`formErrors.notes`)

Mismo patrón que ya usa Symbol (línea 1096).

### 2. Toast más informativo

Reemplazar `toast.error('Revisa los campos marcados')` por uno que liste los campos:

```ts
const labelMap = { symbol:'Símbolo', direction:'Dirección', entry_price:'Precio entrada',
  quantity:'Cantidad', exit_price:'Precio salida', exit_date:'Fecha cierre',
  stop_loss:'Stop Loss', take_profit:'Take Profit', commission:'Comisión',
  strategy:'Estrategia', entry_date:'Fecha apertura', notes:'Notas' };
const names = Object.keys(errs).map(k => labelMap[k] ?? k).join(', ');
toast.error(`Revisa: ${names}`);
```

### 3. Auto-foco al primer campo con error

Tras `setFormErrors(errs)`, hacer `document.querySelector('[aria-invalid="true"]')?.scrollIntoView({block:'center'})` para que el usuario vea el campo.

### 4. Hint visual para SL/TP

Cambiar el placeholder de Stop Loss y Take Profit de `"opcional"` a `"precio (ej. 4320.50)"` para evitar la confusión con valores de P&L.

### 5. Reflejar errores no-requeridos en la barra de progreso

Cuando `Object.keys(formErrors).length > 0`, mostrar la barra en rojo y texto "Hay campos con error" en lugar de "Listo para registrar", incluso si los requeridos están completos. Esto evita el estado contradictorio de la captura.

```tsx
const hasErrors = Object.keys(formErrors).length > 0;
// en el header:
{hasErrors ? 'Hay campos con error' : isPayloadReady ? 'Listo para registrar' : 'Completando datos'}
```

Y opcionalmente `disabled={!isPayloadReady || hasErrors || createTrade.isPending || updateTrade.isPending}` para que el usuario tenga que limpiar errores antes de reintentar.

## Prueba post-cambio

1. Abrir "Agregar operación", completar todos los requeridos, SL = `-105.60`, TP = `-105.60` → click Registrar.
2. Aparece toast: **"Revisa: Stop Loss, Take Profit"**.
3. Los inputs SL y TP muestran texto rojo **"El stop loss debe ser mayor a 0"** / **"El take profit debe ser mayor a 0"** debajo, con borde de error.
4. La barra del header cambia a **"Hay campos con error"** en rojo.
5. Corrigiendo SL/TP a valores positivos (o vaciándolos) → errores desaparecen, barra vuelve a "Listo para registrar", click Registrar guarda OK.
6. Caso open: status = Abierta, sin exit_price/exit_date → guarda sin tocar SL/TP.

No se modifica `tradeFormSchema`, `useTrades`, ni `commitTrade`.
