import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/supabase/database.types"
import {
  getRange,
  normalizeListParams,
  paginate,
  type ListParams,
  type Paginated,
} from "./types"

type DB = SupabaseClient<Database>

export type Transaction = Database["public"]["Tables"]["transactions"]["Row"]

/** Dòng giao dịch kèm tên account/category (join) cho hiển thị danh sách. */
export type TransactionListItem = Transaction & {
  account: { name: string } | null
  category: { name: string } | null
}

const LIST_SELECT = "*, account:accounts(name), category:categories(name)"

export async function listTransactions(
  supabase: DB,
  params: ListParams = {}
): Promise<Paginated<TransactionListItem>> {
  const { page, pageSize } = normalizeListParams(params)
  const { from, to } = getRange(page, pageSize)

  let query = supabase
    .from("transactions")
    .select(LIST_SELECT, { count: "exact" })
    .order("occurred_at", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to)

  const accountId = params.filter?.accountId as string | undefined
  const type = params.filter?.type as string | undefined
  const month = params.filter?.month as string | undefined // "YYYY-MM"
  const day = params.filter?.day as string | undefined // "YYYY-MM-DD"
  if (accountId) query = query.eq("account_id", accountId)
  if (type) query = query.eq("type", type)
  // `day` ưu tiên hơn `month` (lọc hẹp hơn). occurred_at trong [day, day+1).
  if (day) {
    const [y, m, d] = day.split("-").map(Number)
    const next = new Date(y, m - 1, d + 1)
    const end = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(next.getDate()).padStart(2, "0")}`
    query = query.gte("occurred_at", day).lt("occurred_at", end)
  } else if (month) {
    const [y, m] = month.split("-").map(Number)
    const start = `${month}-01`
    const endY = m === 12 ? y + 1 : y
    const endM = m === 12 ? 1 : m + 1
    const end = `${endY}-${String(endM).padStart(2, "0")}-01`
    query = query.gte("occurred_at", start).lt("occurred_at", end)
  }

  const { data, error, count } = await query
  if (error) throw error
  return paginate(
    (data ?? []) as unknown as TransactionListItem[],
    count ?? 0,
    page,
    pageSize
  )
}

/** Thu/chi: 1 dòng. amount truyền dạng CHUỖI decimal để giữ chính xác. */
export async function insertIncomeExpense(
  supabase: DB,
  userId: string,
  input: {
    accountId: string
    categoryId: string | null
    type: "income" | "expense"
    amount: string
    occurredAt: string
    note: string | null
  }
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      account_id: input.accountId,
      category_id: input.categoryId,
      type: input.type,
      // Cột numeric được gen thành `number`, nhưng gửi CHUỖI để giữ chính xác
      // (PostgREST cast text -> numeric). Tránh đưa tiền qua number của JS.
      amount: input.amount as unknown as number,
      occurred_at: input.occurredAt,
      note: input.note,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

/** Chuyển khoản: gọi RPC atomic (2 dòng out/in trong 1 transaction). */
export async function createTransfer(
  supabase: DB,
  input: {
    fromAccount: string
    toAccount: string
    amount: number
    occurredAt: string
    note: string | null
  }
): Promise<string> {
  const { data, error } = await supabase.rpc("create_transfer", {
    p_from_account: input.fromAccount,
    p_to_account: input.toAccount,
    p_amount: input.amount,
    p_occurred_at: input.occurredAt,
    // Arg `text` chấp nhận null ở runtime; type gen không mã hóa nullable.
    p_note: input.note as string,
  })
  if (error) throw error
  return data as string
}

/** Sửa giao dịch thu/chi (1 dòng). Không dùng cho chuyển khoản. */
export async function updateTransaction(
  supabase: DB,
  id: string,
  input: {
    accountId: string
    categoryId: string | null
    type: "income" | "expense"
    amount: string
    occurredAt: string
    note: string | null
  }
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .update({
      account_id: input.accountId,
      category_id: input.categoryId,
      type: input.type,
      amount: input.amount as unknown as number,
      occurred_at: input.occurredAt,
      note: input.note,
    })
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Xóa giao dịch. Nếu là chuyển khoản, xóa cả 2 dòng cùng transfer_id. */
export async function deleteTransaction(
  supabase: DB,
  id: string
): Promise<void> {
  const { data: row, error: fetchErr } = await supabase
    .from("transactions")
    .select("id, transfer_id")
    .eq("id", id)
    .maybeSingle()
  if (fetchErr) throw fetchErr
  if (!row) return

  if (row.transfer_id) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("transfer_id", row.transfer_id)
    if (error) throw error
    return
  }

  const { error } = await supabase.from("transactions").delete().eq("id", id)
  if (error) throw error
}
