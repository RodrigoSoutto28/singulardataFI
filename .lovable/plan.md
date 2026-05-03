## Objetivo
Resolver los 2 bloqueantes legales para poder comercializar SINGULAR dataFI.

## Cambios

### 1. Borrado de cuenta completo (privacidad/GDPR)
**Nueva Edge Function:** `supabase/functions/delete-account/index.ts`
- Verifica el JWT del usuario llamante (`getClaims`).
- Con `service_role` borra todas las filas del usuario en: `trades`, `psychology_entries`, `trading_accounts`, `pre_market_checkins`, `process_validations`, `user_streaks`, `psychological_errors`, `ai_insights`, `analytics_snapshots`, `trade_screenshots`, `trading_rules`, `study_progress`, `user_roles`, `profiles`.
- Llama a `auth.admin.deleteUser(userId)` para eliminar el registro en `auth.users` (impide re-login).

**Actualizar `src/pages/Settings.tsx → handleDeleteAccount`:**
- Reemplazar los 4 deletes directos por `supabase.functions.invoke('delete-account')`.
- Mantener toast + `signOut()` al éxito.

### 2. Quitar métricas falsas en `/auth`
**`src/pages/Auth.tsx` (líneas 230–234):** eliminar el bloque "10K+ Active traders / 2M+ Trades analyzed / 94% Satisfaction" que está hardcoded. Dejar el resto del hero intacto. Cuando tengas métricas reales, las reincorporamos.

## Fuera de alcance (para próximas iteraciones)
- Limpieza de `any` en ESLint (#4 del informe).
- Warnings SECURITY DEFINER (#5) — requiere revisar `is_admin`/`has_role` con cuidado.
- Tests unitarios para fórmulas P&L (#3).
- Activar HIBP password check.

## Verificación post-cambio
1. Deploy de la edge function (automático).
2. Probar borrado de cuenta con un usuario de prueba: confirmar que `auth.users` ya no tiene la fila y que no se puede re-loguear.
3. Confirmar que la página `/auth` ya no muestra las estadísticas hardcoded.
