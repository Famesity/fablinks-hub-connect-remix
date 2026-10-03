# Fablinks Hub

Campus **entertainment hub + digital-services storefront** for Abia State
University, Nigeria — event highlights, blog stories and everyday digital
services (WAEC/JAMB/NECO registrations, printing, graphics and more), with a
full admin CMS.

**Live:** https://fablinks.vercel.app · **Preview/dev:** platform-managed (Freebuff)

## Stack

Vite 5 · React 18 · TypeScript · Tailwind CSS + shadcn/ui · Supabase
(Postgres + RLS + Auth + Edge Functions) · react-router v6 · vite-plugin-pwa

## Commands

```bash
bun install                      # Bun is the package manager (bun.lockb)
bun run dev                      # dev server (started by the platform, not by hand)
bun run build                    # production build → dist/
bun run lint                     # eslint
./node_modules/.bin/tsc -b --noEmit   # typecheck (no "tsc" script alias)
node scripts/generate-og-image.mjs    # regenerate public/og-image.png (1200×630)
```

Environment keys are managed in **Settings → Environment**
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`,
`SUPABASE_ACCESS_TOKEN`). Never commit `.env`.

## Documentation

**[docs/PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md)** is the full reference:

- architecture & directory map, landing sections, admin CMS
- Supabase project (live ref `gepxztuwobtiztgylwok`), RLS, migrations, Management API recipes
- permission model (super admin = zero rows in `admin_permissions`)
- bundle/code-splitting rules (explicit lucide icon map, lazy admin routes)
- newsletter flow, PWA config, SEO/og-image/sitemap maintenance
- debugging playbook, decisions/history log, roadmap

## Routes of note

- `/` — entertainment landing (events, blog, services highlights + newsletter)
- `/experience` — the original cyber-café landing page
- `/admin/*` — admin CMS (sidebar shell, permission-gated; `/admin/events`
  manages the landing line-up)

## Contributing

Squash-merge PRs with green Vercel checks. Verify changes with
`tsc -b --noEmit && bun run build` plus a preview smoke test. See the
project guide for conventions and gotchas.
