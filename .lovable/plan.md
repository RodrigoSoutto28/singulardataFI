## Problema

En el formulario de Editar/Agregar Operación, el campo **Tamaño del Stop** acepta valores negativos (ej. `-105.20`), lo que dispara el error "el tamaño del stop debe ser mayor a 0" y bloquea el guardado. Además, el formulario muestra un bloque **Riesgo** que reformatea el valor con un signo negativo, lo que confunde y sugiere que el usuario debe escribir un número negativo.

El usuario quiere ingresar Stop y Take Profit manualmente como montos positivos en la moneda de la cuenta, sin ningún cálculo estimado.

## Cambios (solo UI, sin tocar lógica de negocio)

Archivo único: `src/features/journal/Journal.tsx`

1. **Forzar entrada positiva en el input de Tamaño del Stop** (≈línea 1287):
   - Agregar `min="0"` al `<Input type="number">`.
   - En el `onChange`, normalizar: descartar el signo `-` antes de guardar en `formData.stop_size` (`e.target.value.replace('-', '')`).
   - Mismo tratamiento para el campo Take Profit (también debe ser positivo manual).

2. **Eliminar el bloque "Riesgo" estimado** (líneas 1375–1380):
   - Remover el `{hasRisk && (...)}` que muestra `-$105.20 USD`.
   - Mantener el bloque P&L Estimado y el bloque R:R (siguen siendo útiles y no muestran el stop con signo invertido).
   - Ajustar la condición de retorno temprano (`if (!hasPnl && !hasRisk && !hasRR) return null`) para que ya no dependa de `hasRisk`, o dejar `hasRisk` solo para el cálculo interno de R:R.

3. **Mensaje de error** (opcional, mismo archivo): mantener el texto actual; con `min="0"` y la normalización, ya no debería dispararse por signo.

## Fuera de alcance

- No se tocan: validación zod, hook `useTrades`, base de datos, importadores, exportadores, traducciones, tests.
- No se cambia la lógica de guardado ni el cálculo de P&L ni R:R.

## Verificación

Abrir Editar Operación → escribir `105.20` en Tamaño del Stop → el campo no acepta negativos, no aparece el bloque "Riesgo -$105.20", y Guardar funciona sin errores de campo.
