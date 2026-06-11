---
name: Glass System
description: Glassmorphism utility classes, blur tokens, hero 3D icon fusion pattern for cards
type: design
---

# Glass System

Project-wide glassmorphism. CorporateGrid background remains static behind translucent surfaces.

## Utility classes (src/styles/index.css)
- `.surface-card` / `.glass-card` — default card. bg `hsl(var(--card)/0.35)`, backdrop-blur 22px saturate 180%, border white/8%, radius 1.25rem, soft outer + inset highlight shadows. Hover: lift + primary border.
- `.glass-strong` — modals & elevated surfaces. opacity 0.6, blur 28px.
- `.glass-subtle` — nested panels / quick action buttons. opacity 0.4, blur 14px.
- `.glass-chrome` — sidebar/topbar chrome. bg `hsl(var(--background)/0.55)`, blur 24px.
- `.glass-sidebar` / `.glass-topbar` — extend chrome with directional border.
- `.glass-dialog` — modals/dialogs. opacity 0.75, blur 28px.
- `.glass-overlay` — modal backdrop blur 8px.

Light mode overrides increase opacity (white/55-75%) for readability.

## Hero 3D Icon — `.icon3d-hero`
Used to fuse 3D icons in top-right corner of dashboard cards.
- Position: `absolute top:-0.75rem right:-0.75rem`
- Size: 128×128 (h-32 w-32)
- Slight `rotate(-6deg)`, hover → `rotate(0) scale(1.06)`
- Radial mask fade for seamless fusion: `mask-image: radial-gradient(ellipse at 35% 65%, black 55%, transparent 95%)`
- Strong drop-shadow.
- Card must be `relative overflow-hidden`.
- CardHeader/CardContent reserve right padding (`pr-20`/`pr-24`) so text never collides with icon.

## Sidebar 3D icons
- Nav icons: `h-10 w-10` (40px). Row height `h-14`. Collapsed width 80px, expanded 240px.

## Radius
`--radius: 1rem` globally; cards override to 1.25rem via `.surface-card`.
