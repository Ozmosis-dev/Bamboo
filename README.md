# Bamboo Restaurant Sites

One Next.js app, two deployments:

| Site | City | Domain | `NEXT_PUBLIC_LOCATION` |
|---|---|---|---|
| Bamboo on 2nd | Birmingham, AL | bambooon2nd.com | `birmingham` |
| Bamboo on Main | Chattanooga, TN | bambooonmain.com (placeholder) | `chattanooga` |

Both sites read one shared menu from a single Supabase project. Divergence is
per-item: `menu_items.location_slugs` limits an item to one location, and
`menu_item_overrides` stores per-location price / price note / availability
exceptions. Resolution lives in `src/lib/menu.ts` (`getMenuForLocation`) and is
used by both the page render and the JSON-LD builder.

## Stack

- Next.js (App Router, TypeScript), Tailwind v4 (tokens in `src/app/globals.css` `@theme`)
- Supabase Postgres — public reads via anon key + RLS, admin writes via
  authenticated Supabase user
- Static generation with ISR (`revalidate: 300`) — menu edits go live within ~5 min
- No ordering, reservations, or i18n

## Local development

```bash
npm install
cp .env.example .env.local   # fill in Supabase URL + anon key
npm run dev
```

Run as the other location by flipping `NEXT_PUBLIC_LOCATION` in `.env.local`
(`birmingham` | `chattanooga`) and restarting the dev server.

```bash
npm test        # unit tests for menu resolution rules
npm run build   # production build (needs Supabase env vars)
```

## Database

Migrations and seed live in `supabase/`:

1. `migrations/0001_schema.sql` — tables
2. `migrations/0002_rls.sql` — RLS policies (public read, authenticated write)
3. `seed.sql` — placeholder menu incl. one location-exclusive item per city and
   a Birmingham price override on the Sashimi Platter

Apply via the Supabase SQL editor, the Supabase CLI (`supabase db push`), or the
Supabase MCP tools.

Create the single owner account in Supabase Dashboard → Authentication → Users
(email/password). That account signs into `/admin`.

## Admin

`/admin` — not linked from public nav, `noindex`. Four screens: Menu items
(inline edit, availability, dietary tags, locations selector, per-location
pricing overrides), Categories (rename/re-sort), Location details (hours, phone,
address, social, announcement banner), Login.

Public pages are ISR-cached for 5 minutes; there is no on-demand revalidation.
Tell owners: "save, then check the site in 5 minutes."

## Deploying (Vercel)

Two Vercel projects, both pointing at this repo:

1. **bamboo-birmingham** — env: `NEXT_PUBLIC_LOCATION=birmingham`, Supabase URL
   + anon key. Domain: `bambooon2nd.com` (+ `www` redirect).
2. **bamboo-chattanooga** — env: `NEXT_PUBLIC_LOCATION=chattanooga`, same
   Supabase vars. Domain: placeholder until purchased.

Each build statically renders only its own location. Legacy Birmingham paths
(`/410-2`, `/menus`, …) 301 to the new routes via `next.config.ts`.

### Adding the real Chattanooga domain

1. Buy the domain; add it to the **bamboo-chattanooga** Vercel project.
2. Update `locations.domain` for `chattanooga` in Supabase (drives canonical
   URLs, sitemap, and the cross-site footer link).
3. No code change needed.
