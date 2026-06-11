"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/core"
import { usePagination } from "@/lib/hooks/use-pagination"
import { cn } from "@/lib/utils"

/**
 * Phân trang dùng chung — state nằm trong URL (?page=) qua usePagination.
 * Truyền `pageCount` (lấy từ Paginated<T>.pageCount). Ẩn khi chỉ 1 trang.
 */
export function Pagination({
  pageCount,
  className,
}: {
  pageCount: number
  className?: string
}) {
  const { page, setPage } = usePagination()

  if (pageCount <= 1) return null

  return (
    <div
      className={cn("flex items-center justify-between gap-2 pt-2", className)}
    >
      <span className="text-muted-foreground text-sm tabular-nums">
        Trang {Math.min(page, pageCount)} / {pageCount}
      </span>
      <div className="flex gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          <ChevronLeft />
          Trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= pageCount}
          onClick={() => setPage(page + 1)}
        >
          Sau
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
