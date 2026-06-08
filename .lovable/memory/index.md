# Project Memory

## Core
Brand: 'MindOn — Trading Software'. Lucide `Power` icon. Clean institutional fintech aesthetic.
Fonts: Geist (primary text), Geist Mono (data/technical elements).
Colors: Dark navy carbon (#161e2c) + warm beige. Accents: #C9A88A (Primary), #D9BE9F (Accent), #F7A019 (Warn).
Styling: Solid backgrounds, rounded-lg, static 'CorporateGrid' bg. NO glassmorphism, NO neon glows.
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
