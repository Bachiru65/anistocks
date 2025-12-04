# API Design

All routes return JSON `{ data?: T, error?: { code, message, details? } }`.
Authenticated routes expect an HttpOnly `om_session` JWT cookie.

## Auth
- `POST /api/auth/signup`  
  Body: `{ username, email, password }` (min 8 chars).  
  Creates user + wallet + initial balance (configurable).
- `POST /api/auth/login`  
  Body: `{ email, password }`. Sets `om_session` cookie on success.
- `POST /api/auth/logout`  
  Clears auth cookie.
- `GET /api/auth/me`  
  Returns user profile, wallet balance, roles.

## Series
- `GET /api/series` (public, paged) with optional `type`, `q`.
- `POST /api/series` (admin) to add new anime/manga.

## Markets
- `GET /api/markets`  
  Query: `category`, `seriesId`, `status`, `search`, `take`, `skip`, `sort`.
- `GET /api/markets/:id`  
  Includes options and basic aggregates.
- `POST /api/markets` (auth required)  
  Body: `{ title, description, category, marketType, resolutionDeadline, relatedSeriesId?, options[] }`.  
  Markets default to `isApproved=false`; admin or config can auto-approve.
- `POST /api/markets/:id/resolve` (admin)  
  Body varies by type:  
  - YES_NO: `{ outcome: "YES" | "NO", note? }`  
  - MULTIPLE_CHOICE: `{ optionId, note? }`  
  - NUMERIC: `{ numericResult, note? }`

## Trading
- `POST /api/markets/:id/bet` (auth)  
  Body: `{ amount, side?, optionId? }` depending on market type.
- `GET /api/users/me/positions` (auth)  
  Returns open bets with market context.
- `GET /api/users/me/transactions` (auth)  
  Ledger for the wallet.

## Error Codes (examples)
- `UNAUTHORIZED`, `FORBIDDEN`, `VALIDATION_ERROR`, `MARKET_CLOSED`, `INSUFFICIENT_FUNDS`, `NOT_FOUND`, `SERVER_ERROR`.

## Validation
- Zod schemas live next to route handlers.
- Dates validated as ISO strings; server converts to `Date`.
