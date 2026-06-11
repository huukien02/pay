"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/core"
import {
  EmptyState,
  ErrorState,
  LoadingState,
  Pagination,
} from "@/components/patterns"
import { CATEGORY_KIND_LABELS, type CategoryKind } from "@/lib/constants"
import { usePagination } from "@/lib/hooks/use-pagination"
import { createClient } from "@/lib/supabase/client"
import { categoriesQueryOptions } from "../queries"
import { DeleteCategoryButton } from "./delete-category-button"
import { EditCategoryDialog } from "./edit-category-dialog"

export function CategoriesView() {
  const supabase = useMemo(() => createClient(), [])
  const { page, pageSize } = usePagination()
  const { data, isPending, isError } = useQuery(
    categoriesQueryOptions(supabase, { page, pageSize })
  )

  if (isPending) return <LoadingState />
  if (isError)
    return <ErrorState description="Không tải được danh sách danh mục." />
  if (data.total === 0) {
    return (
      <EmptyState
        title="Chưa có danh mục"
        description="Thêm danh mục để phân loại thu/chi."
      />
    )
  }

  return (
    <div className="grid gap-3">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">
                  <span className="flex items-center gap-2">
                    <span
                      className="size-3 rounded-full border"
                      style={{ background: category.color ?? "transparent" }}
                    />
                    {category.name}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={category.kind === "income" ? "default" : "secondary"}
                  >
                    {CATEGORY_KIND_LABELS[category.kind as CategoryKind] ??
                      category.kind}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <EditCategoryDialog category={category} />
                    <DeleteCategoryButton
                      id={category.id}
                      name={category.name}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination pageCount={data.pageCount} />
    </div>
  )
}
