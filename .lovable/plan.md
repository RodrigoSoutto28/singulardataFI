## Editar y eliminar cuentas desde el AccountSwitcher

### Cambios

**1. `src/shared/components/layout/AccountSwitcher.tsx`**
- En cada item de cuenta del dropdown, añadir dos acciones inline a la derecha (visibles en hover/siempre en móvil):
  - ✏️ Editar (icono `Pencil`) → abre `AccountSetupModal` en modo `edit` con la cuenta seleccionada.
  - 🗑 Eliminar (icono `Trash2`) → abre un `AlertDialog` de confirmación; al confirmar llama `deactivateAccount(id)`.
- Si la cuenta eliminada era la activa, auto-seleccionar la primera restante (ya cubierto por `useTradingAccounts`).
- Bloquear eliminación si sólo queda 1 cuenta (mostrar item deshabilitado con tooltip "Debe existir al menos una cuenta").

**2. `src/features/dashboard/components/AccountSetupModal.tsx`**
- Añadir nueva prop opcional `editingAccount?: TradingAccount | null`.
- Nuevo `mode`: `'edit-specific'` que edita la cuenta pasada en `editingAccount` en vez de la activa.
- Mantiene `'auto'` y `'create'` sin cambios.

**3. Eliminación lógica (no física)**
- Usar `deactivateAccount` existente en `useTradingAccounts` (marca `is_active = false`).
- Ventajas: preserva trades históricos vinculados (`trades.account_id` FK queda intacto) y permite restaurar si fuera necesario.
- No se borran trades — siguen accesibles si el usuario reactiva o consulta histórico.

### Archivos tocados
- editado: `src/shared/components/layout/AccountSwitcher.tsx`
- editado: `src/features/dashboard/components/AccountSetupModal.tsx`

Sin migraciones, sin cambios de schema.
