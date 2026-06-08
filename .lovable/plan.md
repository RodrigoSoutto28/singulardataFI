# Rebrand a "MindOn Trading Software"

## 1. Nuevo identitario visual
- **Nombre**: `SINGULAR dataFI` → `MindOn`
- **Tagline**: `Trading Intelligence Platform` → `Trading Software`
- **Logo símbolo**: ícono "power" (círculo abierto con barra vertical) en tono beige, reemplazando el `LineChart` actual. Se crea un componente `MindOnLogo` (SVG inline) reutilizable, para que el ícono se vea idéntico en sidebar, auth, splash, footer, topbar, onboarding, etc.
- **Imagen subida**: se guarda como asset CDN (`src/assets/mindon-logo.jpeg.asset.json`) para uso en metadatos OG / about / login hero opcional.

## 2. Nueva paleta (reemplaza el celeste)
Tomada del logo (fondo navy carbón + tipografía blanca + ícono beige cálido):

| Token | Antes (celeste) | Ahora (beige cálido) |
|---|---|---|
| `--primary` | `197 85% 38%` | `32 35% 62%` (beige tan) |
| `--accent` | `199 60% 48%` | `30 45% 72%` (beige claro) |
| `--sidebar-primary` | `197 100% 35%` | `32 35% 62%` |
| Dark mode `--primary` | `199 80% 60%` | `32 40% 68%` |
| Dark mode `--accent` | `197 100% 50%` | `30 50% 75%` |
| `--background` dark | (actual) | navy carbón `220 18% 11%` (alineado al logo) |
| `theme-color` HTML | `#0779A2` | `#C9A88A` |

Equivalentes hex aprox para usos hardcoded: primario `#C9A88A`, hover/accent `#D9BE9F`, profundo `#A6845F`.

## 3. Reemplazos puntuales de hex celeste
- `src/features/journal/hooks/useExportTrades.ts`: `#5FE2F5`/`#429EBD` → `#D9BE9F`/`#C9A88A` (HTML/PDF export styles).
- `src/shared/components/effects/NeuronParticles.tsx`: cambiar `primaryColor`/`accentColor` RGB a `(201,168,138)` y `(217,190,159)` + comentarios.
- `src/shared/components/effects/ParticleBackground.tsx`: `rgba(66,158,189)` → `rgba(201,168,138)`.
- `index.html`: `theme-color`, `.sdf-logo` background y `box-shadow` a tonos beige; `.sdf-name` "MindOn"; `.sdf-tag` "Trading Software"; `<title>` y meta `description/author/og:title/twitter:title/twitter:site` actualizados; canonical igual.

## 4. Archivos que mencionan el nombre
Cambiar todas las apariciones literales de `SINGULAR dataFI` / `SINGULAR` / `dataFI` por `MindOn`:
- `src/features/auth/Auth.tsx` (hero branding + ícono)
- `src/shared/components/layout/Sidebar.tsx` (logo + nombre lateral)
- `src/shared/components/layout/TopBar.tsx`
- `src/shared/components/layout/PublicFooter.tsx`
- `src/features/auth/components/onboarding/WelcomeModal.tsx`, `WelcomeScreen.tsx`, `TourStep.tsx`
- `src/features/settings/Settings.tsx`
- `src/app/Privacy.tsx`, `src/app/Terms.tsx`
- `src/shared/lib/i18n/translations.ts` (claves con el nombre)
- `index.html` (splash, title, meta tags)

Tagline traducido por idioma se queda como "Trading Software" (EN/ES/PT/FR) en `Auth.tsx` localized strings.

## 5. Memoria del proyecto
Actualizar `mem://index.md` Core: brand `SINGULAR dataFI` → `MindOn`, ícono `LineChart` → `MindOnLogo` (power icon), paleta `#429EBD/#5FE2F5` → `#C9A88A/#D9BE9F`.

## 6. Fuera de alcance
- No se tocan iconos de Lucide en gráficos/indicadores (sólo el branding).
- No se renombra el dominio publicado ni proyecto Lovable.
- No se cambia layout/estructura de páginas, sólo color y branding.

## Validación
- Recorrer `/auth`, `/dashboard`, sidebar, topbar, footer y splash en preview para confirmar que ya no aparece celeste ni "SINGULAR dataFI".
- `rg -i "singular|datafi|429ebd|5fe2f5"` debe devolver vacío (excepto memoria histórica).
