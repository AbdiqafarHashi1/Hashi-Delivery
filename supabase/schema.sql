-- Beirut Side Sales Ledger schema
create extension if not exists "pgcrypto";

create type app_role as enum ('admin', 'data_entry');
create type allocation_target as enum ('restaurant_share', 'partner_share');
create type account_type as enum ('cash', 'mpesa');

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  full_name text not null,
  email text unique not null,
  role app_role not null default 'data_entry',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  selling_price numeric(12,2) not null check (selling_price >= 0),
  unit_cost numeric(12,2) not null check (unit_cost >= 0),
  seller_commission numeric(12,2) not null check (seller_commission >= 0),
  is_active boolean not null default true,
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists daily_sales_entries (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null,
  seller_user_id uuid not null references users(id),
  cash_received numeric(12,2) not null default 0,
  mpesa_received numeric(12,2) not null default 0,
  total_sales numeric(12,2) not null default 0,
  sadio_cut numeric(12,2) not null default 0,
  post_commission_pool numeric(12,2) not null default 0,
  restaurant_gross_share numeric(12,2) not null default 0,
  partner_gross_share numeric(12,2) not null default 0,
  total_cogs numeric(12,2) not null default 0,
  restaurant_net_share numeric(12,2) not null default 0,
  partner_final_share numeric(12,2) not null default 0,
  handover_amount numeric(12,2) not null default 0,
  collection_difference numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(entry_date, seller_user_id)
);

create table if not exists daily_sales_entry_items (
  id uuid primary key default gen_random_uuid(),
  daily_sales_entry_id uuid not null references daily_sales_entries(id) on delete cascade,
  item_id uuid references items(id),
  quantity integer not null check (quantity >= 0),
  item_name_snapshot text not null,
  selling_price_snapshot numeric(12,2) not null,
  unit_cost_snapshot numeric(12,2) not null,
  commission_snapshot numeric(12,2) not null,
  line_total_sales numeric(12,2) generated always as (quantity * selling_price_snapshot) stored,
  line_total_commission numeric(12,2) generated always as (quantity * commission_snapshot) stored,
  line_total_cogs numeric(12,2) generated always as (quantity * unit_cost_snapshot) stored,
  created_at timestamptz not null default now()
);

create table if not exists allocations (
  id uuid primary key default gen_random_uuid(),
  daily_sales_entry_id uuid not null references daily_sales_entries(id) on delete cascade,
  allocation_date date not null,
  allocation_target allocation_target not null,
  amount numeric(12,2) not null check (amount >= 0),
  notes text,
  created_by uuid not null references users(id),
  created_at timestamptz not null default now()
);

create table if not exists restaurant_share_expenses (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null,
  category text not null,
  description text,
  amount numeric(12,2) not null check (amount >= 0),
  created_by uuid not null references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists account_transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_date date not null,
  account account_type not null,
  amount numeric(12,2) not null,
  direction text not null check (direction in ('inflow', 'outflow', 'adjustment')),
  source_type text not null,
  source_id uuid,
  notes text,
  created_by uuid not null references users(id),
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  event_at timestamptz not null default now(),
  actor_user_id uuid references users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  notes text
);

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function app_current_user_id()
returns uuid
language sql
stable
as $$
  select u.id from users u where u.auth_user_id = auth.uid() limit 1;
$$;

create or replace function app_is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from users u
    where u.auth_user_id = auth.uid()
      and u.role = 'admin'
      and u.is_active = true
  );
$$;

create or replace function app_is_data_entry()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from users u
    where u.auth_user_id = auth.uid()
      and u.role = 'data_entry'
      and u.is_active = true
  );
$$;

create or replace function app_log_audit(
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_before jsonb,
  p_after jsonb,
  p_notes text default null
)
returns void
language plpgsql
security definer
as $$
begin
  insert into audit_logs (actor_user_id, action, entity_type, entity_id, before_data, after_data, notes)
  values (app_current_user_id(), p_action, p_entity_type, p_entity_id, p_before, p_after, p_notes);
end;
$$;

create or replace function audit_items_changes()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    perform app_log_audit('item.create', 'items', new.id, null, to_jsonb(new), 'item create');
    return new;
  elsif tg_op = 'UPDATE' then
    perform app_log_audit('item.update', 'items', new.id, to_jsonb(old), to_jsonb(new), 'item update');
    return new;
  end if;
  return null;
end;
$$;

create or replace function audit_user_role_change()
returns trigger
language plpgsql
as $$
begin
  if old.role is distinct from new.role then
    perform app_log_audit('user.role_change', 'users', new.id, to_jsonb(old), to_jsonb(new), 'user role changes');
  end if;
  return new;
end;
$$;

create or replace function audit_daily_entry_edit()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' then
    perform app_log_audit('daily_entry.edit', 'daily_sales_entries', new.id, to_jsonb(old), to_jsonb(new), 'daily entry edits');
  end if;
  return new;
end;
$$;

create or replace function audit_restaurant_expense_changes()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    perform app_log_audit('restaurant_share_expense.create', 'restaurant_share_expenses', new.id, null, to_jsonb(new), 'expense creation');
    return new;
  elsif tg_op = 'UPDATE' then
    perform app_log_audit('restaurant_share_expense.edit', 'restaurant_share_expenses', new.id, to_jsonb(old), to_jsonb(new), 'restaurant-share expense edits');
    return new;
  end if;
  return null;
end;
$$;

create or replace function audit_account_adjustment_changes()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    perform app_log_audit('account.adjustment', 'account_transactions', new.id, null, to_jsonb(new), 'account adjustments');
    return new;
  elsif tg_op = 'UPDATE' then
    perform app_log_audit('account.adjustment.edit', 'account_transactions', new.id, to_jsonb(old), to_jsonb(new), 'account adjustments');
    return new;
  end if;
  return null;
end;
$$;

drop trigger if exists users_updated_at on users;
drop trigger if exists items_updated_at on items;
drop trigger if exists entries_updated_at on daily_sales_entries;
drop trigger if exists expenses_updated_at on restaurant_share_expenses;
drop trigger if exists items_audit_trigger on items;
drop trigger if exists users_role_audit_trigger on users;
drop trigger if exists daily_entries_audit_trigger on daily_sales_entries;
drop trigger if exists restaurant_expenses_audit_trigger on restaurant_share_expenses;
drop trigger if exists account_adjustments_audit_trigger on account_transactions;

create trigger users_updated_at before update on users for each row execute function update_updated_at_column();
create trigger items_updated_at before update on items for each row execute function update_updated_at_column();
create trigger entries_updated_at before update on daily_sales_entries for each row execute function update_updated_at_column();
create trigger expenses_updated_at before update on restaurant_share_expenses for each row execute function update_updated_at_column();

create trigger items_audit_trigger after insert or update on items for each row execute function audit_items_changes();
create trigger users_role_audit_trigger after update on users for each row execute function audit_user_role_change();
create trigger daily_entries_audit_trigger after update on daily_sales_entries for each row execute function audit_daily_entry_edit();
create trigger restaurant_expenses_audit_trigger after insert or update on restaurant_share_expenses for each row execute function audit_restaurant_expense_changes();
create trigger account_adjustments_audit_trigger after insert or update on account_transactions for each row execute function audit_account_adjustment_changes();

create or replace view v_restaurant_share_balance as
select
  coalesce(sum(dse.restaurant_net_share), 0)::numeric(12,2) as restaurant_net_allocations,
  coalesce((select sum(amount) from restaurant_share_expenses), 0)::numeric(12,2) as restaurant_share_expenses,
  (coalesce(sum(dse.restaurant_net_share), 0) - coalesce((select sum(amount) from restaurant_share_expenses), 0))::numeric(12,2) as restaurant_share_balance
from daily_sales_entries dse;

create or replace view v_seller_items as
select id, name, selling_price, seller_commission, is_active
from items
where is_active = true;

alter table users enable row level security;
alter table items enable row level security;
alter table daily_sales_entries enable row level security;
alter table daily_sales_entry_items enable row level security;
alter table allocations enable row level security;
alter table restaurant_share_expenses enable row level security;
alter table account_transactions enable row level security;
alter table audit_logs enable row level security;

-- RLS Policies

drop policy if exists "users_self_or_admin_select" on users;
drop policy if exists "users_admin_update" on users;
drop policy if exists "items_admin_full_access" on items;
drop policy if exists "entries_admin_select" on daily_sales_entries;
drop policy if exists "entries_seller_own_select" on daily_sales_entries;
drop policy if exists "entries_seller_insert" on daily_sales_entries;
drop policy if exists "entries_seller_update_own" on daily_sales_entries;
drop policy if exists "entry_items_admin_select" on daily_sales_entry_items;
drop policy if exists "entry_items_seller_own_select" on daily_sales_entry_items;
drop policy if exists "allocations_admin_full" on allocations;
drop policy if exists "expenses_admin_full" on restaurant_share_expenses;
drop policy if exists "accounts_admin_full" on account_transactions;
drop policy if exists "audit_admin_select" on audit_logs;

create policy "users_self_or_admin_select" on users
for select using (auth.uid() = auth_user_id or app_is_admin());

create policy "users_admin_update" on users
for update using (app_is_admin()) with check (app_is_admin());

create policy "items_admin_full_access" on items
for all using (app_is_admin()) with check (app_is_admin());

create policy "entries_admin_select" on daily_sales_entries
for select using (app_is_admin());

create policy "entries_seller_own_select" on daily_sales_entries
for select using (seller_user_id = app_current_user_id());

create policy "entries_seller_insert" on daily_sales_entries
for insert with check (app_is_data_entry() and seller_user_id = app_current_user_id());

create policy "entries_seller_update_own" on daily_sales_entries
for update using (seller_user_id = app_current_user_id()) with check (seller_user_id = app_current_user_id());

create policy "entry_items_admin_select" on daily_sales_entry_items
for select using (app_is_admin());

create policy "entry_items_seller_own_select" on daily_sales_entry_items
for select using (
  exists (
    select 1
    from daily_sales_entries dse
    where dse.id = daily_sales_entry_items.daily_sales_entry_id
      and dse.seller_user_id = app_current_user_id()
  )
);

create policy "allocations_admin_full" on allocations
for all using (app_is_admin()) with check (app_is_admin());

create policy "expenses_admin_full" on restaurant_share_expenses
for all using (app_is_admin()) with check (app_is_admin());

create policy "accounts_admin_full" on account_transactions
for all using (app_is_admin()) with check (app_is_admin());

create policy "audit_admin_select" on audit_logs
for select using (app_is_admin());

revoke all on items from anon, authenticated;
grant select on v_seller_items to authenticated;
