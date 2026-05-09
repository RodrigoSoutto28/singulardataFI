# Project Memory

## Core

Brand: 'SINGULAR'. Lucide LineChart icon. Clean institutional fintech aesthetic.
Fonts: Inter (primary text), JetBrains Mono (data/technical elements).
Theme: Light by default (white surfaces). Dark mode via `.dark` class on <html>.
Palette (blues): #0779A2 primary, #40A9D3 accent, #2E6CC0, #0EC4CC, #8AD1CC, #B0C7E1, #42718C, #318194.
Styling: Solid surface cards (`.surface-card`), no glassmorphism in content. Subtle glass only in sidebar/topbar (`.glass-chrome`). Use semantic tokens (HSL).
Navigation: Dashboard, Journal, Analytics, Psychology, Settings. Analytics = single hub with tabs (Analytics / Insights / Reports). Routes /insights and /reports redirect to /analytics.
Terminology: Command Center, Trade Ledger, Analytics Hub, Behavioral Metrics, Pre-Market Protocol, Discipline Metrics, Portfolio Balance.
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
