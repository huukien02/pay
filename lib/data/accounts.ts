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

export type Account = Database["public"]["Tables"]["accounts"]["Row"]
type AccountInsert = Pick<
  Database["public"]["Tables"]["accounts"]["Insert"],
  "name" | "type" | "currency"
>
type AccountUpdate = Partial<AccountInsert> & { archived?: boolean }

/**
 * Data Access Layer cho accounts. Mọi query Supabase liên quan account nằm ở
 * đây (xem CLAUDE.md). RLS đảm bảo chỉ trả dữ liệu của user hiện tại.
 */
export async function listAccounts(
  supabase: DB,
  params: ListParams = {}
): Promise<Paginated<Account>> {
  const { page, pageSize } = normalizeListParams(params)
  const { from, to } = getRange(page, pageSize)

  const { data, error, count } = await supabase
    .from("accounts")
    .select("*", { count: "exact" })
    .order("archived", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) throw error
  return paginate(data ?? [], count ?? 0, page, pageSize)
}

/** Toàn bộ account (không phân trang) — cho dropdown trong form. */
export async function listAllAccounts(supabase: DB): Promise<Account[]> {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("archived", false)
    .order("name", { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getAccount(
  supabase: DB,
  id: string
): Promise<Account | null> {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function insertAccount(
  supabase: DB,
  userId: string,
  input: AccountInsert
): Promise<Account> {
  const { data, error } = await supabase
    .from("accounts")
    .insert({ ...input, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateAccount(
  supabase: DB,
  id: string,
  input: AccountUpdate
): Promise<Account> {
  const { data, error } = await supabase
    .from("accounts")
    .update(input)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAccount(supabase: DB, id: string): Promise<void> {
  const { error } = await supabase.from("accounts").delete().eq("id", id)
  if (error) throw error
}
