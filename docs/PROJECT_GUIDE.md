# Fablinks Hub — Project Guide

Reference for development, debugging and enhancement of the Fablinks site.
Reflects the state as of PR #4 (October 2026).

---

## 1. What this project is

A single-page **entertainment hub + digital-services storefront** for campus
life (Abia State University, Nigeria), with a full admin CMS. The public
landing highlights **events, blog posts and services**; the original
cyber-café landing lives on at `/experience`.

**Stack**

| Layer | Choice |
|---|---|
| Build | Vite 5 (`@vitejs/plugin-react-swc`), Bun package manager (`bun.lockb`) |
| UI | React 18 + TypeScript, Tailwind CSS 3 + shadcn/ui (Radix), `tailwind.config.ts` |
| Routing | react-router-dom v6 (SPA, `BrowserRouter`) |
| Backend | **Supabase** (Postgres + RLS + Auth + Edge Functions) via `@supabase/supabase-js` — no Convex, no server |
| SEO | `react-helmet` (`SEOHead`), static `index.html` meta, static + dynamic sitemap |
| PWA | `vite-plugin-pwa` (Workbox generateSW, offline page, runtime caching) |
| Charts / toasts / editor | recharts, sonner + shadcn toast, TipTap |

**Repo & delivery**

- GitHub: `Famesity/fablinks-hub-connect-remix`; PRs squash-merge with a
  Codebuff footer. Every PR runs **Vercel checks** (must be green before merge).
- Preview/dev is platform-managed (Freebuff) — see §3.
- Production: `fablinks.vercel.app` (canonical domain, user-confirmed Oct 2026).

---

## 2. Architecture & directory map

```
src/
  main.tsx                 entry; imports index.css (global styles + Tailwind)
  App.tsx                  providers (QueryClient, Tooltip, Toaster, Router) + ALL routes
  index.css                design tokens: Fablinks base + "ent" entertainment theme
  pages/
    Index.tsx              public landing (entertainment) — section order lives here
    Experience.tsx         the OLD cyber-café landing at /experience
    Blog.tsx, BlogPost.tsx, Services.tsx, About.tsx, Contact.tsx, Request.tsx,
    Search.tsx, Page.tsx, Auth.tsx, Install.tsx, NotFound.tsx
    admin/                 ~27 admin pages (all LAZY-loaded, see §7)
  components/
    home/                  landing sections: EntertainmentHero, InfoTicker,
                           EventsHighlights, GoodToKnow, NewsletterSignup
    admin/                 AdminLayout (sidebar shell), ProtectedRoute,
                           PermissionGate, PermissionsWidget, AdminBottomNav, ...
    Header/Footer/Layout   site chrome (nav links include /experience)
  hooks/
    useAuth.tsx            Supabase auth session/user
    useAdmin.tsx           isAdmin check for admin pages
    usePermissions.tsx     permission model (§6) — ADMIN_PERMISSIONS, PermissionGate input
    useSiteSettings.tsx    site_settings key/value (whatsapp number, hours, ...)
  integrations/supabase/
    client.ts              createClient from VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY
    types.ts               generated DB types (keep in sync after schema changes, §10)
  lib/
    lucideIconMap.ts       explicit icon registry (§7) — never import * as lucide-react
supabase/
  migrations/              SQL migrations (events: 20261002100000_9c4f2a71…)
  functions/sitemap/       dynamic sitemap Edge Function (§9)
scripts/
  generate-og-image.mjs    deterministic og-image generator (§9)
docs/PROJECT_GUIDE.md      this file
```

**Data flow pattern:** components call `supabase.from(...)` directly in
`useEffect`; there is no global server-state cache (react-query is installed
but only wraps the tree). After a mutation, components refetch their own list.

**Landing section order** (`src/pages/Index.tsx`):
EntertainmentHero → InfoTicker → TrustStrip → EventsHighlights →
FeaturedBlogPosts → FeaturedServices → GoodToKnow → NewsletterSignup → CTASection.
Each section is self-contained; reorder/replace there.

**Theme tokens** (`src/index.css`, exposed as `ent-*` colors in
`tailwind.config.ts`):

- **Dark bands** (NewsletterSignup, og-art style sections): `--ent-ink`,
  `--ent-ink-soft`, `--ent-stage`, `--ent-gold`, `--ent-gold-deep` + the
  `.gradient-gold` headline accent.
- **Light surfaces** (the landing hero): `--ent-paper` (ivory backdrop),
  `--ent-gold-ink` (AA-safe amber for small text/icons on paper, ≥4.5:1),
  `--ent-amber` (gradient mid-stop) + the `.gradient-gold-ink` headline
  accent. Use these — not `ent-gold` — for text on light backgrounds.
- The **landing hero is intentionally light** (user decision, PR #6): it
  matches the white sticky header and the gold ticker below it. Don't flip
  `EntertainmentHero` back to `bg-ent-ink`.

---

## 3. Everyday commands

```bash
bun install                    # always Bun, never npm/yarn (bun.lockb is canonical)
bun run dev                    # ONLY the platform starts this — never run it yourself
bun run build                  # vite build → dist/ (must exit, never start a server)
bun run lint                   # eslint
./node_modules/.bin/tsc -b --noEmit    # typecheck (there is NO "tsc" script alias)
```

Platform tools (run as their own command, never chained/piped):

```bash
freebuff-preview status | logs | restart   # managed dev server (port 8081)
freebuff-deploy check | status | logs | start
freebuff-env list                          # env key NAMES only, never values
```

**Env keys** (set via Settings → Environment; workspace `.env` is auto-loaded):
`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`,
`SUPABASE_ACCESS_TOKEN` (workspace-only; used for Management API/CLI).

> ⚠️ `.env` is tracked in git but the workspace copy carries local secrets.
> **Never stage or commit `.env`.** Leave it modified in `git status`.

**Typical verification loop before finishing any change:**
`./node_modules/.bin/tsc -b --noEmit && bun run build`, then check
`freebuff-preview status` (200) and eyeball the preview.

---

## 4. Database (Supabase — LIVE)

- **Project ref: `gepxztuwobtiztgylwok`** (Fablinks). `supabase/config.toml`
  must match this ref — it once pointed at a dead ref (`fptsmknmmruhmzukheds`)
  and broke CLI flows.
- Migrations live in `supabase/migrations/`. Applied ones are recorded in
  `supabase_migrations.schema_migrations`.
- **Events feature** (migration `20261002100000_9c4f2a71-…sql`, applied to live):
  `public.events` table, RLS ON, policies: *"Anyone can view active events"*
  (SELECT, `status='active'`) and *"Admins can manage events"* (ALL).
  4 seeded rows. Admin CRUD: `/admin/events`.
- **`newsletter_subscribers`**: columns `id, email, name, status, subscribed_at,
  unsubscribed_at`. RLS policies: anon **INSERT only** ("Anyone can subscribe",
  `with_check true`); SELECT/ALL require the `admin` role. **No unique
  constraint on email** (see §8).
- **`admin_permissions`**: `user_id, permission` rows drive non-super-admin
  access (§6).

**Read-only Management API query** (used for audits; `$VAR` shell expansion only):

```bash
curl -s -X POST "https://api.supabase.com/v1/projects/gepxztuwobtiztgylwok/database/query" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT * FROM events WHERE status = '"'"'active'"'"'"}'
```

Useful introspection queries: `pg_policies` (policies per table),
`information_schema.columns` (schema), `pg_constraint` (unique/foreign keys).

---

## 5. Landing content that is admin-editable (DB-backed)

These all follow the same pattern: fetch on mount, filter `is_active`, order,
fall back to hardcoded defaults when the table is empty.

| Section | Table | Admin page |
|---|---|---|
| EventsHighlights | `events` | `/admin/events` |
| FeaturedBlogPosts | `blog_posts` | `/admin/blog` |
| FeaturedServices | `featured_services` | `/admin/featured-services` |
| TrustStrip | `trust_badges` | `/admin/trust-badges` |
| InfoTicker (contact/hours band) | `site_settings` keys via `useSiteSettings` | `/admin/settings` |
| GoodToKnow (hours/address/phone) | `site_settings` keys | `/admin/settings` |
| AnnouncementBar (site chrome, in `Layout`) | announcements | `/admin/announcement` |

`icon_name` columns store **lucide icon names as strings** — they must exist
in `src/lib/lucideIconMap.ts` (§7).

---

## 6. Admin & permissions model

`src/hooks/usePermissions.tsx`:

- If a user has **zero rows** in `admin_permissions` → treated as **super
  admin**: `isSuperAdmin = true`, automatically granted *all* permissions.
- If a user has **any rows** → only the listed permissions apply.

Key points for future work:

1. `ADMIN_PERMISSIONS` maps camel/lower keys (`manage_events`, `manage_blog`, …).
2. `PERMISSION_CATEGORIES` drives the admin permissions widget UI — a new
   permission needs an entry in **both**.
3. **Adding a new permission does NOT grant it to explicit-permission admins.**
   They keep their row list until someone adds the new row. This already
   happened with `manage_events`: the explicit admin had all 22 permissions
   except events, so it was granted manually:
   `INSERT INTO admin_permissions (user_id, permission) VALUES ('<user>', 'manage_events');`
   Check with: `SELECT user_id, permission FROM admin_permissions ORDER BY user_id;`
4. Gate pages with `<PermissionGate permission={ADMIN_PERMISSIONS.X}>` (used
   throughout `pages/admin/*`); `ProtectedRoute` handles auth + redirect.
5. Frontend permission checks are **UX only** — real enforcement is RLS.

---

## 7. Bundle & code-splitting rules (learned the hard way)

The main bundle went **~2.3 MB → 1,588 kB → 918 kB (gzip ~255 kB)** after two
fixes. Do not regress them:

1. **Never `import * as LucideIcons from 'lucide-react'`** (or any namespace
   import you index dynamically). Rollup cannot tree-shake it and pulls in
   every icon. Use the explicit registry instead:

   ```ts
   import { getLucideIcon, LUCIDE_ICON_MAP } from '@/lib/lucideIconMap';
   const Icon = getLucideIcon(name);          // falls back to Star
   const Icon = getLucideIcon(name, Circle);  // custom fallback
   ```

   To support a new icon: add it to the import list **and** the map object in
   `src/lib/lucideIconMap.ts`. Admin icon pickers and DB `icon_name` values
   resolve from this same map — if an icon is missing there, admins can't
   select it and public sections fall back to `Star`.

2. **Admin pages are lazy.** `App.tsx` declares every admin page as
   `const AdminX = lazy(() => import('./pages/admin/AdminX'))` inside a
   `<Suspense fallback={RouteFallback}>`. New admin pages must follow the same
   pattern or they'll bloat the public entry chunk.

3. Entry chunk after PR #4: `dist/assets/index-*.js ≈ 918 kB / 255 kB gzip`.
   If it jumps back above ~1.2 MB, look for (1) namespace imports or (2) an
   eagerly imported admin/heavy page.

---

## 8. Newsletter signup flow

- **Public:** `src/components/home/NewsletterSignup.tsx` (landing band) inserts
  `{ email, status: 'active' }` into `newsletter_subscribers` using the anon
  key. RLS policy allows it.
- Anon **cannot SELECT** the table, so duplicates can't be checked server-side;
  the component dedupes per-browser via `localStorage`
  (`fablinks_newsletter_subscribed`).
- **Admin:** `/admin/newsletter` (`MANAGE_NEWSLETTER`) lists subscribers and
  exports CSV.
- **Known gaps / enhancement ideas:** add a unique index on `email` (with a
  migration), switch to upsert on that constraint, add double opt-in or a
  confirmation email, and surface `name` in the public form.

---

## 9. SEO & sharing assets

**Canonical domain: `https://fablinks.vercel.app`** (user-confirmed). If the
domain ever changes, update **all** of these together:

1. `index.html` — `og:url`, `og:image`, `twitter:url`, `twitter:image`,
   `rel=canonical` (5 spots).
2. `src/components/SEOHead.tsx` — `siteUrl` constant used by per-page meta.
3. `public/sitemap.xml` — static sitemap (`<loc>` entries + `lastmod`).
4. `public/robots.txt` — comment, static sitemap line, and dynamic sitemap line.
5. `supabase/functions/sitemap/index.ts` — `SITE_URL` constant, then **redeploy**:
   ```bash
   npx supabase functions deploy sitemap --project-ref gepxztuwobtiztgylwok
   ```
   The live function emits static pages + published `blog_posts` + published
   `pages` (it must be redeployed or crawlers keep getting old URLs).

**og-image:** `public/og-image.png` is a real **1200×630 PNG** (the pre-PR #4
file was a JPEG with a `.png` extension — watch for that when replacing art).
Regenerate/tweak:

```bash
node scripts/generate-og-image.mjs            # rewrites public/og-image.png
node scripts/generate-og-image.mjs /tmp/x.png # test target
```

Pure Node, deterministic (byte-identical output), no image dependencies.
Palette constants mirror the `--ent-*` tokens; the 5×7 font covers the
letters used in the current copy (extend `FONT` if you add characters).

---

## 10. PWA notes

- Configured in `vite.config.ts` → `VitePWA`. Manifest copy was updated to the
  entertainment brand; icons are `public/pwa-*.png` (192/512/maskable) and the
  `screenshots` entry reuses `og-image.png` (hence its `1200x630` declaration).
- Offline: `navigateFallback: '/offline.html'` with a denylist for
  `/api /admin /auth /search /blog /services /about /contact`.
- Runtime caching: Google Fonts (CacheFirst 1y), images (CacheFirst 30d),
  Supabase REST (NetworkFirst, 5 min, 10 s timeout).
- **Do not modify `server.hmr` / HMR settings in `vite.config.ts`** — the
  platform requires its existing configuration. Manifest/workbox text edits
  are fine; the platform restarts the dev server when the config changes.

---

## 11. Debugging playbook

| Symptom | Likely cause → fix |
|---|---|
| Type errors after schema change | Regenerate `src/integrations/supabase/types.ts` (Supabase type gen), never hand-patch generated type mismatches to "make it pass" |
| Build crashes with cryptic rollup `InvalidArg` / empty messages | Corrupt node_modules (JS vs native rollup mismatch). Fix: `rm -rf node_modules && bun install` (bun.lockb committed — tree is reproducible) |
| Blank preview / app won't compile | Run `./node_modules/.bin/tsc -b --noEmit` and fix the real errors; platform runs the same check after each turn |
| Preview looks stale | `freebuff-preview status` / `logs`; the platform picks up file edits automatically — don't start/kill servers yourself |
| Admin sees a permission wall | §6: check `admin_permissions` rows for that user; super admin = zero rows |
| Public section empty despite DB rows | Check `is_active`/`status` filters and RLS SELECT policy (`pg_policies`) |
| Public insert fails (e.g. newsletter) | Verify an INSERT policy with `with_check` exists for anon |
| CLI hits wrong project | `supabase/config.toml` project ref must be `gepxztuwobtiztgylwok` |
| PR checks red | `gh pr checks <n>`, Vercel link in output; `freebuff-deploy logs` for deploy builds |
| Sitemap still shows old URLs | Edge function not redeployed — §9.5 |
| `.env` shows modified in git | Expected (local secrets). **Never stage it.** |

**Management API / SQL access:** use the curl recipe in §4. For writes to
production tables (grants, backfills), keep them additive, verify with a
SELECT afterwards, and note them in the PR.

---

## 12. Decisions & history (why things look like this)

| When | What |
|---|---|
| PR #1 | Rebranded landing to entertainment hub; old landing → `/experience`; admin-managed `events` (table, RLS, `/admin/events`, `MANAGE_EVENTS`) |
| PR #2 | Fixed stale `supabase/config.toml` ref; added `*.tsbuildinfo`, `isolate/`, `supabase/.temp/` to `.gitignore` |
| PR #3 (parallel work) | Admin `AdminLayout` sidebar shell + nested admin routes, dashboard redesign, blog redesign, header nav changes, hero background |
| PR #4 | This guide's subject: newsletter band, icon-map bundle fix, admin route lazy-loading, PWA manifest copy, regenerated og-image, SEO domain → `fablinks.vercel.app` (incl. live sitemap function), `manage_events` grant |
| PR #5 | Added this guide, README refresh, deterministic og-image generator (`scripts/generate-og-image.mjs`) |
| PR #6 | Lightened the landing hero (user request): ivory `--ent-paper` backdrop, light-surface tokens (`--ent-gold-ink`, `--ent-amber`, `.gradient-gold-ink`); dark-section tokens untouched — see §2 |
| Decisions | **Canonical domain** `fablinks.vercel.app` (user choice, Oct 2026). **Analytics skipped** this round (Plausible — see §13). `manage_events` granted directly in the live DB because explicit-permission admins don't auto-gain new permissions |

---

## 13. Known follow-ups / roadmap

- **Plausible analytics (agreed to skip "this round"):** add
  `VITE_PLAUSIBLE_DOMAIN` in Settings → Environment, inject the Plausible
  script with SPA route tracking (react-router location effect), then verify
  a pageview in the Plausible dashboard.
- **Newsletter hardening:** unique email constraint + upsert; double opt-in;
  optional `name` field (§8).
- **Further bundle work:** `build.rollupOptions.output.manualChunks` in
  `vite.config.ts` to split vendor code (allowed — but touch **only**
  build options, never HMR/server settings).
- **og-image art:** programmatic blocky style; replace with designer art if
  desired — keep 1200×630 PNG and the manifest `screenshots` sizes in sync,
  or regenerate via §9.
- **Dynamic sitemap parity:** static sitemap and the edge function's
  `staticPages` array should stay in sync when public routes change (§9).

---

## 14. Contribution conventions

- Bun for installs/scripts; file edits through editor/file tools (not `sed`).
- Conventional-ish commit subjects (`feat:`/`chore:`), squash-merge PRs with
  the Codebuff footer; Vercel checks must be green before merging.
- Verify before handing back: `tsc -b --noEmit` + `bun run build` + preview
  HTTP 200 (and the affected flow exercised, not just compiled).
- Keep new landing sections self-contained under `src/components/home/` and
  wire them in `src/pages/Index.tsx`.
