import { HydrationBoundary, dehydrate } from "@tanstack/react-query"

import { PageHeader } from "@/components/patterns"
import { CategoriesView } from "@/features/categories/components/categories-view"
import { CreateCategoryDialog } from "@/features/categories/components/create-category-dialog"
import { categoriesQueryOptions } from "@/features/categories/queries"
import { DEFAULT_PAGE_SIZE } from "@/lib/data/types"
import { getQueryClient } from "@/lib/query-client"
import { createClient } from "@/lib/supabase/server"

export default async function CategoriesPage({
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
  await queryClient.prefetchQuery(categoriesQueryOptions(supabase, params))

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Danh mục"
        description="Phân loại các khoản thu/chi."
        actions={<CreateCategoryDialog />}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CategoriesView />
      </HydrationBoundary>
    </div>
  )
}
