import { DEFAULT_CURRENCY, type Currency } from "@/lib/constants"

/**
 * Tiện ích TIỀN. Nguyên tắc: KHÔNG tính toán số học tiền bằng JS `number`
 * (xem CLAUDE.md Luật vàng #1) — mọi phép cộng/trừ số dư làm ở Postgres.
 * Module này chỉ lo FORMAT (hiển thị) và PARSE (input -> chuỗi decimal chuẩn).
 *
 * DB lưu NUMERIC(20,4); Supabase trả về dạng string -> giữ string khi truyền tải,
 * chỉ ép sang number ở biên hiển thị.
 */

/** Format số tiền sang chuỗi tiền tệ vi-VN. amount: string | number (decimal). */
export function formatMoney(
  amount: string | number,
  currency: Currency | string = DEFAULT_CURRENCY
): string {
  const value = typeof amount === "string" ? Number(amount) : amount
  if (!Number.isFinite(value)) return "—"
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    // VND không có phần lẻ; ngoại tệ giữ 2 số lẻ.
    maximumFractionDigits: currency === "VND" ? 0 : 2,
  }).format(value)
}

/**
 * Chuẩn hóa input người dùng ("1.000,50" / "1000.5" / "1,000.50") về chuỗi
 * decimal chuẩn để gửi lên server ("1000.50"). Trả null nếu không hợp lệ.
 */
export function parseMoneyInput(input: string): string | null {
  const raw = input.trim()
  if (!raw) return null

  const cleaned = raw.replace(/[^\d.,-]/g, "")
  if (!cleaned || cleaned === "-") return null

  const dots = (cleaned.match(/\./g) ?? []).length
  const commas = (cleaned.match(/,/g) ?? []).length

  // Xác định dấu thập phân (nếu có):
  //  - cả '.' và ',' xuất hiện -> dấu thập phân = ký tự xuất hiện SAU cùng
  //  - chỉ một loại, xuất hiện đúng 1 lần, KHÔNG phải nhóm 3 chữ số -> thập phân
  //  - còn lại (nhiều dấu cùng loại / nhóm 3 số) -> chỉ là ngăn nghìn
  let decimalSep: "." | "," | null = null
  if (dots > 0 && commas > 0) {
    decimalSep = cleaned.lastIndexOf(".") > cleaned.lastIndexOf(",") ? "." : ","
  } else if (dots === 1 && commas === 0) {
    decimalSep = /\.\d{3}$/.test(cleaned) ? null : "."
  } else if (commas === 1 && dots === 0) {
    decimalSep = /,\d{3}$/.test(cleaned) ? null : ","
  }

  let normalized: string
  if (!decimalSep) {
    normalized = cleaned.replace(/[.,]/g, "")
  } else {
    const sepIndex = cleaned.lastIndexOf(decimalSep)
    const intPart = cleaned.slice(0, sepIndex).replace(/[.,]/g, "")
    const fracPart = cleaned.slice(sepIndex + 1).replace(/[.,]/g, "")
    normalized = `${intPart}.${fracPart}`
  }

  const value = Number(normalized)
  if (!Number.isFinite(value)) return null
  return normalized
}
