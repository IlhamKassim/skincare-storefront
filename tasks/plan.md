# Plan: Close the Gap to a Deployable, Revenue-Ready SkinSync

## Context

SkinSync (this repo) is functionally complete as a demo — quiz, climate-aware recommendation logic, i18n, auth scaffolding, and an affiliate-click-tracking data model all exist and build/lint clean. But it has never been connected to a real Supabase project, so it silently runs in "Demo Mode" on mock data (`src/lib/mockData.ts`), and several launch-blocking gaps were identified across two prior efforts in this session:

1. **`CONTEXT.md`'s own "known gaps" list** (written by a prior session): no real Supabase project wired up, affiliate links are fake placeholder URLs, quiz results never persist despite a ready `quiz_results` table, no product images, legal pages are `#` stubs, zero tests.
2. **This session's deep-research report** (`~/Documents/SkinSync_Business_Model_Research_20260720/research_report_20260720_skinsync_business_model.md`), which examined SkinSync's business model against comparables (Function of Beauty, Prose, Curology, Wirecutter, LTK) and Malaysian marketplace/regulatory specifics. Its key finding: **two of the existing "known gaps" are not equal priority** — legal/regulatory compliance (Malaysia's PDPA classifies skin/health data as sensitive personal data requiring explicit consent; the MCMC Content Code requires unambiguous affiliate disclosure) is a hard blocker for collecting real user data at all, and should be sequenced *ahead of* revenue-optimization work like sourcing real affiliate IDs — the opposite of `CONTEXT.md`'s existing priority order. The research also surfaced one concrete, low-effort revenue-positive change: TikTok Shop pays the highest Malaysian beauty commission (15–30%) and is now the highest-traffic platform in Malaysia, so the recommendation engine's tie-breaking logic should weight toward it once real affiliate URLs exist.

This plan reorders and sequences the full remaining backlog — compliance, real data wiring, monetization-tuning, content, and tests — into dependency-ordered, vertically-sliced tasks so the product can go from "working demo" to "legally compliant, revenue-capable, deployable."

I verified the two relevant Supabase migrations directly (`supabase/migrations/20240522000000_initial_schema.sql`, `supabase/migrations/20240601000000_affiliate_pivot.sql`): the `quiz_results` table (`id`, `user_id`, `answers` JSONB, `recommended_routine` JSONB) and `affiliate_clicks` table (`id`, `product_id`, `user_id`, `affiliate_platform`, `quiz_result_id`) already exist with RLS policies allowing authenticated insert/select on `quiz_results` and public insert on `affiliate_clicks` — but **`affiliate_clicks.quiz_result_id` is never populated today** because nothing inserts into `quiz_results` first. This is a specific wiring detail Task 5 below must account for.

## Recommended Approach

Four phases, ordered so each leaves the app in a working, deployable state — compliance first (it blocks legally collecting any real data), then real monetization data, then content/quality polish, then post-launch measurement.

### Phase 1: Compliance Foundation (blocks real data collection)

**Task 1 — Provision a real Supabase project and wire environment variables**
- Create a Supabase project, apply `supabase/migrations/*` in order, run `supabase/seed.sql`.
- Populate `.env.local` (gitignored already) with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` per `.env.example`; set the same three in Vercel (project `skinsync-mvp`, already linked per `.vercel/project.json`).
- This flips `src/lib/supabase/{client,server}.ts` and `src/app/actions/{recommendation,tracking}.ts` out of their existing Demo Mode fallback (`if (!process.env.NEXT_PUBLIC_SUPABASE_URL || ... === 'your-supabase-url')`) automatically — no code change needed, just real env vars.
- **Acceptance criteria:** `npm run dev` with real env vars shows real Supabase-backed products on `/quiz` → `/results`, not `MOCK_PRODUCTS`; `console.log('Running in Demo Mode...')` no longer fires.
- **Dependencies:** None.
- **Size:** S (no code changes, infra/config only).

**Task 2 — PDPA-compliant consent step in the quiz intake flow**
- Add an explicit, unticked-by-default consent checkbox/screen before `SkinTypeStep` (the quiz's first question), naming what's collected (skin type, concerns, environment, sensitivity — all skin/health-adjacent), why, retention, and that it's stored via Supabase.
- Replace the `#` Privacy Policy stub (linked from `Footer.tsx`) with a real page at a new route (e.g. `src/app/[locale]/privacy/page.tsx`) describing this specifically — required because PDPA treats health-adjacent data as "sensitive personal data" requiring freely-given, specific, informed, unambiguous consent (research Finding 5).
- **Files:** `src/components/quiz/QuizFlow.tsx` (or a new `ConsentStep.tsx` prepended to the `steps` array), `src/components/Footer.tsx` (fix link), new `src/app/[locale]/privacy/page.tsx`, `src/messages/{en,ms}.json` (new strings).
- **Acceptance criteria:** Quiz cannot advance past the consent step without an affirmative, non-preticked checkbox; Privacy Policy page names data categories, purpose, retention, and third parties (Supabase).
- **Dependencies:** None (can be built in Demo Mode, verified against real DB once Task 1 lands).
- **Size:** M.

**Task 3 — Audit and fix affiliate disclosure copy against the MCMC Content Code**
- Review the existing `affiliateDisclaimer` string in `en.json`/`ms.json` (rendered on `/results` per `RoutineResults.tsx`) against the Content Code's requirement for explicit terms ("Advertisement," "Sponsored") and its explicit rejection of vague terms ("Sp," "Collab," etc.) — fix wording if it doesn't already use an explicit term.
- Replace the `#` Terms of Service stub similarly to Task 2's Privacy Policy.
- **Files:** `src/messages/en.json`, `src/messages/ms.json`, new `src/app/[locale]/terms/page.tsx`, `src/components/Footer.tsx`.
- **Acceptance criteria:** Disclosure string uses an explicit disclosure term in both locales; Terms link resolves to a real page.
- **Dependencies:** None.
- **Size:** S.

**Checkpoint — Phase 1 complete:** `npm run build && npm run lint` pass; a fresh quiz run shows the consent step, and Privacy/Terms links resolve to real content in both `en` and `ms`. The app is now legally soundable to collect real Malaysian user data — review with human before proceeding to Phase 2.

### Phase 2: Real Monetization Data

**Task 4 — Replace placeholder affiliate URLs with real program links**
- Register for Shopee, Lazada, and TikTok Shop Malaysia affiliate/creator programs (business/account task, not code) and replace every placeholder `...skinsync-af` URL in `supabase/seed.sql` (and `src/lib/mockData.ts` for Demo Mode) with real tracked affiliate URLs.
- **Acceptance criteria:** Every seeded product's `affiliate_url` resolves to a real, trackable marketplace listing; `fallback_url` set where a direct affiliate link isn't available for a given product.
- **Dependencies:** Task 1 (real DB to reseed).
- **Size:** M (mostly data/account work, not code).

**Task 5 — Persist quiz results and link affiliate clicks to them**
- In `RoutineResults.tsx`, after `getRecommendedRoutine` returns, insert a row into `quiz_results` (`user_id` if authenticated, `answers` from the Zustand store, `recommended_routine` from the result) via a new server action, capture the returned `id`.
- Thread that `quiz_result_id` into `handleShopClick` → `trackAffiliateClick`, and update `trackAffiliateClick`'s signature/insert in `src/app/actions/tracking.ts` to include it (the column already exists in `affiliate_clicks` but is never populated today).
- Update `dashboard/page.tsx`'s "Saved Routines" card to query and render the user's `quiz_results` instead of the current hardcoded "No saved routines yet."
- **Files:** `src/components/recommendation/RoutineResults.tsx`, `src/app/actions/recommendation.ts` (or a new `saveQuizResult` action), `src/app/actions/tracking.ts`, `src/app/[locale]/dashboard/page.tsx`.
- **Acceptance criteria:** Completing the quiz while logged in creates a `quiz_results` row; clicking a product's affiliate link creates an `affiliate_clicks` row with a non-null `quiz_result_id`; the dashboard lists real saved routines for a logged-in user.
- **Dependencies:** Task 1.
- **Size:** M.

**Task 6 — Add platform-weighting to the recommendation scoring function**
- In `getRecommendedRoutine`'s per-category scoring loop (`src/app/actions/recommendation.ts`), add a small tie-breaking weight favoring `affiliate_platform === 'TikTok Shop'` over Shopee/Lazada when climate/concern/sensitivity scores are otherwise equal — per the research finding that TikTok Shop pays the highest Malaysian beauty commission (15–30%) and now leads Malaysian marketplace traffic.
- **Acceptance criteria:** Given two products with identical climate/concern/active scores but different platforms, the TikTok Shop-listed product is selected; existing skin-type/sensitivity/climate filtering behavior is unchanged (this is a tiebreaker only, not an override).
- **Dependencies:** Task 4 (needs real, platform-differentiated affiliate data to be meaningful).
- **Size:** S.

**Checkpoint — Phase 2 complete:** A logged-in user can complete the quiz, see their routine saved on `/dashboard`, click through to a real affiliate link, and the recommendation engine measurably favors TikTok Shop on ties. Review with human before proceeding.

### Phase 3: Content & Test Coverage

**Task 7 — Source or generate product images**
- Populate `image_url` for all seeded products (currently empty per `CONTEXT.md`); render them in `RoutineResults.tsx`'s product cards.
- **Dependencies:** Task 1 (reseed).
- **Size:** M.

**Task 8 — Establish baseline test coverage, starting with the recommendation engine**
- No test framework is currently installed (`package.json` has no `test` script or test dependencies) — add Vitest (lightest-weight fit for a Next.js/Turbopack project) and write unit tests for `getRecommendedRoutine`'s filtering/scoring logic (`src/app/actions/recommendation.ts`), since it's the highest-risk untested logic in the app per `CONTEXT.md`'s "no tests anywhere" gap and is now also carrying the new platform-weighting logic from Task 6.
- **Acceptance criteria:** `npm test` runs and passes; at least one test per filter rule (skin type, sensitivity, occlusive/humid exclusion) and one test confirming the Task 6 platform tiebreaker.
- **Dependencies:** Task 6 (tests should cover the finished scoring logic, not a mid-change version).
- **Size:** M.

**Checkpoint — Phase 3 complete / MVP deployable:** `npm run build`, `npm run lint`, and `npm test` all pass; no placeholder data (images, affiliate URLs, legal pages) remains. This is the "ready to deploy" bar.

### Phase 4: Post-Launch Measurement (not a launch blocker — do after real traffic exists)

**Task 9 — Analyze real quiz-to-click-to-purchase conversion**
- Once live, query `quiz_results` and `affiliate_clicks` (now linked via Task 5) to establish SkinSync's actual conversion rates — the research report found no published benchmark for this exact cross-platform-handoff model, so this is a first-of-its-kind measurement for the product.
- **Dependencies:** Phase 2 + real traffic.

**Task 10 — Scope a lightweight premium tier**
- Only after Task 9 shows retention/engagement signal: scope a subscription tier around routine-tracking and seasonal re-quiz reminders (leveraging the existing climate-aware logic) — explicitly *not* a physical subscription box, to avoid the manufacturing/fulfillment overhead that Function of Beauty and Curology carry per the research report.
- **Dependencies:** Task 9.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Lazada/Shopee/TikTok Shop commission rates or program terms change before Task 4 | Medium | Verify current terms directly against each platform's official affiliate portal at signup time, not against this session's research snapshot |
| PDPA consent copy (Task 2) is legally insufficient despite best-effort drafting | High | Recommend a lawyer/compliance review of the consent + Privacy Policy copy before real launch, not just an engineering pass |
| Task 5's quiz_results insert adds latency to the results page | Low | Insert can run in parallel with `getRecommendedRoutine`'s product fetch, or fire-and-forget like `trackAffiliateClick` already does |

## Verification

- After Phase 1: manual quiz run through consent step in both locales; `npm run build && npm run lint`.
- After Phase 2: manual logged-in quiz completion → dashboard shows saved routine → click affiliate link → verify `affiliate_clicks` row has `quiz_result_id` set (via Supabase table editor or a quick SQL check).
- After Phase 3: `npm run build && npm run lint && npm test` all green; grep codebase for any remaining `#` href or placeholder URL strings.
- Each phase's checkpoint is a human review gate before starting the next phase (per this repo's own `planning-and-task-breakdown` skill convention).
