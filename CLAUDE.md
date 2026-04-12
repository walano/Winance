# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (Vite, default port 5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

No linting or test setup currently exists.

## Environment

Requires a `.env` file at project root:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Architecture

Single-page React app (no router library). Navigation is driven by a `page` state string (`'home'`, `'stats'`, `'help'`, `'settings'`).

### Data flow

1. `main.jsx` → renders `<App />`
2. `App.jsx` checks Supabase session on mount; if none, renders `<AuthPage />` (Google OAuth)
3. On auth, `loadData()` fetches all user data via `Promise.all` and stores it in local state
4. All CRUD handlers directly update both local state and Supabase in sequence (no optimistic rollback)

### Key files

- `src/App.jsx` — 860+ line monolith containing all pages, all sub-components (defined inline), all state, and all Supabase calls
- `src/lib/supabase.js` — Supabase client init (reads env vars)
- `src/lib/utils.js` — Currency formatting (`fmt`, `fmtShort`), conversion helpers (`toUSD`), constants (`CURRENCIES`, `PALETTE`, `FALLBACK_RATES`, `DEFAULT_CATEGORIES`)
- `src/pages/AuthPage.jsx` — Google OAuth login screen

### Supabase tables

| Table | Key columns |
|-------|-------------|
| `profiles` | `id`, `firstname`, `pivot_currency` |
| `accounts` | `id`, `user_id`, `name`, `currency`, `color`, `svg_data`, `position` |
| `categories` | `id`, `user_id`, `name`, `color`, `position` |
| `transactions` | `id`, `user_id`, `account_id`, `amount`, `currency`, `type`, `category_id`, `category_name`, `category_color`, `note`, `date` |

All tables are filtered by `user_id` matching the Supabase auth session.

### Styling

No CSS files. Styles live in two places:
- A `const CSS` template string in `App.jsx`, injected via a `<style>` tag at render time
- Inline `style={{}}` objects on components

Design: dark purple glassmorphic theme, mobile-first, bottom navigation. Primary: `#6C63FF`, background: `#0d0221`.

### Sub-components

All UI components are defined as functions inside `App.jsx` (not imported). Key ones: `CardCarousel`, `BankCard`, `DragList`, `AccountModal`, `CategoryModal`, `AddModal`, `TxRow`, `SpendChart`, `SettingsPage`, `AidePage`.

### Currency conversion

Exchange rates are hardcoded in `FALLBACK_RATES` (utils.js). All amounts are first converted to USD via `toUSD()`, then to the user's selected pivot currency via `toPivot()`. The pivot currency is saved in `profiles.pivot_currency`.

### Drag & drop

Uses native HTML5 `draggable` API with a `dragIdx` useRef to track source index. Applies to both accounts and categories in settings. On drop, calls Supabase to persist new `position` values.
