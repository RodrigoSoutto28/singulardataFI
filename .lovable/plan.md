## Problema

La "Alerta de Error Psicológico" (TaxometerAlert) aparece superpuesta sobre el modal del wizard de Agregar Operación (Paso 2 "Gestión y Salida" sigue visible detrás). Esto genera confusión visual y rompe el flujo guiado de los 2 pasos.

La detección sí se dispara en el momento correcto (al pulsar "Registrar Operación" en el paso 2), pero el modal del wizard no se cierra antes de mostrar la alerta.

## Cambio

Archivo único: `src/features/journal/Journal.tsx` (función `handleSubmit`, bloque ~líneas 629-635 donde se detectan los `highErrors`).

Cuando se detecten errores de alta confianza tras completar los 2 pasos:

1. Cerrar el modal del wizard primero (`setIsAddTradeOpen(false)`).
2. Volver el wizard al paso 1 para próximos usos (`setWizardStep(1)`).
3. Recién entonces abrir `TaxometerAlert` con los errores detectados (`setTaxometerOpen(true)`).

Adicionalmente, en `handleTaxometerContinue` (cuando el usuario decide continuar pese a la alerta) y en `handleTaxometerCancel`, no es necesario reabrir el wizard — el payload ya está guardado en `pendingPayload` y se persiste con `commitTrade`, igual que hoy.

## Resultado

- Los 2 pasos del wizard se completan sin interrupciones visuales.
- La alerta de "Sin Stop Loss" (u otros errores de alta confianza) aparece limpia, sola, recién después de pulsar "Registrar Operación".
- No se modifica la lógica de detección, ni los textos, ni el componente `TaxometerAlert`.
