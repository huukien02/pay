import { queryOptions } from "@tanstack/react-query"
import type { SupabaseClient } from "@supabase/supabase-js"

import { listAccounts, listAllAccounts } from "@/lib/data/accounts"
import type { ListParams } from "@/lib/data/types"
import { queryKeys } from "@/lib/query-keys"
import type { Database } from "@/lib/supabase/database.types"

/**
 * queryOptions dùng chung cho cả RSC prefetch (server client) và client useQuery
 * (browser client). Cùng queryKey -> hydration khớp (Pattern C).
 */
export function accountsQueryOptions(
  supabase: SupabaseClient<Database>,
  params: ListParams = {}
) {
  return queryOptions({
    queryKey: queryKeys.accounts.list(params),
    queryFn: () => listAccounts(supabase, params),
  })
}

export function allAccountsQueryOptions(supabase: SupabaseClient<Database>) {
  return queryOptions({
    queryKey: queryKeys.accounts.all,
    queryFn: () => listAllAccounts(supabase),
  })
}
