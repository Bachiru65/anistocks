# OtakuMarkets Architecture

## Overview
- **Runtime**: Next.js App Router with server actions + API routes for stateless JSON APIs.
- **Backend boundary**: `src/server` holds low-level adapters (Prisma client, auth helpers); `src/modules/*` expose business services used by API routes and server components.
- **Frontend**: React Server Components by default; client components for interactive forms (bet placement, charts, auth modals).
- **Styling**: Tailwind CSS v4 with a custom design token layer for the OtakuMarkets brand.
- **Data**: PostgreSQL via Prisma. Models capture users, wallets, series, markets, options, bets, transactions, and resolution logs.
- **Auth**: Custom credential auth (email + password) using bcrypt hashing and stateless JWTs (HttpOnly cookie) generated with `jose`.
- **Testing**: Jest + Testing Library for units and components; service-layer tests focus on payout math and wallet accounting.

## Layering
- `src/lib`: Infrastructure helpers (Prisma client, JWT, password utilities, error helpers).
- `src/modules`: Business logic per domain slice (auth, markets, trading, users).
- `src/app/api`: Thin handlers that validate input, enforce auth/roles, and delegate to modules.
- `src/app/(public)` and `src/app/(dashboard)`: UI routes split by access level; server components fetch data through modules.

## Data Flow
1. Request hits Next.js route handler.
2. Input validated with Zod schemas defined alongside the module.
3. Auth check via JWT cookie; admin-only paths check `role === ADMIN`.
4. Service executes Prisma operations (often in a transaction for balance + bet consistency).
5. Handler returns structured `{ data, error }` JSON; UI consumes via `fetch`/RSC loaders.

## Error Handling
- Shared `AppError` type to map domain errors to HTTP codes.
- JSON shape: `{ code: string, message: string, details?: any }`.
- UI surfaces friendly messages and logs details to the console in dev mode.

## Observability & Logging (planned)
- Request/response logging hooks will be added before deployment.
- Prisma query logging enabled in dev via env flag (TODO).

## Security Notes
- Passwords hashed with bcrypt.
- JWTs signed with `AUTH_SECRET`, HttpOnly, Secure, SameSite=Lax.
- Basic rate-limit middleware planned for auth routes (documented in `docs/todo.md`).

## Extensibility
- Market engine is intentionally simple (pooled fixed-odds). Interfaces in `src/modules/trading` isolate pricing so CPMM or orderbook logic can replace it without touching the UI.
- Series metadata leaves room for MAL/AniList IDs.
