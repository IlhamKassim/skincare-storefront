# SkinSync — Session Context

Last updated: 2026-07-02. This file is a handoff for the next working session — current state, what changed recently, and what's left. `plan.txt` is the original product blueprint; parts of it (Stripe checkout, direct pricing) are now **superseded** by the pivot described below.

## What SkinSync is (current model)

A localized skincare quiz for the Malaysian market. Users answer skin type / concerns / environment / sensitivity, get a climate-aware routine, and click out to **Shopee / Lazada / TikTok Shop** via affiliate links. No direct checkout — this is an affiliate aggregator, not a storefront (despite the repo name).

## Recent work (this session)

1. **Pivoted off direct-sales checkout** (commit `847e47c`): removed Stripe entirely, added `affiliate_platform` / `affiliate_url` / `fallback_url` to the products schema, added `texture` / `is_occlusive` / `key_actives` / `climate_target` fields to support climate-aware scoring.
2. **Recommendation engine** (`src/app/actions/recommendation.ts`) now weights climate fit above concern match, excludes occlusive/heavy creams for humid & tropical profiles, and boosts niacinamide/vitamin C products in those climates.
3. **RoutineResults.tsx** opens per-product affiliate links in a new tab and fires `trackAffiliateClick` (best-effort insert into new `affiliate_clicks` table).
4. **Localization**: added barrier-warning copy (shown when picking Humid/Tropical) and affiliate disclosure strings to `en.json`/`ms.json`.
5. **Fixed two pre-existing bugs** (commit `aa5eec0`), found during verification, unrelated to the pivot:
   - `QuizFlow.tsx` never redirected to `/results` after the last quiz step — it just hung on "Calculating your routine...". Fixed with a `useEffect` that pushes to `/results` when `currentStep` runs past the `steps` array.
   - `src/i18n/request.ts` read the deprecated `locale` param from `getRequestConfig` (only populated for explicit overrides in next-intl v4). Normal routed requests always fell back to `'en'`, so `/ms` silently served English sitewide. Fixed to read `requestLocale` instead.

Both fixes were verified live in-browser (quiz → results redirect works; `/ms` renders Bahasa Malaysia correctly) before committing.

## Current state: MVP demo, not production-ready

Everything above works end-to-end **in Demo Mode** (verified via `npm run dev` + browser). Demo Mode means: no `.env.local` exists, so `NEXT_PUBLIC_SUPABASE_URL` is unset and the app falls back to `MOCK_PRODUCTS` (`src/lib/mockData.ts`) instead of a real Supabase database.

### Known gaps before this can go live

- **No real Supabase project wired up.** Migrations exist (`supabase/migrations/`, including the new `20240601000000_affiliate_pivot.sql`) and `supabase/seed.sql` is updated, but nothing has been applied to a live project. Vercel project is linked (`skinsync-mvp`, see `.vercel/project.json`) but env vars there haven't been confirmed.
- **Affiliate links are placeholders.** Every `affiliate_url`/`fallback_url` in `mockData.ts` and `seed.sql` is a fake `...skinsync-af` URL that 404s. Need real Shopee/Lazada/TikTok Shop affiliate program IDs before launch.
- **No product images.** `image_url` is `''` for all 15 seeded products.
- **Quiz results aren't persisted.** The `quiz_results` table exists in the schema but nothing in the app writes to it — routines aren't saved to a user's account after the auth wall.
- **No tests** anywhere in the repo.
- **Legal pages are stubs.** Footer's Privacy Policy / Terms of Service links go to `#`. Worth real pages given the app collects quiz data behind an auth wall.

### Suggested next priorities (not yet started)

1. Provision a real Supabase project, apply migrations + seed, wire up `.env.local` and Vercel env vars.
2. Get real affiliate program IDs for Shopee/Lazada/TikTok Shop and replace placeholder URLs.
3. Wire `getRecommendedRoutine` results into a `quiz_results` insert so logged-in users' routines persist (dashboard currently always shows "No saved routines yet").
4. Source or generate product images.
5. Real Privacy Policy / Terms pages (data collection + affiliate disclosure already exists in the Results copy, but a dedicated policy page is still missing).

## Where things live

- Recommendation logic: `src/app/actions/recommendation.ts`
- Affiliate click tracking: `src/app/actions/tracking.ts`
- Mock data (Demo Mode fallback): `src/lib/mockData.ts`
- DB schema: `supabase/migrations/` (chronological), seed data: `supabase/seed.sql`
- i18n config: `src/i18n/request.ts`, `src/i18n/routing.ts`, strings in `src/messages/{en,ms}.json`
- Original product blueprint (partially outdated, see note at top): `plan.txt`
