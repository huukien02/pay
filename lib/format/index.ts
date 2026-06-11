import { format, parseISO } from "date-fns"

/** Format ngày/giờ + số chung cho UI (vi-VN). Tiền: dùng lib/money. */

function toDate(value: string | number | Date): Date {
  if (value instanceof Date) return value
  if (typeof value === "number") return new Date(value)
  return parseISO(value)
}

export function formatDate(value: string | number | Date, pattern = "dd/MM/yyyy") {
  return format(toDate(value), pattern)
}

export function formatDateTime(value: string | number | Date) {
  return format(toDate(value), "dd/MM/yyyy HH:mm")
}

export function formatNumber(value: number, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("vi-VN", opts).format(value)
}

export function formatPercent(value: number, fractionDigits = 1) {
  return new Intl.NumberFormat("vi-VN", {
    style: "percent",
    maximumFractionDigits: fractionDigits,
  }).format(value)
}
