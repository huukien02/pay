"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { DEFAULT_PAGE_SIZE } from "@/lib/data/types"

/**
 * Phân trang đồng bộ với URL searchParams (?page=&pageSize=).
 * KHÔNG dùng local state cho page (xem CLAUDE.md #10) — để RSC prefetch đúng
 * trang, link chia sẻ được, back/forward hoạt động đúng.
 */
export function usePagination(defaultPageSize = DEFAULT_PAGE_SIZE) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const pageSize = Math.max(
    1,
    Number(searchParams.get("pageSize")) || defaultPageSize
  )

  const commit = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      mutate(params)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const setPage = useCallback(
    (next: number) => commit((p) => p.set("page", String(Math.max(1, next)))),
    [commit]
  )

  // Đổi pageSize thì reset về trang 1 để tránh lệch khoảng.
  const setPageSize = useCallback(
    (next: number) =>
      commit((p) => {
        p.set("pageSize", String(Math.max(1, next)))
        p.set("page", "1")
      }),
    [commit]
  )

  return { page, pageSize, setPage, setPageSize }
}
