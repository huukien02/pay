-- =============================================================================
-- 0005 — budgets: ngân sách theo danh mục theo tháng
-- =============================================================================

create table public.budgets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  period      text not null default 'monthly' check (period in ('monthly')),
  -- Mốc đầu tháng (vd 2026-06-01).
  month       date not null,
  amount      numeric(20, 4) not null check (amount >= 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  -- Mỗi danh mục chỉ 1 ngân sách / tháng.
  unique (user_id, category_id, month)
);

create index budgets_user_id_idx on public.budgets (user_id);
create index budgets_month_idx on public.budgets (month);

alter table public.budgets enable row level security;

create policy "budgets_select_own"
  on public.budgets for select
  using ((select auth.uid()) = user_id);

create policy "budgets_insert_own"
  on public.budgets for insert
  with check ((select auth.uid()) = user_id);

create policy "budgets_update_own"
  on public.budgets for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "budgets_delete_own"
  on public.budgets for delete
  using ((select auth.uid()) = user_id);

create trigger budgets_set_updated_at
  before update on public.budgets
  for each row execute function public.set_updated_at();
