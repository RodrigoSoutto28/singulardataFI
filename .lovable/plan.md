## Sistema de Check-in Pre-Mercado Obligatorio

Modal bloqueante de 4 pasos que se muestra cada día al entrar a la app y obliga al trader a definir su plan (setups válidos, riesgo, estado emocional, metas) antes de acceder al Dashboard. Los datos se persisten en una nueva tabla y se invalida al día siguiente.

### Cambios en la base de datos

Nueva tabla `pre_market_checkins` con un check-in único por usuario y por día:

```text
pre_market_checkins
├── id              uuid PK
├── user_id         uuid (auth.uid)
├── checkin_date    date  (DEFAULT CURRENT_DATE)
├── allowed_setups  text[]                — setups válidos del día
├── max_risk_per_trade   numeric(4,2)    — % riesgo
├── max_daily_trades     int             — tope de operaciones
├── emotional_state text                  — confident|calm|neutral|anxious|fearful
├── goals_today     text                  — opcional
├── created_at      timestamptz
└── UNIQUE (user_id, checkin_date)
```

- RLS habilitado.
- Políticas: SELECT/INSERT/UPDATE/DELETE solo cuando `auth.uid() = user_id`.

### Archivos nuevos

1. **`src/lib/checkin-helpers.ts`**
   - Tipo `PreMarketCheckInData`.
   - Constantes `SETUPS` y `EMOTIONS` (con emojis y colores semánticos del design system, sin colores hardcoded como `bg-green-100`).
   - Helper `getTodayDateString()`.

2. **`src/hooks/usePreMarketCheckIn.ts`**
   - `useQuery` por `['pre-market-checkin', userId, today]` que busca el registro del día.
   - `useMutation` `saveCheckIn` que inserta en `pre_market_checkins` y refresca caché.
   - Devuelve `{ todayCheckIn, hasCheckedInToday, isLoading, saveCheckIn, isSaving }`.

3. **`src/components/psychology/PreMarketCheckInModal.tsx`**
   - `<Dialog>` no cerrable: `onPointerDownOutside` y `onEscapeKeyDown` con `e.preventDefault()`, sin botón X (`hideClose` o sobreescribir contenido).
   - Header con `Brain` icon + barra de progreso (`Paso X de 4` + Progress).
   - **Paso 1 — Setups válidos**: grid de tarjetas seleccionables (multi). Bloquea avance si vacío.
   - **Paso 2 — Riesgo**: Slider 0.5-5% (default 1%) con badge `destructive` cuando >2% y alerta. Selector de máx trades (1-6).
   - **Paso 3 — Estado emocional**: 5 opciones; alerta si `anxious|fearful` (corrige el bug de precedencia del snippet original usando paréntesis).
   - **Paso 4 — Metas + Resumen**: textarea (max 300) + tarjeta resumen con setups/riesgo/trades/estado, botón "Comprometerme" llama `saveCheckIn` y luego `onComplete()`.
   - Toast de éxito al guardar.

### Integración en `src/App.tsx`

Crear un componente interno `PreMarketGate` que envuelve el `<AppLayout />` dentro de `ProtectedRoute`:

- Llama `usePreMarketCheckIn()`.
- Mientras `isLoading` → no renderiza nada (evita parpadeo).
- Si `!hasCheckedInToday` → muestra solo el `<PreMarketCheckInModal open onComplete={…} />` encima del layout (el modal bloqueante impide interacción con la UI debajo).
- Tras completar, la query se invalida → el modal desaparece automáticamente.

Esto mantiene el `<Outlet />` y todas las rutas hijas intactos.

### Detalles técnicos / correcciones al snippet original

- **Tokens del design system**: reemplazar `bg-green-100`, `bg-red-100`, etc. por tokens HSL del proyecto (`bg-success/10`, `bg-destructive/10`, `bg-warning/10`, `bg-muted`).
- **Bug lógico** `emotionalState === 'anxious' || emotionalState === 'fearful' && (...)` se corrige envolviendo en paréntesis.
- **Auth**: usar `useAuth` desde `@/contexts/AuthContext` (no `./useAuth`).
- **Tipos TS**: `selectedSetups: string[]`, evitar `any`.
- i18n: por simplicidad inicial los textos quedan en español hardcoded (consistente con el snippet del usuario); se puede migrar a `LanguageContext` luego.
- El modal **no se puede saltar** desde rutas autenticadas; rutas públicas (`/auth`, `/terms`, `/privacy`) no se ven afectadas porque `PreMarketGate` solo aplica dentro de `ProtectedRoute`.

### Flujo del usuario

```text
Login → ProtectedRoute → PreMarketGate
                           │
                  ┌────────┴────────┐
       hasCheckedInToday?         no → Modal bloqueante (4 pasos)
                  │ yes                        │
                  ▼                            ▼ commit
              Dashboard                  invalidate query → Dashboard
```
