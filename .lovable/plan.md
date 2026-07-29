## Problema detectado

En `src/features/journal/Journal.tsx` (función de guardado) el P&L se calcula automáticamente como:

```text
pnl = (salida - entrada) * cantidad     (long)
pnl = (entrada - salida) * cantidad     (short)
```

Esa fórmula sólo es válida para acciones/cripto en unidades; para forex, índices, futuros o CFDs (donde importa el valor del punto/lote) el resultado es incorrecto. Además, el formulario **no tiene campos visibles de P&L**: `pnl` y `pnl_percentage` existen en el estado pero nunca se muestran, así que el usuario no puede corregir el número calculado.

También, al **agregar** una operación no hay forma de adjuntar imagen: la carga de capturas sólo existe en `TradeScreenshotModal`, que se abre desde la lista una vez que el trade ya está guardado.

## Cambios propuestos

### 1. Eliminar el cálculo automático de P&L
- Quitar del guardado el bloque que deriva `pnl` y `pnl_percentage` a partir de entrada/salida/cantidad.
- El valor guardado será exactamente el que el usuario escriba (o `null` si lo deja vacío).

### 2. Campos manuales de resultado en el formulario
- Nuevo bloque "Resultado de la operación", visible cuando el estado es **Cerrada**:
  - **P&L (moneda de la cuenta)**: numérico, admite negativos (pérdida) y positivos (ganancia), con el símbolo de moneda como prefijo, igual que el campo "Tamaño del Stop".
  - **P&L %**: numérico opcional, también manual.
- Coloreado en vivo: verde si es positivo, rojo si es negativo.
- Texto de ayuda: "Ingresá la ganancia o pérdida real de la operación (negativo = pérdida)".
- Al cambiar el estado a **Abierta**, ambos campos se limpian y se deshabilitan.
- Al editar una operación existente, los campos se precargan con el valor guardado.
- Requisito para cerrar: el P&L pasa a ser obligatorio en operaciones cerradas (se suma a la barra de progreso y a la validación con mensaje inline).

### 3. Vista previa de imagen al agregar la operación
- En el diálogo de alta se agrega una sección "Captura / Imagen" con botón de selección de archivo.
- Al seleccionar, se muestra **miniatura de vista previa inmediata** (object URL), con nombre de archivo, tamaño y botón para quitarla; clic en la miniatura para ampliarla.
- Validación: sólo `jpg/jpeg/png/webp/gif` y límite de tamaño, misma lista permitida que ya usa el modal de capturas.
- La imagen se sube **después** de guardar la operación (se necesita el `trade_id`), reutilizando `useTradeScreenshots.uploadScreenshot`. Si la subida falla, la operación queda igualmente guardada y se avisa con un toast.
- Al editar una operación se mantiene el modal actual de capturas; la sección nueva del formulario permite añadir una imagen más.

### 4. Traducciones
- Nuevas claves i18n (EN/ES/PT) en `src/shared/lib/i18n/translations.ts` para las etiquetas, ayudas y errores anteriores. Sin textos hardcodeados.

### Detalles técnicos
- Archivos: `src/features/journal/Journal.tsx`, `src/shared/lib/validation.ts` (esquema del formulario: `pnl` numérico finito requerido si `status === 'closed'`, `pnl_percentage` opcional), `src/shared/lib/i18n/translations.ts`.
- Sin cambios de base de datos: las columnas `pnl` y `pnl_percentage` ya existen en `trades`.
- El balance de la cuenta sigue sincronizándose desde `useTrades` con el P&L guardado, ahora con el valor manual.
- Se actualizan los tests afectados (`Journal.addTradeFlow.test.tsx`, `Journal.addTrade.test.ts`) para el flujo cerrado con P&L manual, y se verifica typecheck + suite de tests.
