# Implementation Plan: SkinSync MVP

## Overview
This plan outlines the vertical slices for building the SkinSync MVP, an AI-driven skincare routine builder for the Malaysian market. We will build the foundations first (Next.js initialization, i18n), then the core feature paths (Quiz, Recommendation Engine, Auth, Checkout).

## Architecture Decisions
- **Next.js App Router:** For modern server-side rendering and routing.
- **i18n (Next-intl):** To support English and Bahasa Melayu concurrently via route segments (`/[locale]/...`).
- **Zustand:** For lightweight, persistent quiz state management.
- **Supabase:** For rapid backend development (Auth, DB, RLS).
- **Stripe:** For robust subscription management.
- **Framer Motion:** Used for smooth, high-quality transitions (industry standard for React animations).
- **Vertical Slicing:** Each phase will deliver a testable part of the user journey.

## Task List

### Phase 1: Foundation & UI Shell
- [ ] **Task 1: Initialize Next.js Project**
  - **Description:** Set up Next.js 14+ with TypeScript, Tailwind CSS, and shadcn/ui.
  - **Acceptance:** Project runs, `tailwind` is working, `shadcn` components can be added.
  - **Verify:** `npm run dev` works; basic `Button` from shadcn renders.
- [ ] **Task 2: Implement Bilingual Routing (i18n)**
  - **Description:** Configure `next-intl` for `en` and `ms` locales. Set up middleware and folder structure.
  - **Acceptance:** Navigating to `/en` and `/ms` shows different (localized) versions of a "Hello World" page.
  - **Verify:** Manual check of both locale routes.
- [ ] **Task 3: Build Global Layout & Landing Page**
  - **Description:** Create the header, footer, and a minimalist landing page reflecting the "SkinSync" brand.
  - **Acceptance:** Responsive landing page with a "Take the Skin Quiz" CTA.
  - **Verify:** Manual responsive check (mobile/desktop).

### Checkpoint: Foundation
- [ ] Application builds and serves localized landing pages.

### Phase 2: Diagnostic Quiz & State
- [ ] **Task 4: Build Multi-step Quiz UI**
  - **Description:** Create the frontend-only multi-step form for the diagnostic quiz using Framer Motion for transitions.
  - **Acceptance:** User can progress through all steps (Skin Type, Concerns, Environment, Sensitivity).
  - **Verify:** Quiz state is correctly logged to console at the end.
- [ ] **Task 5: Implement Quiz State Management (Zustand)**
  - **Description:** Store quiz answers in a Zustand store to persist across steps and (later) auth redirect.
  - **Acceptance:** Refreshing a step (within reason) or navigating back/forward maintains answers.
  - **Verify:** Inspect store state during quiz flow.

### Phase 3: Backend & Recommendation Engine
- [ ] **Task 6: Supabase Setup & Product Schema**
  - **Description:** Initialize Supabase project and create `products` table with target concerns, skin types, and subscription discount fields.
  - **Acceptance:** `products` table exists with correct RLS policies.
  - **Verify:** Query products via Supabase dashboard or SQL editor.
- [ ] **Task 7: Seed Product Data**
  - **Description:** Insert 15+ products including international (COSRX, Anua) and local Malaysian brands (Kayman Beauty, Chuck's, Tatagaltier) with relevant targeting data and subscription discounts.
  - **Acceptance:** Data reflects both brand types and configurable discounts.
  - **Verify:** `SELECT count(*) FROM products` returns expected count.
- [ ] **Task 8: Build Recommendation Algorithm (Server Action)**
  - **Description:** Create a logic-based engine that maps quiz results to a 4-5 step routine (Cleanser, Toner, etc.).
  - **Acceptance:** Passing a quiz payload returns a logical set of products.
  - **Verify:** Unit tests for the recommendation mapping logic.

### Checkpoint: Recommendation Engine
- [ ] Quiz flow connects to recommendation engine and displays suggested products.

### Phase 4: Auth & Checkout
- [ ] **Task 9: Implement Supabase Auth**
  - **Description:** Set up Email/Password and Google login. Require auth to "Save" or "Buy" the routine.
  - **Acceptance:** Users can sign up/in; quiz results are associated with their account.
  - **Verify:** `auth.users` table populated; RLS prevents seeing other users' quiz results.
- [ ] **Task 10: Integrate Stripe Subscription Checkout**
  - **Description:** Connect products to Stripe Prices. Implement a checkout session that handles both one-time and subscription (with discount). Use placeholders for Stripe keys.
  - **Acceptance:** Clicking "Subscribe" redirects to Stripe and creates a subscription in test mode.
  - **Verify:** Stripe Dashboard shows successful test transactions.
- [ ] **Task 11: Build User Dashboard**
  - **Description:** Simple portal to view saved routine, instructions, and subscription status.
  - **Acceptance:** User can see their recommended products and a link to manage Stripe subscription.
  - **Verify:** Manual login and dashboard check.

### Checkpoint: MVP Complete
- [ ] End-to-end flow from Landing -> Quiz -> Recommendation -> Auth -> Checkout -> Dashboard.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Recommendation logic mismatch | Medium | Clear unit tests for the mapping algorithm. |
| Stripe/Supabase sync issues | High | Use webhooks to keep database in sync with Stripe subscription status. |
| i18n complexity | Low | Use `next-intl` standard patterns early. |
