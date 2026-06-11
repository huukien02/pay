-- =============================================================================
-- 0006 — Views báo cáo. security_invoker = on để RLS của bảng gốc được áp dụng
--   (mỗi user chỉ thấy dữ liệu của mình qua view).
-- =============================================================================

-- Số dư mỗi tài khoản — tính TỪ transactions, KHÔNG lưu cột stored.
--   income            -> +amount
--   expense           -> -amount
--   transfer (out)    -> -amount   (rời account nguồn)
--   transfer (in)     -> +amount   (vào account đích)
create view public.account_balances
with (security_invoker = on) as
select
  a.id        as account_id,
  a.user_id,
  a.name,
  a.currency,
  a.archived,
  coalesce(
    sum(
      case
        when t.type = 'income' then t.amount
        when t.type = 'expense' then -t.amount
        when t.type = 'transfer' and t.transfer_direction = 'in' then t.amount
        when t.type = 'transfer' and t.transfer_direction = 'out' then -t.amount
        else 0
      end
    ),
    0
  ) as balance
from public.accounts a
left join public.transactions t on t.account_id = a.id
group by a.id, a.user_id, a.name, a.currency, a.archived;

-- Dòng tiền thu/chi theo tháng (không tính transfer — chỉ là dịch chuyển nội bộ).
create view public.monthly_cashflow
with (security_invoker = on) as
select
  user_id,
  date_trunc('month', occurred_at)::date as month,
  currency,
  sum(case when type = 'income' then amount else 0 end)  as income,
  sum(case when type = 'expense' then amount else 0 end) as expense
from public.transactions
group by user_id, date_trunc('month', occurred_at), currency;
