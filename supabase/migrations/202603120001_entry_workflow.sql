-- Entry workflow status + mismatch review fields
alter table daily_sales_entries
  add column if not exists entry_status text not null default 'open' check (entry_status in ('open', 'submitted', 'locked', 'reopened', 'reviewed')),
  add column if not exists locked_at timestamptz,
  add column if not exists locked_by uuid references users(id),
  add column if not exists reopened_at timestamptz,
  add column if not exists reopened_by uuid references users(id),
  add column if not exists reopen_reason text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references users(id),
  add column if not exists mismatch_resolved_at timestamptz,
  add column if not exists mismatch_resolved_by uuid references users(id),
  add column if not exists mismatch_review_note text;

create index if not exists idx_daily_entries_status on daily_sales_entries(entry_status);
create index if not exists idx_daily_entries_mismatch_unresolved on daily_sales_entries(entry_date) where collection_difference <> 0 and mismatch_resolved_at is null;
