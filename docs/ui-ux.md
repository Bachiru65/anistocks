# UI / UX Notes

## Branding
- Product name: **OtakuMarkets** (alts: AnimeBook, ShonenPredict, MangaPicks).
- Palette direction: deep indigo + sakura accent, dark backgrounds for card contrast.
- Typography: Geist Sans for base; bold, condensed headings for hero sections.

## Layout
- Global nav with logo, Markets, Series, Leaderboard, and auth/profile actions.
- Split routes: public pages under `/` and `/markets`; authenticated dashboard under `(dashboard)` group.
- Cards-first listing: market cards show title, series, category chip, deadline, pooled volume, and implied probability.
- Market detail: header with status badge, chart placeholder, bet form, and outcome options.
- Admin panel: table of pending approvals and ready-to-resolve markets.

## Interactions
- Bet form:
  - Amount input with quick-select buttons (25/50/100 tokens).
  - Outcome selector (YES/NO buttons or option list).
  - Shows implied odds from pool snapshot.
- Auth:
  - Simple email/password forms with inline validation.
  - Show demo credentials in README.
- Responsive:
  - Filters collapse into a drawer on mobile.
  - Cards stack vertically; chart becomes a mini sparkline on small screens.

## Accessibility
- Minimum touch targets 40px.
- High-contrast badges for statuses.
- Form validation messages aria-linked to inputs.

## Future UX Enhancements
- Live price updates via SSE/WebSockets.
- User watchlist/favorites for series and markets.
- Rich editor for market descriptions (Markdown preview).
