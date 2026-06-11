/**
 * Format trả về DUY NHẤT cho mọi hàm list trong Data Access Layer.
 * Mọi `list()` trong lib/data PHẢI trả `Paginated<T>` (xem CLAUDE.md #9).
 */

export type SortDir = "asc" | "desc"

export interface ListParams {
  page?: number
  pageSize?: number
  sort?: string
  dir?: SortDir
  filter?: Record<string, unknown>
}

export interface Paginated<T> {
  data: T[]
  page: number
  pageSize: number
  total: number
  pageCount: number
}

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

/** Chuẩn hóa page/pageSize về khoảng hợp lệ. */
export function normalizeListParams(params: ListParams = {}) {
  const page = Math.max(1, Math.trunc(params.page ?? 1))
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Math.trunc(params.pageSize ?? DEFAULT_PAGE_SIZE))
  )
  return { ...params, page, pageSize }
}

/** Tính khoảng [from, to] cho Supabase `.range()` từ page/pageSize. */
export function getRange(page: number, pageSize: number) {
  const from = (page - 1) * pageSize
  return { from, to: from + pageSize - 1 }
}

/** Đóng gói kết quả + count (từ Supabase `count: 'exact'`) thành Paginated<T>. */
export function paginate<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): Paginated<T> {
  return {
    data,
    page,
    pageSize,
    total,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  }
}
