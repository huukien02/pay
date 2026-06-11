-- =============================================================================
-- 0004 — transactions: giao dịch thu / chi / chuyển khoản
--   - amount LUÔN dương (NUMERIC(20,4)); chiều tính theo type.
--   - transfer = 2 dòng cùng transfer_id: 1 dòng direction='out' (account nguồn),
--     1 dòng direction='in' (account đích) -> số dư luôn cân.
-- =============================================================================

create table public.transactions (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users (id) on delete cascade,
  account_id         uuid not null references public.accounts (id) on delete cascade,
  category_id        uuid references public.categories (id) on delete set null,
  type               text not null check (type in ('income', 'expense', 'transfer')),
  amount             numeric(20, 4) not null check (amount > 0),
  currency           text not null default 'VND',
  -- Tỷ giá snapshot về base_currency tại thời điểm giao dịch.
  fx_rate            numeric(20, 8) not null default 1 check (fx_rate > 0),
  occurred_at        timestamptz not null default now(),
  note               text,
  -- Ghép 2 dòng của 1 lệnh chuyển khoản.
  transfer_id        uuid,
  -- Chiều của dòng chuyển khoản; chỉ có khi type='transfer'.
  transfer_direction text check (transfer_direction in ('in', 'out')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  -- transfer <-> transfer_direction phải đi cùng nhau.
  constraint transactions_transfer_direction_ck check (
    (type = 'transfer') = (transfer_direction is not null)
  )
);

create index transactions_user_id_idx on public.transactions (user_id);
create index transactions_account_id_idx on public.transactions (account_id);
create index transactions_occurred_at_idx on public.transactions (occurred_at desc);
create index transactions_transfer_id_idx on public.transactions (transfer_id);

alter table public.transactions enable row level security;

create policy "transactions_select_own"
  on public.transactions for select
  using ((select auth.uid()) = user_id);

create policy "transactions_insert_own"
  on public.transactions for insert
  with check ((select auth.uid()) = user_id);

create policy "transactions_update_own"
  on public.transactions for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "transactions_delete_own"
  on public.transactions for delete
  using ((select auth.uid()) = user_id);

create trigger transactions_set_updated_at
  before update on public.transactions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Bất biến ở DB: account phải thuộc về user, và currency đồng bộ với account.
-- Không tin client — kiểm tra tại nguồn chân lý.
-- ---------------------------------------------------------------------------
create or replace function public.validate_transaction()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  acc_currency text;
  acc_user     uuid;
begin
  select currency, user_id into acc_currency, acc_user
  from public.accounts
  where id = new.account_id;

  if acc_user is null then
    raise exception 'Account % không tồn tại', new.account_id;
  end if;
  if acc_user <> new.user_id then
    raise exception 'Account không thuộc về user';
  end if;

  -- Đồng bộ currency theo account (giao dịch ghi nhận theo tiền của account).
  new.currency := acc_currency;
  return new;
end;
$$;

create trigger transactions_validate
  before insert or update on public.transactions
  for each row execute function public.validate_transaction();
