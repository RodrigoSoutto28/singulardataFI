# Project Memory

## Core
Brand: 'SINGULAR dataFI'. Lucide LineChart icon. Premium fintech aesthetic with glassmorphism.
Fonts: Inter (primary text), JetBrains Mono (data/technical elements).
Colors: Dark/Light modes (#000000/#FFFFFF). Accents: #429EBD (Primary), #5FE2F5 (Accent), #F7A019 (Warn).
Styling: GLOBAL GLASSMORPHISM — translucent backgrounds, backdrop-blur(22px+), soft translucent borders (white/8%), rounded-2xl, diffuse shadows. Use `.surface-card`/`.glass-card` for cards, `.glass-chrome` for sidebar/topbar, `.glass-dialog` for modals. CorporateGrid stays as static bg layer behind glass.
3D Icons: Sidebar nav icons 40px (h-10). Dashboard cards use hero icons fused top-right corner via `.icon3d-hero` (128px, masked radial fade, slight rotation).
Terminology: Use Command Center, Trade Ledger, Analytics Hub, Behavioral Metrics, Pre-Market Protocol, Discipline Metrics, Portfolio Balance.
i18n: React Context dictionary (EN, ES, PT). No hardcoded UI strings. Persist in local storage.
State: Supabase hooks (useTrades, etc.). Zero-state initialization. No mock data.

## Memories
- [SaaS Structure](mem://business/saas-structure) — Subscription tiers (Free, Pro, Power) and feature flag access control
- [Core Functionality](mem://features/core-functionality) — Overview of main platform modules (AI, backtesting, psychology, journal)
- [Trade Export System](mem://features/trade-export) — Multi-format export (HTML, PDF, XLSX) for trade data and statistics
- [Trade Import Workflow](mem://features/trade-import) — CSV/Excel import with auto-detection and mandatory preview modal
- [Account Balance Sync](mem://features/account-balance-sync) — Formula for calculating current balance based on closed trade P&L
- [Account Configuration](mem://features/account-configuration) — Account Setup modal and fields (name, broker, balances)
- [Trade Ledger Design](mem://style/trade-ledger-design) — Layout and typography rules for the Trade Ledger component
- [Glass System](mem://style/glass-system) — Glassmorphism tokens, utility classes and hero 3D icon fusion
