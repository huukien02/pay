import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/supabase/database.types"

type DB = SupabaseClient<Database>

export type AccountBalance =
  Database["public"]["Views"]["account_balances"]["Row"]
export type MonthlyCashflow =
  Database["public"]["Views"]["monthly_cashflow"]["Row"]
export type CategorySpend =
  Database["public"]["Views"]["category_spend_monthly"]["Row"]

/** Số dư mọi tài khoản (từ view account_balances — RLS xuyên qua view). */
export async function getAccountBalances(
  supabase: DB
): Promise<AccountBalance[]> {
  const { data, error } = await supabase
    .from("account_balances")
    .select("*")
    .order("name", { ascending: true })
  if (error) throw error
  return data ?? []
}

/** Dòng tiền của một tháng (mốc đầu tháng dạng 'YYYY-MM-01'). */
export async function getMonthlyCashflow(
  supabase: DB,
  month: string
): Promise<MonthlyCashflow[]> {
  const { data, error } = await supabase
    .from("monthly_cashflow")
    .select("*")
    .eq("month", month)
  if (error) throw error
  return data ?? []
}

/** Chi tiêu theo danh mục của một tháng (cho biểu đồ + so sánh ngân sách). */
export async function getCategorySpend(
  supabase: DB,
  month: string
): Promise<CategorySpend[]> {
  const { data, error } = await supabase
    .from("category_spend_monthly")
    .select("*")
    .eq("month", month)
    .order("total", { ascending: false })
  if (error) throw error
  return data ?? []
}
