## Vibrant Color System Upgrade

Boost saturation and contrast in light mode (and refine dark mode), introduce psychology-driven utility classes, and apply them to key components.

### 1. `src/index.css` — Token overhaul
Replace the `:root` and `.dark` blocks with the more saturated values:
- **Light**: bg `210 35% 97%`, fg `205 45% 12%`, primary `197 100% 35%`, accent `199 70% 52%`, success `165 65% 40%`, destructive `0 75% 52%`, warning `32 95% 50%`, profit `165 70% 38%`, loss `0 80% 50%`, border `210 35% 88%`, input `210 35% 90%`, ring matches primary. Sidebar tokens updated to match.
- **Dark**: bg `210 35% 7%`, fg `210 25% 95%`, card `210 32% 10%`, primary `199 75% 58%`, accent `197 100% 45%`.
- **Charts**: full vibrant palette (chart-1..5 + teal).

### 2. `src/index.css` — Append utilities
Add a new block at the end of `@layer utilities` with:
- Semantic color classes: `.bg-trust`, `.bg-growth`, `.bg-urgent`, `.bg-attention`, `.bg-premium` (+ matching `.text-*`).
- Gradients: `.gradient-primary`, `.gradient-success`, `.gradient-profit`, `.bg-success-glow`, `.bg-danger-glow`.
- Hover overlay: `.overlay-primary` with `::before`.
- `.text-shadow-soft`.
- Intense borders + ring (`.border-primary-intense`, `.border-success-intense`, `.border-danger-intense`, `.ring-primary-intense`).
- Tinted bg scales: `.bg-{primary|success|danger}-{subtle|medium|strong}`.

### 3. `src/components/ui/badge.tsx`
Rewrite `badgeVariants` so all variants use `bg-*/15` + `text-*` + `border border-*/30` with hover `bg-*/25`, plus `hover:scale-105` and `font-semibold`. Add a `success` and `warning` variant alongside `default`, `destructive`, `secondary`, `outline`.

### 4. `src/components/ui/button.tsx`
Update `default`, `success`, `destructive` variants to add `hover:shadow-lg hover:shadow-{color}/25 hover:scale-[1.02] active:scale-[0.98]`. Keep existing variants intact.

### 5. `src/components/dashboard/StatCard.tsx`
Extend `colorClasses` into `colorVariants` with `bg`, `icon`, and `glow` (`hover:shadow-[0_0_20px_...]`). Apply `glow` and `transition-all duration-300` to the `Card`. Keep existing color keys (`primary`, `teal`, `purple`, `orange`) and add `green` mapped to success.

### 6. New file `src/lib/color-psychology.ts`
Export `ColorPsychology` object (trust/growth/urgency/attention/premium with primary/light/dark/glow) and `getColorForContext(context)` helper mapping `profit|loss|warning|achievement|neutral` → token group. Pure helper, no imports needed.

### Out of scope
No changes to MetricCard, charts, or other components — saturation tokens propagate automatically. Existing components consuming `--primary`, `--success`, etc. will visually intensify with no code changes.

### Verification
- Toggle light/dark on `/dashboard` to confirm new palette.
- Confirm StatCards show glow on hover.
- Confirm badges/buttons feel more vibrant with hover scale + shadow.
