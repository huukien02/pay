import { queryOptions } from "@tanstack/react-query"
import type { SupabaseClient } from "@supabase/supabase-js"

import { listBudgetsForMonth } from "@/lib/data/budgets"
import { queryKeys } from "@/lib/query-keys"
import type { Database } from "@/lib/supabase/database.types"

export function budgetsQueryOptions(
  supabase: SupabaseClient<Database>,
  month: string
) {
  return queryOptions({
    queryKey: queryKeys.budgets.list({ filter: { month } }),
    queryFn: () => listBudgetsForMonth(supabase, month),
  })
}
