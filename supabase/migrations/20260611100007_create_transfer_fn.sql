-- =============================================================================
-- 0007 — RPC create_transfer: tạo 1 lệnh chuyển khoản = 2 dòng transactions
--   (out ở account nguồn, in ở account đích) trong MỘT giao dịch atomic.
--   Kiểm tra quyền sở hữu tại DB (security definer) — không tin client.
-- =============================================================================

create or replace function public.create_transfer(
  p_from_account uuid,
  p_to_account   uuid,
  p_amount       numeric,
  p_occurred_at  timestamptz,
  p_note         text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user        uuid := auth.uid();
  v_transfer_id uuid := gen_random_uuid();
  v_from_user   uuid;
  v_to_user     uuid;
begin
  if v_user is null then
    raise exception 'Chưa đăng nhập';
  end if;
  if p_from_account = p_to_account then
    raise exception 'Tài khoản nguồn và đích phải khác nhau';
  end if;
  if p_amount <= 0 then
    raise exception 'Số tiền phải lớn hơn 0';
  end if;

  select user_id into v_from_user from public.accounts where id = p_from_account;
  select user_id into v_to_user   from public.accounts where id = p_to_account;

  if v_from_user is null or v_to_user is null then
    raise exception 'Tài khoản không tồn tại';
  end if;
  if v_from_user <> v_user or v_to_user <> v_user then
    raise exception 'Tài khoản không thuộc về bạn';
  end if;

  insert into public.transactions
    (user_id, account_id, type, amount, occurred_at, note, transfer_id, transfer_direction)
  values
    (v_user, p_from_account, 'transfer', p_amount, p_occurred_at, p_note, v_transfer_id, 'out'),
    (v_user, p_to_account,   'transfer', p_amount, p_occurred_at, p_note, v_transfer_id, 'in');

  return v_transfer_id;
end;
$$;

grant execute on function public.create_transfer(uuid, uuid, numeric, timestamptz, text) to authenticated;
