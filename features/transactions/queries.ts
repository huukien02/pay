import { queryOptions } from "@tanstack/react-query"
import type { SupabaseClient } from "@supabase/supabase-js"

import { listTransactions } from "@/lib/data/transactions"
import type { ListParams } from "@/lib/data/types"
import { queryKeys } from "@/lib/query-keys"
import type { Database } from "@/lib/supabase/database.types"

export function transactionsQueryOptions(
  supabase: SupabaseClient<Database>,
  params: ListParams = {}
) {
  return queryOptions({
    queryKey: queryKeys.transactions.list(params),
    queryFn: () => listTransactions(supabase, params),
  })
}
