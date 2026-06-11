import { HydrationBoundary, dehydrate } from "@tanstack/react-query"

import { PageHeader } from "@/components/patterns"
import { CreateTransactionDialog } from "@/features/transactions/components/create-transaction-dialog"
import { TransactionsView } from "@/features/transactions/components/transactions-view"
import { transactionsQueryOptions } from "@/features/transactions/queries"
import { DEFAULT_PAGE_SIZE } from "@/lib/data/types"
import { getQueryClient } from "@/lib/query-client"
import { createClient } from "@/lib/supabase/server"

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string }>
}) {
  const sp = await searchParams
  const params = {
    page: Number(sp.page) || 1,
    pageSize: Number(sp.pageSize) || DEFAULT_PAGE_SIZE,
  }

  const supabase = await createClient()
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(transactionsQueryOptions(supabase, params))

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Giao dịch"
        description="Ghi nhận thu, chi và chuyển khoản."
        actions={<CreateTransactionDialog />}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TransactionsView />
      </HydrationBoundary>
    </div>
  )
}
