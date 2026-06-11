-- =============================================================================
-- 0002 — accounts: tài khoản tiền (nhiều tài khoản, nhiều loại tiền tệ)
-- =============================================================================

create table public.accounts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null check (length(trim(name)) > 0),
  type       text not null check (type in ('cash', 'bank', 'credit', 'savings', 'investment')),
  currency   text not null default 'VND',
  archived   boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index accounts_user_id_idx on public.accounts (user_id);

alter table public.accounts enable row level security;

create policy "accounts_select_own"
  on public.accounts for select
  using ((select auth.uid()) = user_id);

create policy "accounts_insert_own"
  on public.accounts for insert
  with check ((select auth.uid()) = user_id);

create policy "accounts_update_own"
  on public.accounts for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "accounts_delete_own"
  on public.accounts for delete
  using ((select auth.uid()) = user_id);

create trigger accounts_set_updated_at
  before update on public.accounts
  for each row execute function public.set_updated_at();
