-- =============================================================================
-- 0003 — categories: danh mục thu/chi (có cha/con)
-- =============================================================================

create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null check (length(trim(name)) > 0),
  kind       text not null check (kind in ('income', 'expense')),
  parent_id  uuid references public.categories (id) on delete set null,
  color      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_user_id_idx on public.categories (user_id);
create index categories_parent_id_idx on public.categories (parent_id);

alter table public.categories enable row level security;

create policy "categories_select_own"
  on public.categories for select
  using ((select auth.uid()) = user_id);

create policy "categories_insert_own"
  on public.categories for insert
  with check ((select auth.uid()) = user_id);

create policy "categories_update_own"
  on public.categories for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "categories_delete_own"
  on public.categories for delete
  using ((select auth.uid()) = user_id);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();
