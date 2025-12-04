# Admin Panel Plan

## Capabilities
- Approve newly created markets (`isApproved` toggle).
- View markets past deadline that are still OPEN/CLOSED.
- Resolve markets by selecting winning outcome or entering numeric result.
- See audit log entries for each resolution.
- Cancel markets and trigger refunds when data is invalid.

## Access Control
- Only users with `role=ADMIN` can access `/admin/markets` and related API routes.
- Auth middleware checks JWT + role before executing actions.

## UX Sketch
- Table grouped by status: `Pending Approval`, `Awaiting Resolution`, `Resolved`.
- Each row: title, series, deadline, total stake, quick actions (Approve, Resolve, Cancel).
- Resolve modal collects winning outcome + optional note.

## Open TODOs
- Bulk actions for approvals.
- Filters by category/series for large catalogs.
- Resolution confirmation dialogs with payout preview.
