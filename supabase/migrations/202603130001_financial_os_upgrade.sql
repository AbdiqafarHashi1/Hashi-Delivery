-- Financial OS upgrade: daily summaries, expenses categories, and partner account ledgers

create table if not exists daily_financial_summary (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null unique,
  total_sales numeric(12,2) not null default 0,
  total_cogs numeric(12,2) not null default 0,
  net_profit numeric(12,2) not null default 0,
  restaurant_share numeric(12,2) not null default 0,
  abdiqafar_share numeric(12,2) not null default 0,
  shafie_share numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_type where typname = 'partner_account_type') then
    create type partner_account_type as enum ('restaurant', 'abdiqafar', 'shafie');
  end if;
end $$;

alter table account_transactions
  add column if not exists account_owner partner_account_type,
  add column if not exists reference_entry_date date;

update account_transactions
set account_owner = 'restaurant'
where account_owner is null;

alter table account_transactions
  alter column account_owner set not null;

alter table restaurant_share_expenses
  add column if not exists expense_type text not null default 'other';

create index if not exists idx_daily_financial_summary_entry_date on daily_financial_summary(entry_date);
create index if not exists idx_account_transactions_owner_date on account_transactions(account_owner, transaction_date);
