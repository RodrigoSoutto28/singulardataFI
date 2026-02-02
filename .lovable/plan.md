
# Plan: Sistema de Datos Reales y Funcionalidades Completas

## Resumen
Este plan implementa un sistema de datos real desde cero (balance 0, sin operaciones, sin entradas psicológicas), verifica y mejora la importación de archivos, y añade las funciones necesarias para que cada pestaña esté completamente funcional.

---

## 1. Verificación y Mejora del Sistema de Importación

### Estado Actual
El hook `useImportTrades.ts` ya soporta:
- **CSV**: Parsing línea por línea con mapeo de columnas
- **Excel (.xlsx/.xls)**: Usando biblioteca `xlsx`

### Mejoras Necesarias

#### Archivo: `src/hooks/useImportTrades.ts`
- Agregar soporte para más formatos de columnas comunes de brokers
- Mejorar detección automática de formato de fecha
- Agregar validación de datos más robusta
- Retornar asset_class inferido del símbolo

#### Archivo: `src/pages/Journal.tsx`
- Conectar importación directamente a la base de datos
- Mostrar preview de datos antes de importar
- Agregar barra de progreso durante importación

---

## 2. Sistema de Estado Inicial en Cero

### Archivos a Modificar

#### `src/pages/Dashboard.tsx`
Cambios:
- Eliminar `mockEquityData` - usar array vacío como estado inicial
- Conectar a base de datos para obtener datos reales del usuario
- Mostrar valores en 0 cuando no hay datos:
  - Balance: $0.00
  - P&L: $0.00
  - Win Rate: 0%
  - Total Trades: 0
  - Curva de equidad: vacía con mensaje

#### `src/pages/Journal.tsx`
Cambios:
- Eliminar `mockTrades` completamente
- Cargar trades desde la tabla `trades` de la base de datos
- Mostrar estado vacío con call-to-action para importar o agregar primera operación

#### `src/pages/Psychology.tsx`
Cambios:
- Eliminar `mockEntries`
- Cargar entradas desde tabla `psychology_entries`
- Mostrar formulario de primera entrada cuando está vacío
- Stats en 0 por defecto

#### `src/pages/Analytics.tsx`
Cambios:
- Eliminar todos los mock data (`monthlyPnlData`, `winLossData`, `assetDistribution`, etc.)
- Calcular métricas dinámicamente desde datos reales
- Mostrar gráficos vacíos con mensaje "Sin datos suficientes"

#### `src/pages/Insights.tsx`
Cambios:
- Eliminar `mockInsightsData`
- Mostrar mensaje "Comienza a registrar operaciones para recibir insights"
- Cargar insights reales desde tabla `ai_insights`

#### `src/pages/Reports.tsx`
Cambios:
- Eliminar `currentReport` y `previousReports` mock
- Generar reportes dinámicamente desde datos reales
- Mostrar estado vacío cuando no hay datos

---

## 3. Hooks de Datos para Base de Datos

### Nuevos Archivos a Crear

#### `src/hooks/useTrades.ts`
```text
Hook para gestionar operaciones de trading:
- fetchTrades(): Obtener todas las operaciones del usuario
- createTrade(trade): Crear nueva operación
- updateTrade(id, updates): Actualizar operación
- deleteTrade(id): Eliminar operación
- importTrades(trades[]): Importar múltiples operaciones
```

#### `src/hooks/usePsychologyEntries.ts`
```text
Hook para gestionar entradas psicológicas:
- fetchEntries(): Obtener entradas del usuario
- createEntry(entry): Crear nueva entrada
- updateEntry(id, updates): Actualizar entrada
- deleteEntry(id): Eliminar entrada
```

#### `src/hooks/useAnalytics.ts`
```text
Hook para cálculos de analítica:
- calculateStats(trades): Calcular métricas
- getEquityCurve(trades): Generar curva de equidad
- getPerformanceByDay(trades): Rendimiento por día
- getPerformanceByHour(trades): Rendimiento por hora
- getAssetDistribution(trades): Distribución por activo
```

#### `src/hooks/useTradingAccount.ts`
```text
Hook para gestionar cuenta de trading:
- fetchAccount(): Obtener cuenta activa
- createAccount(account): Crear cuenta
- updateBalance(accountId, balance): Actualizar balance
```

---

## 4. Funcionalidades por Pestaña

### Dashboard
| Función | Estado | Acción |
|---------|--------|--------|
| Balance cuenta | Mock | Conectar a `trading_accounts` |
| P&L | Mock | Calcular desde `trades` |
| Win Rate | Mock | Calcular desde `trades` |
| Curva equidad | Mock | Generar desde `trades` |
| Tareas | Local | Ya funcional |
| Estado mental | Mock | Conectar a última entrada de `psychology_entries` |

### Journal
| Función | Estado | Acción |
|---------|--------|--------|
| Listar trades | Mock | Fetch desde `trades` |
| Agregar trade | UI only | INSERT a `trades` |
| Editar trade | UI only | UPDATE a `trades` |
| Eliminar trade | UI only | DELETE de `trades` |
| Importar | Parcial | Guardar en `trades` |
| Exportar | ✓ Funcional | Mantener |

### Psychology
| Función | Estado | Acción |
|---------|--------|--------|
| Listar entradas | Mock | Fetch desde `psychology_entries` |
| Nueva entrada | UI only | INSERT a `psychology_entries` |
| Stats promedio | Mock | Calcular dinámicamente |

### Analytics
| Función | Estado | Acción |
|---------|--------|--------|
| Métricas | Mock | Calcular desde `trades` |
| Gráficos | Mock | Generar desde `trades` |
| Filtros tiempo | UI only | Aplicar filtros a queries |

### Insights
| Función | Estado | Acción |
|---------|--------|--------|
| Listar insights | Mock | Fetch desde `ai_insights` |
| Actualizar análisis | UI only | Trigger función de análisis |

### Reports
| Función | Estado | Acción |
|---------|--------|--------|
| Generar reporte | Mock | Crear desde datos reales |
| Exportar PDF | ✓ Funcional | Usar datos reales |
| Historial | Mock | Guardar reportes generados |

---

## 5. Flujo de Datos

```text
Usuario nuevo registra
         │
         ▼
┌─────────────────────────────┐
│  Estado inicial (todo en 0) │
│  - Balance: $0.00           │
│  - Trades: 0                │
│  - Entries: 0               │
│  - Insights: vacío          │
└──────────────┬──────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
Importar archivo    Agregar manualmente
    │                     │
    └──────────┬──────────┘
               │
               ▼
┌─────────────────────────────┐
│   Guardar en base de datos  │
│   tabla: trades             │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Actualizar UI en tiempo    │
│  real con nuevos datos      │
└─────────────────────────────┘
```

---

## Sección Técnica

### Archivos a Crear
1. `src/hooks/useTrades.ts` - CRUD de operaciones
2. `src/hooks/usePsychologyEntries.ts` - CRUD de psicología
3. `src/hooks/useAnalytics.ts` - Cálculos estadísticos
4. `src/hooks/useTradingAccount.ts` - Gestión de cuenta

### Archivos a Modificar
1. `src/pages/Dashboard.tsx` - Conectar a datos reales
2. `src/pages/Journal.tsx` - CRUD completo + importación a BD
3. `src/pages/Psychology.tsx` - CRUD completo
4. `src/pages/Analytics.tsx` - Métricas dinámicas
5. `src/pages/Insights.tsx` - Datos reales
6. `src/pages/Reports.tsx` - Generación dinámica
7. `src/hooks/useImportTrades.ts` - Mejorar parsing

### Dependencias
No se requieren nuevas dependencias. Se usa:
- `@tanstack/react-query` para gestión de estado servidor
- `@supabase/supabase-js` para conexión a base de datos (ya instalados)

### Queries a Base de Datos

Trades:
```sql
SELECT * FROM trades WHERE user_id = auth.uid() ORDER BY entry_date DESC
```

Psychology:
```sql
SELECT * FROM psychology_entries WHERE user_id = auth.uid() ORDER BY entry_date DESC
```

Account:
```sql
SELECT * FROM trading_accounts WHERE user_id = auth.uid() AND is_active = true LIMIT 1
```

### Consideraciones de Seguridad
- Todas las tablas ya tienen RLS configurado correctamente
- Cada query filtra por `user_id = auth.uid()`
- Los datos de un usuario nunca se mezclan con otros

### Resultado Esperado
- Aplicación inicia con todos los datos en 0
- Usuario puede importar archivos CSV/Excel que se guardan en BD
- Usuario puede agregar operaciones manualmente
- Todas las métricas se calculan dinámicamente
- Dashboard, Analytics y Reports reflejan datos reales
- Sistema listo para producción
