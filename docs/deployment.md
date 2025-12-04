# Deployment Notes

## Env Vars
- `DATABASE_URL` — Postgres connection string.
- `AUTH_SECRET` — JWT signing secret.
- `BASE_URL` — public origin (used in links/emails later).
- `SEED_STARTING_BALANCE` (optional) — override default seed balance.

## Targets
- **Frontend/API**: Vercel or any Node 18+ host.
  - Set `NEXT_TELEMETRY_DISABLED=1` if desired.
  - Ensure `Prisma generate` runs during build (`postinstall` handles it).
- **Database**: Railway, Render, Supabase, Neon all work. Enable pgcrypto extension if you add UUIDs later.

## Build Steps
1. Set env vars.
2. `npm install`
3. `npx prisma migrate deploy`
4. `npm run build`
5. `npm start` (or let Vercel handle).

## Future Hardening
- Add rate limiting on auth routes (middleware).
- Add CDN caching for public GET markets.
- Hook up monitoring (Logflare/Datadog) and uptime checks.
