# Assumptions

- Tokens are fictional and have no monetary value; no fiat integrations.
- All times are stored in UTC; UI will display in local time later.
- Admin approval is required before a market is visible (`isApproved: true`), but the seed data auto-approves demo markets.
- Numeric markets are stored but the first version only exposes YES/NO and MULTIPLE_CHOICE in the UI.
- Password policy: minimum 8 chars; no email verification yet (planned).
- One wallet per user; balance is updated atomically inside Prisma transactions.
- No real-time updates yet; polling/fetch is acceptable for v0.
- Chart data is mocked until a pricing engine produces historical points.
