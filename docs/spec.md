# Spec: SkinSync - Curated Skincare Routine Builder

## Objective
Build an MVP for "SkinSync", a localized (Malaysian-focused) e-commerce platform that acts as an automated skincare consultant.
- **User Story:** As a user with specific skin concerns, I want to take a diagnostic quiz so that I can receive a personalized, multi-step skincare routine and subscribe to automated replenishments.
- **Success Metrics:** 
  - Functional multi-step quiz with logic-based recommendations.
  - Successful user registration and routine saving in Supabase.
  - Functional Stripe subscription checkout flow.
  - Responsive, clean UI following minimalist/clinical design principles.

## Tech Stack
- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend/DB:** Supabase (Auth, PostgreSQL, Storage)
- **Payments:** Stripe (Subscriptions)
- **State Management:** Zustand (for quiz state)
- **i18n:** Next-intl or similar for English & Bahasa Melayu support
- **Icons:** Lucide-react

## Commands
- **Dev:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Test:** `npm test` (to be configured)
- **Supabase Local:** `supabase start` (if using local dev)

## Project Structure
```
src/
  app/              # Next.js App Router (pages, layouts)
    [locale]/       # Internationalized routes (en/ms)
  components/       # Reusable UI components (shadcn/ui + custom)
    quiz/           # Quiz-specific components
    ui/             # Base shadcn components
  lib/              # Utilities, Supabase client, Stripe helpers
  hooks/            # Custom React hooks
  store/            # Zustand stores (e.g., useQuizStore)
  types/            # TypeScript interfaces/types
  messages/         # i18n translation files (en.json, ms.json)
supabase/
  migrations/       # Database schema migrations
  seed.sql          # Seed data for products (intl + local brands)
docs/               # Project documentation
tests/              # Unit and integration tests
```

## Code Style
- **Naming:** PascalCase for components, camelCase for variables/functions.
- **Components:** Functional components with TypeScript interfaces for props.
- **Server Actions:** Use Next.js Server Actions for database mutations and logic.
- **Consistency:** Use shadcn/ui patterns for forms and interactive elements.

## Testing Strategy
- **Framework:** Vitest + React Testing Library.
- **Unit Tests:** For recommendation logic and utility functions.
- **Integration Tests:** For the quiz flow and auth state.
- **E2E:** Playwright (optional, if time permits).

## Boundaries
- **Always:** 
  - Write TypeScript types for all data structures.
  - Use Responsive design (Mobile-first).
  - Use environment variables for sensitive keys.
  - Support bilingual strings (en/ms) for all user-facing content.
- **Ask first:** 
  - Significant database schema changes.
  - Adding major new dependencies.
  - Changing the recommendation algorithm logic.
- **Never:** 
  - Hardcode API keys or secrets.
  - Bypass Supabase RLS (Row Level Security).

## Success Criteria
- [ ] Next.js project initialized with Tailwind and shadcn/ui.
- [ ] Bilingual support (en/ms) implemented for core pages.
- [ ] Landing page reflects the minimalist/clinical aesthetic.
- [ ] Quiz accurately captures user data and logs a valid payload.
- [ ] Database seeded with realistic product data (international & local brands).
- [ ] Recommendation logic returns 4-5 products matching user concerns.
- [ ] Stripe checkout handles subscription creation with product-specific discounts.
