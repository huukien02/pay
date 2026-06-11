import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/supabase/database.types"

type DB = SupabaseClient<Database>

export interface BudgetWithActual {
  id: string
  categoryId: string
  categoryName: string
  month: string
  /** Ngân sách (số). Tiền hiển thị, không tính toán JS. */
  amount: number
  /** Thực chi trong tháng (từ category_spend_monthly). */
  spent: number
}

/** Danh sách ngân sách của một tháng kèm thực chi (merge với view). */
export async function listBudgetsForMonth(
  supabase: DB,
  month: string
): Promise<BudgetWithActual[]> {
  const [budgetsRes, spendRes] = await Promise.all([
    supabase
      .from("budgets")
      .select("id, category_id, month, amount, category:categories(name)")
      .eq("month", month),
    supabase
      .from("category_spend_monthly")
      .select("category_id, total")
      .eq("month", month),
  ])

  if (budgetsRes.error) throw budgetsRes.error
  if (spendRes.error) throw spendRes.error

  const spentByCategory = new Map<string, number>()
  for (const s of spendRes.data ?? []) {
    if (s.category_id) spentByCategory.set(s.category_id, Number(s.total ?? 0))
  }

  return (budgetsRes.data ?? []).map((b) => ({
    id: b.id,
    categoryId: b.category_id,
    categoryName: b.category?.name ?? "—",
    month: b.month,
    amount: Number(b.amount ?? 0),
    spent: spentByCategory.get(b.category_id) ?? 0,
  }))
}

/** Đặt/cập nhật ngân sách (upsert theo unique user_id+category_id+month). */
export async function upsertBudget(
  supabase: DB,
  userId: string,
  input: { categoryId: string; month: string; amount: string }
): Promise<void> {
  const { error } = await supabase.from("budgets").upsert(
    {
      user_id: userId,
      category_id: input.categoryId,
      month: input.month,
      // gửi chuỗi -> numeric để giữ chính xác
      amount: input.amount as unknown as number,
    },
    { onConflict: "user_id,category_id,month" }
  )
  if (error) throw error
}

export async function deleteBudget(supabase: DB, id: string): Promise<void> {
  const { error } = await supabase.from("budgets").delete().eq("id", id)
  if (error) throw error
}
