# Testing Strategy

## Scope
- **Unit**: Trading math (payout calculation, refunds) and auth helpers (hash/compare, JWT encode/decode).
- **Service**: Market service guards (cannot bet on closed/unapproved markets, balance checks).
- **Component**: Market card render, bet form validation messages.

## Stack
- Jest runner with `ts-jest` for TS transformation.
- `@testing-library/react` for components; `jest-environment-jsdom` for DOM.
- Factories planned under `src/testing/factories.ts` for fixtures.

## Commands
- `npm test` — run all Jest suites.
- `npm run test:watch` — watch mode (to be added if needed).

## CI Notes
- DB access is mocked in unit tests; integration tests will target a test Postgres in future work.
- Use `process.env.AUTH_SECRET="test-secret"` for JWT helper tests.
