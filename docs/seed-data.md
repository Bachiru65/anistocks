# Seed Data

## Users
- `demo@otakumarkets.test` / password: `demo1234`
- `admin@otakumarkets.test` / password: `admin1234` (role: ADMIN)
- Both start with 10,000 demo tokens.

## Series
- One Piece, Naruto, Jujutsu Kaisen, Attack on Titan, Chainsaw Man, Spy x Family, Demon Slayer.

## Markets (examples)
- YES/NO: “Will Jujutsu Kaisen S2 E15 air by 2025-03-01?”
- YES/NO: “Will Chainsaw Man S2 be announced before 2026?”
- MULTIPLE_CHOICE: “Which series tops Oricon manga sales in May 2026?” options: One Piece, Blue Lock, Jujutsu Kaisen, Chainsaw Man.
- YES/NO: “Will One Piece Chapter 1200 introduce a new Yonko?”

## Bets
- Demo user stakes small amounts across outcomes to populate history.
- Admin account has no bets by default.

## Notes
- Deadlines are set in the near future for quick testing; adjust in `prisma/seed.ts`.
- Markets are auto-approved in seed data for visibility.
