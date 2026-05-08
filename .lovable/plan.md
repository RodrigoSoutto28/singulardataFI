## Estado actual

Al inspeccionar el repo, la migración a **feature-based architecture** ya está aplicada en su mayor parte (resultado de los prompts anteriores 01–02):

```
src/
  app/        App.tsx, main.tsx, routes.tsx, providers.tsx, Index/Terms/Privacy/NotFound
  config/     supabase.ts, queryClient.ts, constants.ts, lovable.ts
  features/   auth, dashboard, journal, analytics, behavioral, settings, study
  shared/     components/{ui,layout,feedback,effects}, hooks/, lib/, types/
  styles/     index.css, App.css
  integrations/supabase/  (auto-generado, no tocar)
```

- `index.html` ya apunta a `/src/app/main.tsx`.
- No quedan imports legacy (`@/lib/...`, `@/components/...`, `@/contexts/...`, `@/pages/...`, `@/types/...`) en `src/` ni en `supabase/`.
- Alias `@/` configurado en `vite.config.ts` y ambos `tsconfig`.
- Barrels (`index.ts`) presentes en cada feature.

## Gaps menores a cerrar en este prompt

1. **Barrels incompletos** — algunas features no exponen sus `components/` o `utils/`. Ampliar barrels para que el resto del código pueda importar desde `@/features/<feature>` sin paths profundos:
   - `journal/index.ts` → exportar `components/ImportPreviewModal`, `components/ProcessValidatorModal`, `utils/brokerParsers`, `utils/error-detection`, `utils/xlsx-adapter`, `hooks/useProcessValidation`.
   - `behavioral/index.ts` → exportar `components/PreMarketCheckInModal`, `PreMarketGate`, `TaxometerAlert`, `TaxometerDashboard`, `TaxometerWidget`, `utils/*`.
   - `dashboard/index.ts` → exportar `components/*` y `utils/ai-messages`, `utils/sampleData`.
   - `auth/index.ts` → exportar `components/ProtectedRoute`, `AdminRoute`, `onboarding/*`.
   - `settings/index.ts` → exportar `components/AvatarUploader`.
   - `analytics/index.ts` → exportar `Insights` (ya tiene `Analytics`/`Reports`/`AnalyticsHub`).
   - `study/` no tiene `index.ts` → crear uno.

2. **`shared/types/`** — `database.ts` re-exporta de `@/integrations/supabase/types`; `common.ts` y `types.ts` coexisten. Verificar que `types.ts` no duplique a `common.ts`; si está vacío o duplicado, dejar nota (sin borrar archivos, según la regla del prompt).

3. **Verificación de build** — correr typecheck (`tsc --noEmit` vía harness) tras los cambios para confirmar que ningún import quedó roto.

## Reglas respetadas

- No se elimina ningún archivo.
- Solo se editan los `index.ts` de cada feature (barrels) — no se mueve código adicional, no se divide ningún componente con responsabilidades mezcladas (eso queda para el prompt 03).
- Imports siguen usando alias `@/`.

## Commit

`refactor(structure): migrate to feature-based architecture`
