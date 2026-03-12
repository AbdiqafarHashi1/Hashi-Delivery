# Beirut Side Sales Ledger

Standalone internal web app for **daily aggregate side-sales accounting** linked to a Beirut restaurant.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui-style component primitives
- Supabase (Postgres + Auth)

## Core accounting rule

This system does **not** use a net-profit split.

```text
total_sales = sum(quantity × selling_price)
sadio_cut = sum(quantity × seller_commission)
post_commission_pool = total_sales - sadio_cut
restaurant_gross_share = post_commission_pool × 0.5
partner_gross_share = post_commission_pool × 0.5
total_cogs = sum(quantity × unit_cost)
restaurant_net_share = restaurant_gross_share - total_cogs
partner_final_share = partner_gross_share
```

> Partner share is never reduced by COGS.

## Routes

### Public
- `/login`

### Seller (`data_entry`)
- `/entry/today`
- `/entry/history`

### Admin
- `/admin/dashboard`
- `/admin/items`
- `/admin/users`
- `/admin/reports`
- `/admin/profit-sharing`
- `/admin/restaurant-share-expenses`
- `/admin/accounts`
- `/admin/audit-log`

## Environment variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase schema

Run schema SQL from:

- `supabase/schema.sql`

This creates required tables:

- `users`
- `items`
- `daily_sales_entries`
- `daily_sales_entry_items` (with pricing/cost/commission snapshots)
- `allocations`
- `restaurant_share_expenses`
- `account_transactions`
- `audit_logs`

## Seed data

Run:

- `supabase/seed.sql`

Seeded records:

- Users: `Hashi` (admin), `Sadio` (data_entry)
- Items: Wrap, Samosa, Tea, Coffee

## Audit logging requirements

Log these actions to `audit_logs`:

- item create/update
- user role changes
- daily entry edits
- restaurant-share expense edits
- account adjustments

(Implementation point: use Supabase DB triggers or app service layer inserts.)

## Notes for production hardening

- Wire Supabase Auth to `users.auth_user_id` and enforce strict RLS by role.
- Add server actions/API routes for writes and validation.
- Add tests for formula correctness and role-based data visibility.
