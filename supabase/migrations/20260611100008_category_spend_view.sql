-- =============================================================================
-- 0008 — View tổng hợp chi tiêu theo danh mục theo tháng.
--   Dùng cho biểu đồ dashboard + so sánh ngân sách (budgets).
--   security_invoker = on -> RLS của transactions/categories được áp dụng.
-- =============================================================================

create view public.category_spend_monthly
with (security_invoker = on) as
select
  t.user_id,
  date_trunc('month', t.occurred_at)::date as month,
  t.category_id,
  c.name  as category_name,
  c.color as category_color,
  sum(t.amount) as total
from public.transactions t
left join public.categories c on c.id = t.category_id
where t.type = 'expense'
group by
  t.user_id,
  date_trunc('month', t.occurred_at),
  t.category_id,
  c.name,
  c.color;
