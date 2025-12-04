# Trading Model (v0)

## Goal
Keep payouts simple while still resembling prediction markets. We start with **pooled fixed-odds**:
- Users stake tokens on an outcome.
- Each outcome has a pool; implied probability = `pool(outcome) / totalPool`.
- On resolution, winners receive:  
  `payout = userStake * (totalPool / winningPool)`

## Entities
- **Bet**: records stake and chosen side/option, plus `impliedOdds` snapshot for UI display.
- **Transaction**: ledger entry per balance change (`BET_PLACED`, `BET_PAYOUT`, `BET_REFUND`).
- **Wallet**: current balance; must always match last transaction `balanceAfter`.

## Flow: Place Bet
1. Validate market is `OPEN` and `isApproved`.
2. Validate user balance >= stake.
3. In a single Prisma transaction:
   - Decrement wallet balance.
   - Create `Transaction` (DEBIT, reason=BET_PLACED).
   - Create `Bet` record and bump `Market.totalStake`.
4. Return implied probability for UX: `stakeOutcomePool / totalPool` after placement.

## Flow: Resolve
1. Admin sets winning outcome (`resolvedYes` or `resolvedOutcomeId`).
2. Compute `winningPool` and `totalPool`.
3. For each OPEN bet:
   - If it matches winning outcome, `payout = amount * (totalPool / winningPool)`.
   - Update bet status to WON/LOST and set `payoutAwarded`.
   - Credit winners via `Transaction` (CREDIT, reason=BET_PAYOUT).
4. Refund path for CANCELLED markets: credit stake with reason `BET_REFUND`.

## Edge Cases
- If `winningPool == 0`, all stakes are refunded (logged as `BET_REFUND`).
- Numeric markets (future): store submitted `numericGuess`, nearest to result wins split pot.
- No partial fills/order book in v0; CPMM upgrade tracked in `docs/todo.md`.
