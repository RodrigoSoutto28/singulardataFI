# Plan: Mejorar UX de carga del formulario unificado de nueva operación

Solo se modifica `src/features/journal/Journal.tsx`. Sin cambios en hooks, schemas, ni BD.

## 1. Derivar el estado de "payload listo"

Calcular en cada render, usando los valores actuales de `formData`:

- **Campos requeridos siempre**: `symbol`, `direction`, `entry_price > 0`, `quantity > 0`, `entry_date`.
- **Campos requeridos si `status === 'closed'`**: `exit_price > 0`, `exit_date`.
- **Recomendados (no bloquean, pero descuentan en el progreso)**: `stop_loss`, `take_profit`, `strategy`.

Implementación:

```ts
const requiredChecks = [
  { key: 'symbol',     ok: formData.symbol.trim().length > 0 },
  { key: 'direction',  ok: formData.direction === 'long' || formData.direction === 'short' },
  { key: 'entry_price',ok: parseFloat(formData.entry_price) > 0 },
  { key: 'quantity',   ok: parseFloat(formData.quantity) > 0 },
  { key: 'entry_date', ok: formData.entry_date.trim().length > 0 },
  ...(formData.status === 'closed'
    ? [
        { key: 'exit_price', ok: parseFloat(formData.exit_price) > 0 },
        { key: 'exit_date',  ok: formData.exit_date.trim().length > 0 },
      ]
    : []),
];
const recommendedChecks = [
  { key: 'stop_loss',   ok: parseFloat(formData.stop_loss) > 0 },
  { key: 'take_profit', ok: parseFloat(formData.take_profit) > 0 },
  { key: 'strategy',    ok: formData.strategy.trim().length > 0 },
];

const requiredDone   = requiredChecks.filter(c => c.ok).length;
const recommendedDone= recommendedChecks.filter(c => c.ok).length;
const totalChecks    = requiredChecks.length + recommendedChecks.length;
const progressPct    = Math.round(((requiredDone + recommendedDone) / totalChecks) * 100);
const isPayloadReady = requiredDone === requiredChecks.length;
const missingRequired= requiredChecks.filter(c => !c.ok).map(c => c.key);
```

## 2. Indicador de progreso en el header del Dialog

Debajo de `DialogHeader` (antes del `<form>`), añadir una barra fina (`<Progress>` de `@/shared/components/ui/progress`, ya disponible) + un texto pequeño:

```tsx
<div className="px-4 sm:px-6 pt-2 pb-3 border-b border-border shrink-0 space-y-1.5">
  <div className="flex items-center justify-between text-[11px] font-mono">
    <span className="text-muted-foreground uppercase tracking-wider">
      {isPayloadReady ? 'Listo para registrar' : 'Completando datos'}
    </span>
    <span className={cn(
      'tabular-nums',
      isPayloadReady ? 'text-emerald-400' : 'text-muted-foreground'
    )}>
      {progressPct}%
    </span>
  </div>
  <Progress value={progressPct} className="h-1" />
  {!isPayloadReady && missingRequired.length > 0 && (
    <p className="text-[10px] text-muted-foreground">
      Faltan: {missingRequired.map(k => FIELD_LABEL_ES[k]).join(', ')}
    </p>
  )}
</div>
```

`FIELD_LABEL_ES` es un pequeño mapa local en el archivo (símbolo → "Símbolo", etc.) para no depender de traducciones nuevas.

## 3. Deshabilitar el botón Registrar hasta tener payload completo

En el footer (líneas ~1290-1300):

```tsx
<Button
  type="submit"
  size="sm"
  disabled={
    !isPayloadReady ||
    createTrade.isPending ||
    updateTrade.isPending
  }
  title={!isPayloadReady ? `Faltan: ${missingRequired.join(', ')}` : undefined}
  className="btn-press"
>
  {(createTrade.isPending || updateTrade.isPending) && (
    <Loader2 className="h-4 w-4 animate-spin mr-2" />
  )}
  {editingTrade ? (t.common.save ?? 'Save') : t.journal.registerTrade}
</Button>
```

El `title` da feedback al hover sobre por qué está deshabilitado. El submit por Enter sigue cayendo en `handleAddTrade`, que ya hace validación zod completa (defensa en profundidad).

## 4. Sin cambios en el resto

- `handleAddTrade`, `commitTrade`, `detectPsychologicalErrors` y `TaxometerAlert` permanecen idénticos.
- No se tocan las traducciones globales (`translations.ts`).
- El test existente `Journal.addTrade.test.ts` sigue siendo válido; opcionalmente añadir una assertion de que el botón Registrar está `disabled` al abrir el diálogo vacío.

## Prueba post-cambio

Manual:
1. Abrir "Añadir operación" → el botón **Registrar** aparece deshabilitado y la barra de progreso muestra un % bajo.
2. Completar símbolo, dirección, entry, qty, entry_date, status=open → progreso ≥ 70%, botón habilitado.
3. Cambiar status a closed sin exit_price → botón vuelve a deshabilitarse, mensaje "Faltan: exit_price, exit_date".
4. Completar todo y registrar → flujo normal (con `TaxometerAlert` si falta SL).
