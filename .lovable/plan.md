## Fix: crash al ingresar + errores de build

### Causa raíz
`src/pages/Dashboard.tsx` declara `formatCurrency` localmente Y la importa desde `@/lib/utils` (donde no existe) → error de build. Además `src/pages/Auth.tsx` accede a `localized[language].tagline` sin fallback para `'FR'`, y faltan claves i18n (`dashboard.discipline`, `common.excellent/good/improvable`).

### Cambios

1. **`src/lib/utils.ts`** — Exportar `formatCurrency(value)` usando `Intl.NumberFormat` USD.

2. **`src/pages/Dashboard.tsx`** — Eliminar la función local `formatCurrency` (mantener el import desde `@/lib/utils`).

3. **`src/pages/Auth.tsx`** — Añadir entrada `FR` al diccionario `localized` y usar fallback `localized[language] ?? localized.EN` para evitar crashes con idiomas no soportados.

4. **`src/i18n/translations.ts`** — Añadir claves faltantes en `dashboard` (`discipline`) y `common` (`excellent`, `good`, `improvable`) para los 4 idiomas (ES, EN, PT, FR).

5. **`src/components/psychology/TaxometerWidget.tsx`** — Reemplazar el cast `(t as { psychology?: ... })` por acceso tipado directo `t.psychology` una vez confirmadas las claves en translations.

### Resultado esperado
- Login y Dashboard cargan sin crash en los 4 idiomas.
- Build pasa sin errores de TypeScript.
- Sin regresiones visuales.
