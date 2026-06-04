## Cambio

Transformar el modal actual de "Agregar Operación" (un único formulario largo en `src/features/journal/Journal.tsx`) en un **wizard guiado de 2 pasos**, sin modificar la lógica de guardado, validación, cálculo de P&L/R:R, ni ningún otro componente del proyecto.

## Estructura del wizard

**Paso 1/2 — "Detalles de Entrada"**
- Subtítulo: `1/2 Detalles de Entrada`
- Campos visibles:
  - Activo (symbol)
  - Dirección (long / short)
  - Entrada (entry_price)
  - Cantidad (quantity)
- Footer: botón único grande **"Siguiente"** (deshabilitado si faltan campos obligatorios del paso 1). Botón secundario "Cancelar".

**Paso 2/2 — "Gestión y Salida"**
- Subtítulo: `2/2 Gestión y Salida`
- Campos visibles:
  - Stop Loss
  - Take Profit
  - Comisión
  - Estado (open/closed)
  - Salida (exit_price)
  - Fecha de Apertura + Fecha de Cierre
  - Estrategia
  - Notas
  - Preview de P&L / R:R (igual que hoy)
- Footer: **"Anterior"** + **"Registrar Operación"** (submit). En modo edición el texto del botón conserva la traducción de guardar.

## Archivos a tocar

- `src/features/journal/Journal.tsx`
  - Añadir estado local `wizardStep: 1 | 2` dentro del componente.
  - Resetear `wizardStep` a `1` cuando se abre/cierra el dialog y cuando se entra a modo edición.
  - Reorganizar el JSX dentro de `<form>` en dos bloques renderizados condicionalmente según `wizardStep`.
  - Añadir indicador de paso (subtítulo `1/2` o `2/2`) en el `DialogHeader` o como subtítulo encima del contenido.
  - Footer dinámico:
    - Paso 1 → "Cancelar" + "Siguiente" (`type="button"`, valida solo symbol/direction/entry_price/quantity antes de avanzar; si falla, marca errores con la misma lógica de `formErrors` ya existente).
    - Paso 2 → "Anterior" + "Registrar Operación" (`type="submit"`, mantiene `handleAddTrade` actual).
  - No tocar `handleAddTrade`, `formData`, `tradeFormSchema`, hooks ni nada de negocio.

- `src/shared/lib/i18n/translations.ts`
  - Añadir claves nuevas dentro de `journal` (ES/EN/PT):
    - `wizardStep1Title` → "Detalles de Entrada" / "Entry Details" / "Detalhes de Entrada"
    - `wizardStep2Title` → "Gestión y Salida" / "Management & Exit" / "Gestão e Saída"
    - `wizardStep1Subtitle` → "1/2 Detalles de Entrada" / ...
    - `wizardStep2Subtitle` → "2/2 Gestión y Salida" / ...
    - `next` → "Siguiente" / "Next" / "Próximo"
    - `previous` → "Anterior" / "Previous" / "Anterior"
    - `registerTrade` → "Registrar Operación" / "Register Trade" / "Registrar Operação"
  - Usarlas en `Journal.tsx` (sin strings hardcodeados).

## Validación

- Abrir el modal: se muestra solo el Paso 1 con Activo, Dirección, Entrada, Cantidad.
- Click en "Siguiente" sin completar: marca errores y no avanza.
- "Siguiente" con datos válidos → muestra el Paso 2 con SL, TP, Comisión, Estado, Salida, Fechas, Estrategia, Notas, preview P&L/R:R.
- "Anterior" vuelve al Paso 1 conservando lo ingresado.
- "Registrar Operación" guarda igual que antes (createTrade/updateTrade).
- Modo edición abre directamente en Paso 1 también.
- Idiomas EN/PT muestran las nuevas etiquetas traducidas.

## Fuera de alcance

- No se cambia ningún otro componente, página, estilo global, lógica de Supabase, importación CSV, ni la tabla de operaciones.
