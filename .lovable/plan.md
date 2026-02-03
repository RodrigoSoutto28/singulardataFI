
# Plan: Verificación de Importación, Estado Cero Inicial y Botón Editar Saldo

## Resumen
Este plan verifica el sistema de importación de archivos, asegura que todos los datos comiencen en cero para nuevos usuarios, agrega un botón para editar el saldo inicial de la cuenta, y completa las funcionalidades necesarias para que la aplicación esté lista para uso en producción.

---

## 1. Verificación del Sistema de Importación

### Estado Actual
El hook `useImportTrades.ts` ya está implementado con las siguientes capacidades:
- Soporte para archivos **CSV** (con detección automática de delimitadores: coma, punto y coma, tab)
- Soporte para archivos **Excel** (.xlsx, .xls) usando la biblioteca `xlsx`
- Mapeo de columnas extensivo (30+ variaciones de nombres en inglés y español)
- Detección automática de asset class (forex, crypto, stocks, futures, options, commodities)
- Parsing de fechas en múltiples formatos (ISO, DD/MM/YYYY, Excel serial date)
- Parsing de números con símbolos de moneda

### Mejoras Necesarias

#### Archivo: `src/hooks/useImportTrades.ts`
- Agregar soporte para el campo `asset_class` en la tabla trades
- Mejorar la inferencia de dirección cuando no está especificada
- Agregar más formatos de brokers populares (MetaTrader, TradingView)

---

## 2. Agregar Botón para Editar Saldo Inicial

### Archivo: `src/pages/Dashboard.tsx`
- Agregar un modal/dialog para configurar la cuenta de trading
- Permitir editar saldo inicial (`initial_balance`)
- Permitir editar saldo actual (`current_balance`)
- Si no existe cuenta, crear una nueva automáticamente

### Archivo: `src/components/dashboard/CapitalCard.tsx`
- Agregar un botón de edición (icono de lápiz) en la card de Balance
- Al hacer clic, abrir el modal de configuración de cuenta

### Archivo: `src/hooks/useTradingAccount.ts`
- Ya tiene la mutación `updateAccount` que sirve para actualizar el balance
- Agregar función `updateInitialBalance` específica

### Flujo de Usuario
```text
Dashboard
    │
    ▼
Tarjeta "Account Balance"
    │
    ├─► Click en icono de edición
    │
    ▼
Modal "Configurar Cuenta"
    │
    ├─ Input: Nombre de la cuenta
    ├─ Input: Broker (opcional)
    ├─ Input: Saldo inicial *
    ├─ Input: Saldo actual *
    │
    └─► Guardar → Actualizar BD → Refrescar Dashboard
```

---

## 3. Estado Inicial en Cero - Verificación

### Estado Actual
Todos los componentes ya están conectados a datos reales:
- **Dashboard**: Usa `useTrades`, `useTradingAccount`, `usePsychologyEntries`, `useAnalytics`
- **Journal**: Usa `useTrades` para CRUD completo
- **Psychology**: Usa `usePsychologyEntries` para CRUD completo
- **Analytics**: Usa `useAnalytics` que calcula desde trades reales

### Verificación de Estado Cero
- Balance: `account?.current_balance ?? 0` ✓
- Initial Balance: `account?.initial_balance ?? 0` ✓
- Win Rate: Calculado dinámicamente, 0 si no hay trades ✓
- Total Trades: Calculado dinámicamente, 0 si no hay trades ✓
- Equity Curve: Array vacío si no hay trades ✓
- Psychology Stats: Todo en 0 si no hay entradas ✓

---

## 4. Funcionalidades Completas por Pestaña

### Dashboard
| Función | Estado | Mejora |
|---------|--------|--------|
| Balance cuenta | ✓ | Agregar botón editar |
| P&L | ✓ | - |
| Win Rate | ✓ | - |
| Curva equidad | ✓ | - |
| Estado mental | ✓ | - |
| Tareas | ✓ | - |

### Journal
| Función | Estado | Mejora |
|---------|--------|--------|
| Listar trades | ✓ | - |
| Agregar trade | ✓ | - |
| Eliminar trade | ✓ | - |
| Importar | ✓ | Mejorar asset_class |
| Exportar | ✓ | - |
| Editar trade | Parcial | Agregar modal de edición |

### Psychology
| Función | Estado | Notas |
|---------|--------|-------|
| Listar entradas | ✓ | - |
| Nueva entrada | ✓ | - |
| Stats promedio | ✓ | - |

### Analytics
| Función | Estado | Notas |
|---------|--------|-------|
| Todas las métricas | ✓ | Calculadas dinámicamente |

---

## 5. Nuevas Traducciones Necesarias

### Archivo: `src/i18n/translations.ts`
Agregar claves para:
- `dashboard.editBalance` / "Edit Balance" / "Editar Saldo" / "Editar Saldo"
- `dashboard.accountSetup` / "Account Setup" / "Configurar Cuenta" / "Configurar Conta"
- `dashboard.initialBalance` / "Initial Balance" / "Saldo Inicial" / "Saldo Inicial"
- `dashboard.currentBalance` / "Current Balance" / "Saldo Actual" / "Saldo Atual"
- `dashboard.accountName` / "Account Name" / "Nombre de Cuenta" / "Nome da Conta"
- `dashboard.broker` / "Broker" / "Broker" / "Corretora"
- `dashboard.saveAccount` / "Save Account" / "Guardar Cuenta" / "Salvar Conta"
- `dashboard.createAccount` / "Create Account" / "Crear Cuenta" / "Criar Conta"
- `dashboard.noAccountYet` / "No account configured" / "Sin cuenta configurada" / "Sem conta configurada"
- `dashboard.clickToSetup` / "Click to set up" / "Clic para configurar" / "Clique para configurar"

---

## Sección Técnica

### Archivos a Modificar
1. `src/pages/Dashboard.tsx` - Agregar modal de configuración de cuenta
2. `src/components/dashboard/CapitalCard.tsx` - Agregar botón de edición
3. `src/hooks/useTradingAccount.ts` - Agregar función updateInitialBalance
4. `src/hooks/useImportTrades.ts` - Incluir asset_class en import
5. `src/i18n/translations.ts` - Nuevas traducciones

### Nuevo Componente a Crear
`src/components/dashboard/AccountSetupModal.tsx`
- Dialog modal para crear/editar cuenta de trading
- Campos: nombre, broker, saldo inicial, saldo actual
- Validación de campos numéricos
- Llamadas a `createAccount` o `updateAccount` según corresponda

### Lógica del Modal
```text
Usuario abre modal
    │
    ├─► SI no hay cuenta:
    │       - Mostrar formulario de creación
    │       - Botón "Crear Cuenta"
    │       - Llamar a createAccount()
    │
    └─► SI hay cuenta:
            - Mostrar formulario de edición
            - Precargar valores actuales
            - Botón "Guardar Cambios"
            - Llamar a updateAccount()
```

### Estructura del Modal
```text
+------------------------------------------+
|  Configurar Cuenta de Trading            |
+------------------------------------------+
|                                          |
|  Nombre de Cuenta *                      |
|  [______________________]                |
|                                          |
|  Broker (opcional)                       |
|  [______________________]                |
|                                          |
|  Saldo Inicial *                         |
|  [______________________] USD            |
|                                          |
|  Saldo Actual *                          |
|  [______________________] USD            |
|                                          |
|  [Cancelar]          [Guardar Cuenta]    |
+------------------------------------------+
```

### Dependencias
No se requieren nuevas dependencias. Se usan:
- Componentes UI existentes (Dialog, Input, Label, Button)
- Hook `useTradingAccount` existente

### Flujo Completo para Usuario Nuevo
1. Usuario se registra → Perfil creado automáticamente
2. Usuario va al Dashboard → Ve $0.00 en balance
3. Usuario hace clic en "Editar" → Modal de cuenta aparece
4. Usuario ingresa saldo inicial y actual → Crea cuenta
5. Dashboard se actualiza con nuevo balance
6. Usuario puede importar trades o agregar manualmente
7. Métricas se calculan automáticamente

### Resultado Esperado
- Importación de archivos CSV/Excel funcionando correctamente
- Estado inicial en cero para todos los datos
- Botón de edición de saldo en el Dashboard
- Modal para configurar cuenta de trading (crear/editar)
- Todas las pestañas con funcionalidad completa
- Aplicación lista para uso en producción
