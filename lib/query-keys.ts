import type { ListParams } from "@/lib/data/types"

/**
 * Query key factory tập trung. KHÔNG viết magic-string key inline ở feature.
 * Key của list PHẢI gồm params { page, pageSize, sort, filter } để cache/invalidate
 * đúng theo trang (xem CLAUDE.md #10).
 */
export const queryKeys = {
  accounts: {
    all: ["accounts"] as const,
    list: (params: ListParams = {}) => ["accounts", "list", params] as const,
    detail: (id: string) => ["accounts", "detail", id] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: (params: ListParams = {}) => ["categories", "list", params] as const,
    detail: (id: string) => ["categories", "detail", id] as const,
  },
  transactions: {
    all: ["transactions"] as const,
    list: (params: ListParams = {}) => ["transactions", "list", params] as const,
    detail: (id: string) => ["transactions", "detail", id] as const,
  },
  budgets: {
    all: ["budgets"] as const,
    list: (params: ListParams = {}) => ["budgets", "list", params] as const,
    detail: (id: string) => ["budgets", "detail", id] as const,
  },
} as const
