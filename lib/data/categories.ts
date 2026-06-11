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

export type Category = Database["public"]["Tables"]["categories"]["Row"]
type CategoryInsert = Pick<
  Database["public"]["Tables"]["categories"]["Insert"],
  "name" | "kind" | "color"
>
type CategoryUpdate = Partial<CategoryInsert>

export async function listCategories(
  supabase: DB,
  params: ListParams = {}
): Promise<Paginated<Category>> {
  const { page, pageSize } = normalizeListParams(params)
  const { from, to } = getRange(page, pageSize)

  const kind = params.filter?.kind as string | undefined

  let query = supabase
    .from("categories")
    .select("*", { count: "exact" })
    .order("kind", { ascending: true })
    .order("name", { ascending: true })
    .range(from, to)

  if (kind) query = query.eq("kind", kind)

  const { data, error, count } = await query
  if (error) throw error
  return paginate(data ?? [], count ?? 0, page, pageSize)
}

/** Lấy toàn bộ category (không phân trang) — dùng cho dropdown trong form. */
export async function listAllCategories(supabase: DB): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function insertCategory(
  supabase: DB,
  userId: string,
  input: CategoryInsert
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert({ ...input, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCategory(
  supabase: DB,
  id: string,
  input: CategoryUpdate
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update(input)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCategory(supabase: DB, id: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) throw error
}
