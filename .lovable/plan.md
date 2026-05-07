# Plan: Regenerate `ANALYSIS.md` Baseline

The existing `ANALYSIS.md` is **stale** — it references the old structure (`src/pages/`, `src/hooks/`, `src/components/`) but the codebase has since been reorganized into a feature-based layout (`src/features/*`, `src/shared/*`, `src/app/*`). The baseline must be rewritten against the real current code so future improvement prompts measure against accurate numbers.

## Scope

- **Read-only audit** of the entire `src/` tree, `package.json`, `supabase/`, and config files.
- **Write a single file**: `ANALYSIS.md` at the project root (overwrite existing).
- **No code changes** anywhere else.

## Steps

1. **File inventory**
   - Run `wc -l` over every file in `src/` and `supabase/functions/`.
   - Flag files > 300 lines as refactor candidates.
   - Note files with mixed responsibilities (UI + data + business logic).

2. **React component inventory**
   - For each `.tsx` in `src/features/**` and `src/shared/components/**`: count `useState`, `useEffect`, custom hooks, props, and approximate JSX lines (via `rg`).
   - Mark > 200 JSX lines as "needs split", > 5 `useState` as "needs reducer/context".

3. **Custom hooks inventory**
   - Enumerate every hook under `src/features/**/hooks/` and `src/shared/hooks/`.
   - Identify duplicated logic (e.g., balance sync, geolocation, IP detection).

4. **Supabase queries inventory**
   - `rg "supabase\.from\("` across the codebase.
   - For each call: table, operation (select/insert/update/delete), file, and whether it sits inside a TanStack Query/Mutation.
   - Flag direct calls bypassing TanStack as improvement opportunities.

5. **TypeScript types inventory**
   - List declared `interface` / `type` in `src/shared/types/` and feature folders.
   - Count and locate `any` / `as any` usages.
   - Detect overlap between manual types and auto-generated `integrations/supabase/types.ts`.

6. **UI strings inventory**
   - Scan for hardcoded user-facing strings (toast messages, button labels, headings) outside `src/shared/lib/i18n/translations.ts`.
   - Highlight English strings in Spanish-first UI and missing translation keys.

7. **Dependencies**
   - Parse `package.json`.
   - Flag known-vulnerable versions (notably `xlsx@0.18.5`).
   - Mark dependencies with no `import` matches as likely unused (`input-otp`, etc.).

8. **Quality score (0–100)**
   - Score: cohesion, separation of concerns, type consistency, error handling, TanStack Query usage, accessibility, responsive design, security.
   - Compute a weighted global score and a short "Top Priorities" list.

## Deliverable

Single file: **`ANALYSIS.md`** (root), formatted with markdown tables, ready to serve as the diff baseline for subsequent refactor prompts.

## Out of Scope

- No edits to `src/`, `supabase/`, configs, or dependencies.
- No security scan re-runs, no migrations, no commits other than the documentation file.

Commit message on apply: `docs: add initial codebase analysis baseline`.
