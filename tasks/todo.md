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
- [x] Reviewed — no discrete phase-gate review happened; instead each batch of work in this project was reviewed and explicitly approved conversationally before every commit/push, which served the same purpose incrementally

## Phase 2: Real Monetization Data
- [x] Task 4: Replace placeholder affiliate URLs with real Shopee links — done 2026-07-21. Pivoted to Shopee-only (see business rationale discussed with user; Lazada/TikTok Shop deferred, not abandoned — Lazada needs a 5%+ CR track record first, TikTok Shop needs 1,000+ followers). All 15 products now use real Involve Asia deeplinks (`invl.me/...`) generated directly against real Shopee MY listings. Two products renamed to match the real listings they link to: "Toleriane Sensitive Riche" → "Toleriane Ultra Creme", "Heartleaf Quercetinol Pore Deep Cleansing Gel Cream" → "Anua 3+ Ceramide Panthenol Moisture Barrier Cream". Wired into `mockData.ts`, `seed.sql`, and the live DB.
- [x] Task 5: Persist quiz results; link affiliate_clicks.quiz_result_id; wire dashboard to real saved routines — done 2026-07-20
- [x] Task 6: Add TikTok Shop platform-weighting tiebreaker to recommendation scoring — done 2026-07-20 (now dormant since the catalog is Shopee-only; left in place, harmless, and ready to reactivate once Lazada/TikTok Shop products return)

### Checkpoint: Phase 2 — COMPLETE 2026-07-21
- [x] Logged-in quiz completion creates a `quiz_results` row — verified via test account + DB query
- [x] Affiliate click creates `affiliate_clicks` row with non-null `quiz_result_id` — verified via DB join query
- [x] Dashboard shows real saved routines — verified live
- [x] TikTok Shop wins ties in recommendation scoring — verified: COSRX vs Anua cleanser both scored 4.0 on climate/concern/active, Anua (TikTok Shop) won via the +0.5 tiebreak, exactly as designed (pre-Shopee-only-pivot; logic untouched, just dormant)
- [x] All 15 products carry real, verified affiliate URLs — no placeholders remain

## Phase 3: Content & Test Coverage
- [x] Task 7: Source real product images — done 2026-07-21 (superseded the 2026-07-20 generic-icon pass now that real Shopee links exist for every product). See `docs/adr/0001-shopee-cdn-product-images.md` for the sourcing decision: reads each product's real Shopee listing `og:image` and hotlinks Shopee's own CDN (the same source Involve Asia's official datafeed points affiliates to), rather than downloading/self-hosting. `RoutineResults.tsx` falls back to the original category SVG icon via `onError` if a photo ever breaks. Sourced 6 of 15 in one pass; Shopee's bot-detection triggered a CAPTCHA partway through (did not attempt to solve it — user solved it manually), then the remaining 9 were sourced after. All 15 wired into `mockData.ts`, `seed.sql`, and the live DB; verified via lint/build/curl.
- [x] Task 8: Add Vitest + baseline tests for recommendation engine (filters + platform tiebreaker) — done 2026-07-20. 4 tests using an isolated fixture (not the real seed data, so tests stay meaningful if mockData.ts changes later): skin-type filter, sensitivity filter, occlusive/humid exclusion, TikTok Shop tiebreaker. All pass.

### Checkpoint: Phase 3 — COMPLETE 2026-07-21 — MVP deployable
- [x] `npm run build && npm run lint && npm test` all pass
- [x] No remaining placeholder data — images ✅ (real photos), legal pages ✅, affiliate URLs ✅ (all real)

## Phase 4: Post-Launch Measurement (after real traffic)
- [ ] Task 9: Analyze real quiz-to-click-to-purchase conversion
- [ ] Task 10: Scope lightweight premium tier (routine tracking / re-quiz reminders)
