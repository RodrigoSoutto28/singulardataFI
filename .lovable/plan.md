## Cambio

Renombrar el texto visible del botón del selector de cuentas (esquina superior derecha, con icono de billetera) de modo que siempre muestre **"Centro de cuentas"** en lugar del nombre dinámico de la cuenta seleccionada (actualmente "Soporte Singular", que es el nombre del registro activo).

## Archivos a tocar

- `src/shared/components/layout/AccountSwitcher.tsx`
  - Reemplazar el `label` dinámico (`selectedAccount?.name ?? t.dashboard.accountSetup`) por una etiqueta fija "Centro de cuentas".
  - Quitar la línea secundaria del broker en el trigger (ya que la etiqueta ahora es genérica).
  - El nombre de la cuenta seleccionada y su broker se siguen viendo dentro del dropdown (lista de cuentas), sin cambios.
  - `aria-label` del trigger pasa a "Centro de cuentas".

- `src/shared/lib/i18n/translations.ts`
  - Agregar clave `topbar.accountsCenter` (o equivalente) con:
    - ES: "Centro de cuentas"
    - EN: "Accounts Center"
    - PT: "Central de contas"
  - Usarla desde `AccountSwitcher` para respetar la regla de no-strings hardcodeadas.

## Notas

- No se modifica la lógica de selección, edición, eliminación ni el modal de alta de cuentas.
- No se cambian estilos, tamaños ni el icono.
- No se toca el sidebar ni otros textos del proyecto.

## Validación

- Verificar visualmente que el botón ahora dice "Centro de cuentas" sin importar qué cuenta esté activa.
- Confirmar que el dropdown sigue listando todas las cuentas con su nombre y broker.
- Cambiar el idioma a EN y PT para confirmar que la etiqueta se traduce.