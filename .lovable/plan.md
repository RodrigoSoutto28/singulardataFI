## Problema

En `src/features/journal/Journal.tsx`, el alta de una nueva operación usa un **wizard de 2 pasos**:

- **Paso 1**: símbolo, dirección, precio de entrada, cantidad.
- **Paso 2**: estado, fechas, exit price, **stop loss**, take profit, comisión, estrategia, notas.

Esto provoca dos problemas:

1. La detección psicológica (`detectPsychologicalErrors`) corre en el submit del Paso 2 y dispara la alerta "Sin Stop Loss" aunque el usuario aún esté completando datos, porque el SL vive en el Paso 2 y se evalúa antes de que el usuario tenga claro qué campos son obligatorios vs. opcionales.
2. La UX del wizard hace sentir que "la app detecta falta de stop antes de terminar de cargar los datos".

## Cambios (solo `src/features/journal/Journal.tsx`)

### 1. Unificar a un único paso
- Eliminar el estado `wizardStep` y los botones "Siguiente / Anterior".
- Renderizar todos los campos del Paso 1 + Paso 2 en un **único formulario scrollable** dentro del `Dialog` existente.
- Mantener el orden lógico: Identificación (símbolo, dirección) → Precios y cantidad (entry, exit, qty) → Estado y fechas → Gestión de riesgo (SL, TP, comisión) → Estrategia y notas → Preview P&L/RR.
- Marcar visualmente como opcionales: `stop_loss`, `take_profit`, `exit_price`, `exit_date` (cuando estado = open), comisión, estrategia, notas.
- Botones del footer: **Cancelar** (izq) y **Registrar operación / Guardar** (der). Eliminar lógica `wizardStep !== 2` del guard en `handleAddTrade`.

### 2. Corregir la detección prematura
- En `handleAddTrade`, mantener `detectPsychologicalErrors`, pero asegurar que se invoca **solo** tras la validación zod exitosa (ya ocurre) y con el payload **completo** del formulario unificado. Sin wizard, ya no hay riesgo de evaluar con datos parciales.
- Conservar el flujo actual: si hay errores de alta confianza y no se está editando, abrir el `TaxometerAlert` (`setTaxometerOpen(true)`) con `pendingPayload`/`pendingErrors` para confirmación explícita del usuario.
- En el reset del Dialog (`onOpenChange` cuando `!open`), eliminar la línea `setWizardStep(1)` y demás referencias.

### 3. Limpieza
- Eliminar las traducciones de wizard ya no usadas en este archivo: `wizardStep1Title`, `wizardStep1Subtitle`, `wizardStep2Title`, `wizardStep2Subtitle`, `next`, `previous` (solo el consumo aquí; las claves se dejan en `translations.ts` por si se usan en otro lado).
- Conservar la lógica de auto-cálculo de P&L y R:R (bloque 1229-1271) tal cual.

## Prueba post-cambio

Agregar un test ligero `src/features/journal/__tests__/Journal.addTrade.test.tsx` que monte el `Journal` con un wrapper mínimo (mocks de `useAuth`, `useTrades`, `usePreMarketCheckIn`, `useErrorLog`) y verifique:

1. Click en "Añadir operación" abre el diálogo y muestra **todos los campos en una sola pantalla** (assert: `stop_loss` y `entry_price` son visibles simultáneamente).
2. Rellenar símbolo, dirección, entry, qty, **estado=open**, SL con valor → click "Registrar" → se llama a `createTrade.mutateAsync` con `stop_loss` correcto y **no** se abre `TaxometerAlert`.
3. Rellenar lo mínimo sin SL → click "Registrar" → se abre `TaxometerAlert` (confirmación esperada) y `createTrade` aún no se llama hasta confirmar.

Ejecutar con `bunx vitest run src/features/journal/__tests__/Journal.addTrade.test.tsx`.

## Fuera de alcance

- Sin cambios en `useTrades`, `error-detection.ts`, `validation.ts`, parser de imports, ni en el `TaxometerAlert`.
- Sin cambios de schema en la BD.
