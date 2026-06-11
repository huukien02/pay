-- =============================================================================
-- 0001 — Nền tảng: hàm tiện ích + profiles + tự tạo profile khi đăng ký
-- =============================================================================

-- Hàm dùng chung: cập nhật updated_at mỗi khi UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles: 1-1 với auth.users. base_currency dùng để quy đổi báo cáo.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  display_name  text not null default '',
  base_currency text not null default 'VND',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Mỗi user chỉ đọc/sửa profile của chính mình. INSERT do trigger (định danh
-- bằng security definer) lo, nên không mở insert policy cho user.
create policy "profiles_select_own"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Tự tạo profile khi có user mới (đăng ký). Lấy display_name từ metadata.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: tạo profile cho các user đã đăng ký TRƯỚC khi có trigger này.
insert into public.profiles (id, display_name)
select id, coalesce(raw_user_meta_data ->> 'display_name', '')
from auth.users
on conflict (id) do nothing;
