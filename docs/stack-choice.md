# Stack Choice & Rationale

## Frontend
- **Next.js (App Router) + React 19**: Server Components reduce client JS and let us prefetch market data securely. App Router keeps routing co-located with loading states.
- **Tailwind CSS v4**: Rapid theming with design tokens. Minimal runtime, good DX.
- **Recharts**: Lightweight charting for probabilities/volume without heavy config.

## Backend
- **Next.js API routes**: Fit well for a compact monorepo; easy to deploy on Vercel or Node hosts.
- **Prisma + PostgreSQL**: Strong typing, migrations, and ergonomics. Decimal handling for token math.
- **Custom JWT auth (email/password)**: Keeps control over token shape and avoids full OAuth complexity. Stateless sessions work well for simple deployments.

## Tooling
- **TypeScript strict mode**: Safer refactors.
- **ESLint + Prettier (via Next defaults)**: Base linting; additional rules can be layered per module.
- **Jest + Testing Library**: Familiar stack for service math tests and component rendering.
- **tsx**: Fast TS execution for scripts (seeding, utilities).

## Tradeoffs & Notes
- Chose **custom JWT** instead of NextAuth to keep API shapes explicit (`/api/auth/login`). This means we own session hardening (cookie flags, rotation) but keep API-first ergonomics.
- Using **pooled fixed-odds** instead of CPMM initially reduces math complexity; CPMM hooks are planned in `docs/todo.md`.
- PostgreSQL is assumed; SQLite was avoided because numeric precision for payouts matters.
