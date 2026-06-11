/**
 * Enums dùng chung cho Zod schema + UI (SelectField options...).
 * Một nguồn chân lý — đừng khai báo lại literal ở chỗ khác.
 */

export const TRANSACTION_TYPES = ["income", "expense", "transfer"] as const
export type TransactionType = (typeof TRANSACTION_TYPES)[number]

export const ACCOUNT_TYPES = [
  "cash",
  "bank",
  "credit",
  "savings",
  "investment",
] as const
export type AccountType = (typeof ACCOUNT_TYPES)[number]

export const CATEGORY_KINDS = ["income", "expense"] as const
export type CategoryKind = (typeof CATEGORY_KINDS)[number]

/** Nhãn tiếng Việt cho UI. */
export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  income: "Thu",
  expense: "Chi",
  transfer: "Chuyển khoản",
}

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  cash: "Tiền mặt",
  bank: "Ngân hàng",
  credit: "Thẻ tín dụng",
  savings: "Tiết kiệm",
  investment: "Đầu tư",
}

export const CATEGORY_KIND_LABELS: Record<CategoryKind, string> = {
  income: "Thu",
  expense: "Chi",
}

/** Tiền tệ hỗ trợ. Hiện chỉ VND (multi-currency để Sprint 4). */
export const SUPPORTED_CURRENCIES = ["VND"] as const
export type Currency = (typeof SUPPORTED_CURRENCIES)[number]
export const DEFAULT_CURRENCY: Currency = "VND"

/** Tiện ích đổi enum -> options cho SelectField. */
export function toOptions<T extends string>(
  values: readonly T[],
  labels: Record<T, string>
) {
  return values.map((value) => ({ value, label: labels[value] }))
}
