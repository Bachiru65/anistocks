# OtakuMarkets

Anime & manga-focused prediction markets inspired by Polymarket flows. Users stake demo tokens on YES/NO or multiple-choice outcomes, see implied probabilities, and admins resolve markets to distribute payouts.

## Quickstart
1. Install dependencies  
   ```bash
   npm install
   ```
2. Copy environment template and set secrets  
   ```bash
   cp .env.example .env
   # update DATABASE_URL + AUTH_SECRET
   ```
3. Run Prisma migrations & seed  
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
4. Start the app  
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`.

## Demo Credentials
- Demo: `demo@otakumarkets.test` / `demo1234`
- Admin: `admin@otakumarkets.test` / `admin1234`

## Project Structure
- `src/app` — App Router pages + API routes.
- `src/modules` — Domain logic (auth, markets, trading, users).
- `src/lib` — Prisma client, auth helpers, utilities.
- `prisma` — Schema + seeding.
- `docs` — Architecture, stack, specs, and deployment notes.
- `logs` — Session devlogs.

## Docs
- `docs/architecture.md` — high-level design
- `docs/stack-choice.md` — tech rationale
- `docs/markets-spec.md` & `docs/trading-model.md` — domain + payout rules
- `docs/api-design.md` — endpoints and contracts
- `docs/ui-ux.md` — UX patterns + branding

## Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — run built app
- `npm run lint` — lint
- `npm test` — Jest suite (to be wired up alongside services/components)

## Deployment
See `docs/deployment.md` for environment variables and steps. Vercel + a managed Postgres (Railway/Render/Neon) is the target combo.
