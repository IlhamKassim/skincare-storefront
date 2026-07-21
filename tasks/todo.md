# SkinSync Task List

Full plan with acceptance criteria, file paths, and rationale: `tasks/plan.md`

## Phase 1: Compliance Foundation
- [x] Task 1: Provision a real Supabase project and wire environment variables — done 2026-07-20. Project `skinsync-mvp` (org "SkinSync", region ap-southeast-1), migrations applied, seed data loaded (15 products verified), `.env.local` + Vercel (production/preview/development) all set. Verified live via browser quiz run: real Supabase-backed products returned, no Demo Mode fallback triggered.
- [x] Task 2: PDPA-compliant consent step in the quiz intake flow + real Privacy Policy page — done 2026-07-20. Added `ConsentStep.tsx` gate (unticked checkbox, blocks progress) before the quiz's 4 questions, `hasConsented`/`consentedAt` persisted in the Zustand store, real `/privacy` page in `en`/`ms`. Verified live in-browser both locales; build/lint pass.
- [x] Task 3: Audit/fix affiliate disclosure copy against MCMC Content Code + real Terms page — done 2026-07-20. Added explicit "ADVERTISEMENT" label + moved disclosure banner above the product grid (previously appeared after the Shop buttons — a real placement gap). Real `/terms` page in `en`/`ms` with dedicated affiliate-disclosure section. Verified live; build/lint pass.

### Checkpoint: Phase 1 — COMPLETE 2026-07-20
- [x] `npm run build && npm run lint` pass
- [x] Consent step blocks quiz progress until checked
- [x] Privacy/Terms links resolve in both `en` and `ms`
- [ ] Human review before Phase 2

## Phase 2: Real Monetization Data
- [ ] Task 4: Replace placeholder affiliate URLs with real Shopee/Lazada/TikTok Shop links — blocked on user (business/account registration)
- [x] Task 5: Persist quiz results; link affiliate_clicks.quiz_result_id; wire dashboard to real saved routines — done 2026-07-20
- [x] Task 6: Add TikTok Shop platform-weighting tiebreaker to recommendation scoring — done 2026-07-20

### Checkpoint: Phase 2 (Tasks 5+6 verified; Task 4 pending)
- [x] Logged-in quiz completion creates a `quiz_results` row — verified via test account + DB query
- [x] Affiliate click creates `affiliate_clicks` row with non-null `quiz_result_id` — verified via DB join query
- [x] Dashboard shows real saved routines — verified live
- [x] TikTok Shop wins ties in recommendation scoring — verified: COSRX vs Anua cleanser both scored 4.0 on climate/concern/active, Anua (TikTok Shop) won via the +0.5 tiebreak, exactly as designed
- [ ] Human review before Phase 3

## Phase 3: Content & Test Coverage
- [x] Task 7: Source/generate product images — done 2026-07-20. Used 5 original on-brand SVG category icons (cleanser/toner/serum/moisturizer/sunscreen) rather than scraping real brand photos (copyright risk) — real per-product photos should come from official affiliate marketing kits once Task 4 lands. Wired into `mockData.ts`, `seed.sql`, backfilled on the live DB, rendered in `RoutineResults.tsx`. Verified live.
- [x] Task 8: Add Vitest + baseline tests for recommendation engine (filters + platform tiebreaker) — done 2026-07-20. 4 tests using an isolated fixture (not the real seed data, so tests stay meaningful if mockData.ts changes later): skin-type filter, sensitivity filter, occlusive/humid exclusion, TikTok Shop tiebreaker. All pass.

### Checkpoint: Phase 3 — MVP deployable except Task 4
- [x] `npm run build && npm run lint && npm test` all pass
- [ ] No remaining placeholder data — images ✅, legal pages ✅, **affiliate URLs still placeholder, blocked on Task 4 (user)**

## Phase 4: Post-Launch Measurement (after real traffic)
- [ ] Task 9: Analyze real quiz-to-click-to-purchase conversion
- [ ] Task 10: Scope lightweight premium tier (routine tracking / re-quiz reminders)
