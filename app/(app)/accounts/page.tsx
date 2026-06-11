import { HydrationBoundary, dehydrate } from "@tanstack/react-query"

import { PageHeader } from "@/components/patterns"
import { AccountsView } from "@/features/accounts/components/accounts-view"
import { CreateAccountDialog } from "@/features/accounts/components/create-account-dialog"
import { accountsQueryOptions } from "@/features/accounts/queries"
import { DEFAULT_PAGE_SIZE } from "@/lib/data/types"
import { getQueryClient } from "@/lib/query-client"
import { createClient } from "@/lib/supabase/server"

export default async function AccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string }>
}) {
  const sp = await searchParams
  const params = {
    page: Number(sp.page) || 1,
    pageSize: Number(sp.pageSize) || DEFAULT_PAGE_SIZE,
  }

  // RSC prefetch (server client, RLS theo cookie) -> hydrate cho client.
  const supabase = await createClient()
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(accountsQueryOptions(supabase, params))

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Tài khoản"
        description="Quản lý các tài khoản tiền của bạn."
        actions={<CreateAccountDialog />}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AccountsView />
      </HydrationBoundary>
    </div>
  )
}
