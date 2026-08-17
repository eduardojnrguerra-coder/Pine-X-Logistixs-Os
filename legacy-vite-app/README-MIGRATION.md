# Legacy Vite app (reference only)

This directory is the original Vite + React SPA, kept temporarily as a
reference while the app is ported to Next.js (see `supabase/migrations/` and
`src/` at the repo root for the new implementation).

It is excluded from linting, type-checking, and the production build. Pages,
components, and the `demoData.js` dataset here are being read for reference
and ported into `src/app/`, `src/lib/data/`, and Supabase tables — not
executed directly.

**Delete this directory once the migration is complete** (all pages ported,
data layer reading from Supabase instead of `demoData.js`).
