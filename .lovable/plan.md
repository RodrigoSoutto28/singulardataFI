## Soporte multi-cuenta de trading por usuario

El schema ya soporta varias cuentas por usuario (`trading_accounts.user_id`, `trades.account_id` FK). Falta UI + lógica para gestionarlas y conmutarlas. No requiere migración.

### 1. Hook nuevo `useTradingAccounts` (plural)
`src/features/dashboard/hooks/useTradingAccounts.ts`
- Lista todas las cuentas activas del usuario (`ORDER BY created_at`).
- Maneja `selectedAccountId` persistido en `localStorage` (`sdf:selected_account_id`).
- Auto-selecciona la primera al cargar si no hay selección guardada o si la guardada ya no existe.
- Expone: `accounts`, `selectedAccount`, `selectedAccountId`, `setSelectedAccountId`, `isLoading`.

### 2. Refactor `useTradingAccount` (singular, mantener API)
- Internamente consume `useTradingAccounts` y devuelve `selectedAccount` como `account`.
- Mantener `createAccount`, `updateAccount`, `updateBalance`, `updateInitialBalance` con la misma firma.
- `createAccount` invalida `['trading_accounts', userId]` y opcionalmente auto-selecciona la nueva.
- No cambia ningún consumidor existente.

### 3. Filtrar trades por cuenta seleccionada
`src/features/journal/hooks/useTrades.ts`
- Añadir filtro `.eq('account_id', selectedAccountId)` cuando exista; si es null, fallback a todas (compat con trades antiguos sin account_id).
- `queryKey: ['trades', user?.id, selectedAccountId]`.
- `createTrade` e `importTrades` adjuntan `account_id: selectedAccountId` automáticamente.
- `syncAccountBalance` calcula P&L sólo de la cuenta activa (filtra por `account_id`) y actualiza esa cuenta.

### 4. Selector de cuenta en el TopBar
`src/shared/components/layout/TopBar.tsx`
- Nuevo componente `AccountSwitcher` (dropdown con `DropdownMenu` shadcn) ubicado a la izquierda del toggle de tema.
- Muestra: nombre cuenta + broker en chip pequeño con icono `Wallet`.
- Items: lista de cuentas (marca la activa con check), separador, "➕ Agregar cuenta" (abre `AccountSetupModal` en modo "create new").
- En móvil: sólo icono Wallet con badge del nombre truncado.

### 5. `AccountSetupModal` — modo crear-nuevo
`src/features/dashboard/components/AccountSetupModal.tsx`
- Añadir prop opcional `mode?: 'auto' | 'create'` (default `'auto'`).
- En `'create'` ignora `account` existente y siempre llama `createAccount` (permite añadir cuentas adicionales sin editar la activa).
- Tras crear, auto-selecciona la nueva cuenta.

### 6. Dashboard
`src/features/dashboard/Dashboard.tsx`
- Sin cambios funcionales relevantes; sigue usando `useTradingAccount()` que ahora devuelve la cuenta seleccionada.
- El subtítulo del hero puede incluir el nombre de la cuenta activa (`"{cuenta} · {broker}"`) — opcional, micro-añadido.

### 7. i18n
`src/shared/lib/i18n/translations.ts`
- Nuevas claves en `dashboard`: `accounts`, `switchAccount`, `addAccount`, `activeAccount` (EN/ES/PT).

### Notas técnicas
- Sin migración SQL: la columna `trades.account_id` y RLS por `user_id` ya existen.
- Backward-compat: trades existentes sin `account_id` siguen visibles porque el filtro sólo se aplica cuando hay `selectedAccountId` Y al menos una cuenta. Para evitar "desaparición" de trades viejos, en una pasada inicial backfill opcional vía `supabase--insert` que asigne `account_id = primera_cuenta` a trades del usuario donde sea null — lo proponemos pero **sólo si confirmas**.
- Sin cambios en `AnalyticsHub`/`Psychology`: leen de `useTrades` que ya estará filtrado por cuenta.

### Archivos tocados
- nuevo: `src/features/dashboard/hooks/useTradingAccounts.ts`
- nuevo: `src/shared/components/layout/AccountSwitcher.tsx`
- editado: `src/features/dashboard/hooks/useTradingAccount.ts`
- editado: `src/features/journal/hooks/useTrades.ts`
- editado: `src/features/dashboard/components/AccountSetupModal.tsx`
- editado: `src/shared/components/layout/TopBar.tsx`
- editado: `src/features/dashboard/Dashboard.tsx` (mínimo)
- editado: `src/shared/lib/i18n/translations.ts`

### Pregunta abierta
¿Quieres el backfill automático de trades antiguos (asignarlos a tu primera cuenta) o prefieres dejarlos sin asignar y que sigan apareciendo en todas las vistas?
