import { HydrationBoundary, dehydrate } from "@tanstack/react-query"

import { PageHeader } from "@/components/patterns"
import { BudgetsView } from "@/features/budgets/components/budgets-view"
import { SetBudgetDialog } from "@/features/budgets/components/set-budget-dialog"
import { budgetsQueryOptions } from "@/features/budgets/queries"
import { getQueryClient } from "@/lib/query-client"
import { createClient } from "@/lib/supabase/server"

export default async function BudgetsPage() {
  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-01`

  const supabase = await createClient()
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(budgetsQueryOptions(supabase, month))

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Ngân sách"
        description="Theo dõi chi tiêu so với hạn mức tháng này."
        actions={<SetBudgetDialog month={month} />}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BudgetsView month={month} />
      </HydrationBoundary>
    </div>
  )
}
