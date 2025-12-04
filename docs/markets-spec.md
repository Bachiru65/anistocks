# Markets Domain Spec

## Entities
- **User**: `id`, `username`, `email`, `passwordHash`, `role`, profile fields, timestamps.
- **Wallet**: One-to-one with user, `balanceTokens`, transactions history.
- **Series**: Anime/manga metadata with optional MAL/AniList IDs.
- **Market**:
  - `title`, `description`, `category`, `marketType`, `resolutionDeadline`.
  - `status`: `DRAFT | OPEN | CLOSED | RESOLVED | CANCELLED`.
  - `isApproved`: gate for public visibility.
  - `resolvedYes` (for YES/NO), `resolvedOutcomeId` (for MULTIPLE_CHOICE), `resolvedNumeric` (for NUMERIC), `resolutionNote`.
- **MarketOption**: Outcome labels for MULTIPLE_CHOICE (and can host YES/NO options for consistency).
- **Bet**: User stake on a market/outcome with `amountTokens`, optional `impliedOdds`, `status`, `payoutAwarded`.
- **Transaction**: Ledger entries per wallet with `type`, `reason`, and `balanceAfter`.
- **MarketResolutionLog**: Audit trail for admin resolution.

## Relationships
- User 1—1 Wallet, 1—n Bets, 1—n Markets (as creator).
- Market 1—n Options, 1—n Bets, optional Series relation.
- Bet links to Market and optionally a MarketOption; for YES/NO the `side` flag is used.
- Transactions link to both Wallet and User for easy querying.

## Visibility Rules
- Only `isApproved=true` & `status=OPEN` are listed publicly.
- Draft/Closed/Cancelled only shown to admins and creators (future work).
- Resolved markets show winning outcome and distribute payouts.

## Status Transitions
- `DRAFT -> OPEN -> CLOSED -> RESOLVED`
- `OPEN -> CANCELLED` (refund all OPEN bets)
- Deadline auto-closes markets (cron/service TODO); admin manually resolves to set outcome and pay winners.
