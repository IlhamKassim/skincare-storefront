# SkinSync (skincare-storefront)

A localized skincare quiz for the Malaysian market. Users answer skin type / concerns / environment / sensitivity questions, get a climate-aware routine, and click out to **Shopee / Lazada / TikTok Shop** via affiliate links. This is an affiliate aggregator, not a direct-sales storefront (despite the repo name) — see `CONTEXT.md` for the full product/session history.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4 + shadcn/ui (`@base-ui/react` primitives)
- **Backend/DB:** Supabase (Postgres, Auth, `@supabase/ssr`)
- **i18n:** next-intl, locales `en` / `ms`, routed as `/[locale]/...`
- **State:** Zustand (quiz answers persisted to `localStorage` under `skinsync-quiz-storage`)
- **Animation:** Framer Motion
- **Icons:** lucide-react (SVG only — no emoji icons)

## Project Structure

```
src/
  app/
    [locale]/           # locale-prefixed routes: /, /quiz, /results, /auth, /dashboard
    actions/            # server actions: recommendation.ts, tracking.ts
    api/auth/signout/   # the one plain API route
  components/
    ui/                 # shadcn primitives (button, card, input, label, radio-group, progress)
    quiz/steps/          # SkinTypeStep, ConcernsStep, EnvironmentStep, SensitivityStep
    recommendation/      # RoutineResults
    auth/                # AuthForm
  lib/supabase/          # client.ts (browser), server.ts (SSR/server actions)
  store/useQuizStore.ts  # Zustand quiz state
  i18n/                  # next-intl routing + request config
  messages/{en,ms}.json  # translation strings
  proxy.ts               # next-intl middleware (matches locale-prefixed paths)
supabase/
  migrations/            # schema, chronological
  seed.sql
design-system/skinsync/MASTER.md  # persisted design tokens (generated via ui-ux-pro-max skill)
```

## Demo Mode (important pattern)

`src/lib/supabase/{client,server}.ts`, `src/app/actions/recommendation.ts`, and `tracking.ts` all check whether `NEXT_PUBLIC_SUPABASE_URL` is unset or still the placeholder value. If so, they fall back to `MOCK_PRODUCTS` (`src/lib/mockData.ts`) and no-op writes instead of hitting Supabase. **There is currently no real Supabase project wired up** — the app runs entirely in Demo Mode. See `CONTEXT.md` for what's left before a real launch (real Supabase project, real affiliate URLs, quiz-result persistence, legal pages, tests).

## Conventions

- Theme tokens live in `src/app/globals.css` as CSS custom properties (`--primary`, `--muted-foreground`, etc.) — components should use semantic Tailwind classes (`bg-primary`, `text-muted-foreground`) rather than hardcoded colors, so the theme cascades from one place.
- Server Components by default; `'use client'` only where interaction/state requires it (quiz steps, forms).
- Fetch data in Server Components / server actions, not `useEffect`.

## Dev Workflow Tooling

This repo also has a project-scoped `agent-skills` plugin installed (`.claude-plugin/`, `skills/`, `agents/`, `.claude/commands/`) providing slash commands for a full spec→ship workflow: `/spec`, `/plan`, `/build`, `/test`, `/review`, `/code-simplify`, `/ship`, `/webperf`. These are general-purpose engineering workflow skills (not specific to this product) — see `skills/*/SKILL.md` for details on each.

## Commands

```bash
npm run dev     # start dev server (Turbopack)
npm run build   # production build
npm run lint    # eslint
```

No test suite exists yet.
