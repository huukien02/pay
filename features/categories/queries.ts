import { queryOptions } from "@tanstack/react-query"
import type { SupabaseClient } from "@supabase/supabase-js"

import { listAllCategories, listCategories } from "@/lib/data/categories"
import type { ListParams } from "@/lib/data/types"
import { queryKeys } from "@/lib/query-keys"
import type { Database } from "@/lib/supabase/database.types"

export function categoriesQueryOptions(
  supabase: SupabaseClient<Database>,
  params: ListParams = {}
) {
  return queryOptions({
    queryKey: queryKeys.categories.list(params),
    queryFn: () => listCategories(supabase, params),
  })
}

export function allCategoriesQueryOptions(supabase: SupabaseClient<Database>) {
  return queryOptions({
    queryKey: queryKeys.categories.all,
    queryFn: () => listAllCategories(supabase),
  })
}
