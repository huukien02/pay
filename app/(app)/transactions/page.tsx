import { HydrationBoundary, dehydrate } from "@tanstack/react-query"

import { PageHeader } from "@/components/patterns"
import { CreateTransactionDialog } from "@/features/transactions/components/create-transaction-dialog"
import { MonthFilter } from "@/features/transactions/components/month-filter"
import { TransactionsView } from "@/features/transactions/components/transactions-view"
import { transactionsQueryOptions } from "@/features/transactions/queries"
import { DEFAULT_PAGE_SIZE } from "@/lib/data/types"
import { getQueryClient } from "@/lib/query-client"
import { createClient } from "@/lib/supabase/server"

function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; month?: string }>
}) {
  const sp = await searchParams
  const month = sp.month ?? currentMonth()
  const params = {
    page: Number(sp.page) || 1,
    pageSize: Number(sp.pageSize) || DEFAULT_PAGE_SIZE,
    filter: { month },
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
      <MonthFilter />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TransactionsView month={month} />
      </HydrationBoundary>
    </div>
  )
}
