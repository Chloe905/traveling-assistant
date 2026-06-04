# Project Overview
This is an AI travel itinerary assistant built with Vue 3 and Vite. The app helps users create trips, manually add candidate spots, generate a mock AI itinerary with time and transportation notes, adjust itinerary items, and invite friends to collaborate by email, invite link, or QR code.

## Technology Stack Usage
- Node.js: v20.x or newer is preferred for local development and CI.
- Vue: 3.x with Composition API for new features.
- TypeScript: 5.x. Keep types explicit and avoid weakening type safety.
- Build tool: Vite 6.x.
- State management: Pinia.
- Routing: Vue Router 4.x with lazy-loaded route components.
- Styling: Tailwind CSS 3.x with Morandi-inspired design tokens.
- Backend/data: Supabase Auth and Supabase Postgres with RLS policies.
- API client: `@supabase/supabase-js`; keep API access in service-layer modules.
- Internationalization: support English, Traditional Chinese, and Japanese for user-facing UI copy.
- Testing: Vitest for unit tests and Playwright for E2E tests.

## Banned Kits
- `request`: use `fetch`, `axios`, or Supabase client APIs instead.
- `moment`: use native Date utilities or a lightweight date utility if the project adds one intentionally.
- `eval`: never execute dynamic code.
- Hardcoded secrets: all keys and URLs must come from environment variables.

## Project Structure
- `/src/components` - Reusable Vue UI components.
- `/src/views` - Route-level Vue pages.
- `/src/router` - Vue Router definitions and navigation guards.
- `/src/stores` - Pinia stores for auth, trips, and planner state.
- `/src/services` - Supabase/API service layer and external integrations.
- `/src/types` - Shared TypeScript models and API result interfaces.
- `/src/utils` - Pure utility functions, especially planner/time helpers.
- `/src/styles` - Global Tailwind and shared CSS layers.
- `/tests/e2e` - Playwright E2E tests.
- `/supabase/migrations` - Supabase schema, RLS policies, and RPC migrations.

# Code Style

## Naming Conventions
- Filename: kebab-case, for example `candidate-spot-form.vue` for new files when practical. Keep existing filenames unless a rename is necessary.
- Vue components: PascalCase component names, for example `TripCard`.
- Functions: camelCase, for example `createInviteLink`.
- Constants: UPPER_SNAKE_CASE only for true global constants.
- CSS custom classes: kebab-case. Prefer BEM for global CSS classes.
- State CSS classes: use `.is-active`, `.is-disabled`, `.has-error`.

## TypeScript Requirements
- Do not use `any` unless there is no reasonable alternative and the reason is documented.
- Prefer interfaces for shared object shapes.
- Keep API payload/result types in `/src/types` or close to the service when local-only.
- Use async/await for asynchronous code.
- New service functions should return typed data, not raw untyped responses.

## Vue Requirements
- Prefer Composition API and `<script setup lang="ts">` for new components.
- Keep business logic in Pinia stores or service modules instead of large view components.
- Use computed state for derived values.
- Do not mutate props directly.
- Keep route components lazy loaded when adding new pages.
- When adding user-facing copy, prepare wording for English, Traditional Chinese, and Japanese.

## Language Requirements
- Supported languages: English (`en`), Traditional Chinese (`zh-TW`), and Japanese (`ja`).
- Traditional Chinese copy should use Taiwan-friendly wording.
- Japanese copy should use natural product UI wording, not machine-literal translation.
- Keep route names, file names, and code identifiers in English.
- Do not mix multiple languages inside the same UI label unless the design intentionally calls for it.

## Tailwind and UI Requirements
- Tailwind utility classes are allowed and preferred for layout and component styling.
- Use the existing Morandi palette and simple, calm spacing.
- Keep dashboard/tool pages practical and dense enough for repeated use.
- Do not use IDs for styling.
- Do not add vague custom classes such as `.box`, `.content`, `.red`, or `.big`.
- Do not rename existing CSS classes unless required; update all usages when renaming.

## Error Handling
- User-facing errors should be specific and actionable.
- Supabase Auth errors should be translated into clear Chinese UI messages where possible.
- Service-layer errors should preserve useful context for debugging.
- Avoid swallowing errors silently.

# Security Guidelines

## Absolutely Prohibited
- Hardcoding API keys, passwords, tokens, or Supabase service role keys in code.
- Exposing `service_role` keys to the frontend or Vercel client-side env vars.
- Executing dynamic code using `eval()`.
- Directly using unvalidated user input in database filters or RPC payloads.
- Weakening Supabase RLS policies for convenience.

## Mandatory
- Read all sensitive configuration from `.env` or platform environment variables.
- Frontend may only use `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and other safe public Vite variables.
- Use Supabase RLS policies for trip ownership and collaborator access.
- Invite-link behavior must avoid anonymous unrestricted write access.
- Validate user input before sending it to services when adding or changing forms.

# Testing Standards

## Test Coverage Requirements
- All new planner utilities should have Vitest unit tests.
- Pinia store actions should be tested when behavior becomes non-trivial.
- E2E tests should cover important user flows: sign in, create trip, add candidate spot, run AI plan, edit/delete spots, and invite collaborator.
- Add focused tests for bug fixes when practical.

## Testing Framework
- Unit tests: Vitest.
- E2E tests: Playwright.
- Test file naming: `*.test.ts`.

## Testing Principles
- Each test should verify one behavior.
- Use descriptive test names.
- Tests should be independent and not rely on previous test order.
- Prefer stable selectors and user-visible behavior for E2E tests.

# Environment Variables
- `VITE_SUPABASE_URL`: Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Supabase anon public key only.
- `VITE_PUBLIC_APP_URL`: Public deployed app URL used for invite links, for example `https://traveling-assistant.vercel.app`.

# Special Rules

## Git Commit Guidelines
Follow Conventional Commits:
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Refactor
- `test:` Test related
- `docs:` Documentation update
- `chore:` Tooling or maintenance

Do not commit automatically. Show the proposed commit message first and wait for explicit user approval.

## Deployment Guidelines
- Vercel must define the same public env vars used locally.
- Never push `.env` files.
- Confirm target branch and remote before pushing.

## Performance Requirements
- Keep route-level views lazy loaded.
- Keep AI planning transformations linear and predictable for candidate spot lists.
- Avoid unnecessary full-trip refetches when local state can be updated safely.
- Keep large repeated lists ready for future virtual scrolling if they grow.

## When Encountering Uncertainty
If you are unsure what to do:
1. Pause and avoid guessing.
2. Ask the user a concise question.
3. Refer to similar implementations already in the project.
