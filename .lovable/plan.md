## Cambio solicitado

Revertir la restricción de positivos en los campos manuales:
- **Tamaño del Stop**: el usuario puede ingresarlo como **valor negativo** (representa la pérdida si la operación falla).
- **Take Profit**: el usuario lo ingresa como **valor positivo** (resultado de la operación ganadora).

Ambos son montos manuales en la moneda de la cuenta. No hay cálculo automático.

## Cambios

Archivo: `src/features/journal/Journal.tsx`
1. Quitar `min="0"` y la normalización `.replace('-', '')` del input de **stop_size** → permitir negativos.
2. Quitar `min="0"` y la normalización del input de **take_profit** (mantenerlo libre; el usuario escribirá positivo).
3. Ajustar la validación inline `recommendedChecks` (línea 221): cambiar `parseFloat(formData.stop_size) > 0` por `!isNaN(parseFloat(formData.stop_size)) && parseFloat(formData.stop_size) !== 0` para aceptar negativos como "stop definido".
4. Ajustar el cálculo de R:R (línea ~1349-1360): usar `Math.abs(stopSize)` para el denominador, de modo que el R:R siga siendo positivo cuando el stop es negativo.

Archivo: `src/shared/lib/validation.ts`
5. Cambiar el schema de `stop_size` de `.positive()` a `.refine(v => v !== 0)` (cualquier número distinto de cero), o simplemente quitar la restricción de positivo.

Archivo: `src/features/journal/utils/error-detection.ts`
6. Ajustar línea 105: considerar stop definido si `Math.abs(stop_size) > 0` en lugar de `> 0`.

## Fuera de alcance

- DB, importadores, exportadores, traducciones, tests.

## Verificación

Editar Operación → escribir `-105.20` en Tamaño del Stop y `4354.61` en Take Profit → guardar sin errores; R:R se calcula con magnitud absoluta del stop.
