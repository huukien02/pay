import { describe, expect, it } from "vitest"

import { formatMoney, parseMoneyInput } from "@/lib/money"

describe("parseMoneyInput", () => {
  it("trả null cho chuỗi rỗng", () => {
    expect(parseMoneyInput("")).toBeNull()
    expect(parseMoneyInput("   ")).toBeNull()
  })

  it("giữ nguyên số đơn giản", () => {
    expect(parseMoneyInput("1000")).toBe("1000")
  })

  it("hiểu định dạng vi-VN (1.000,50)", () => {
    expect(parseMoneyInput("1.000,50")).toBe("1000.50")
  })

  it("hiểu định dạng en-US (1,000.50)", () => {
    expect(parseMoneyInput("1,000.50")).toBe("1000.50")
  })

  it("bỏ ký hiệu tiền tệ", () => {
    expect(parseMoneyInput("1.000.000 ₫")).toBe("1000000")
  })

  it("giữ chính xác phần thập phân lớn", () => {
    expect(parseMoneyInput("12345678.9012")).toBe("12345678.9012")
  })
})

describe("formatMoney", () => {
  it("VND không có phần lẻ và có phân nhóm", () => {
    const out = formatMoney(1000000, "VND")
    expect(out).toContain("1.000.000")
    expect(out).toContain("₫")
    expect(out).not.toContain(",00")
  })

  it("nhận chuỗi decimal", () => {
    expect(formatMoney("50000", "VND")).toContain("50.000")
  })

  it("giá trị không hợp lệ trả em-dash", () => {
    expect(formatMoney("abc")).toBe("—")
  })
})
