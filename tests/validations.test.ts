import { describe, expect, it } from "vitest"

import { accountFormSchema } from "@/lib/validations/account"
import { transactionFormSchema } from "@/lib/validations/transaction"

describe("accountFormSchema", () => {
  it("áp default currency = VND", () => {
    const parsed = accountFormSchema.parse({ name: "Ví", type: "cash" })
    expect(parsed.currency).toBe("VND")
  })

  it("từ chối type lạ", () => {
    expect(
      accountFormSchema.safeParse({ name: "Ví", type: "crypto" }).success
    ).toBe(false)
  })

  it("từ chối tên rỗng", () => {
    expect(
      accountFormSchema.safeParse({ name: "", type: "cash" }).success
    ).toBe(false)
  })
})

describe("transactionFormSchema (superRefine)", () => {
  const base = {
    amount: "1000",
    accountId: "11111111-1111-4111-8111-111111111111",
    occurredAt: "2026-06-11",
  }

  it("thu/chi hợp lệ", () => {
    expect(
      transactionFormSchema.safeParse({ ...base, type: "expense" }).success
    ).toBe(true)
  })

  it("chuyển khoản thiếu tài khoản đích -> lỗi", () => {
    const res = transactionFormSchema.safeParse({ ...base, type: "transfer" })
    expect(res.success).toBe(false)
  })

  it("chuyển khoản đích trùng nguồn -> lỗi", () => {
    const res = transactionFormSchema.safeParse({
      ...base,
      type: "transfer",
      toAccountId: base.accountId,
    })
    expect(res.success).toBe(false)
  })

  it("chuyển khoản hợp lệ giữa 2 tài khoản khác nhau", () => {
    const res = transactionFormSchema.safeParse({
      ...base,
      type: "transfer",
      toAccountId: "22222222-2222-4222-8222-222222222222",
    })
    expect(res.success).toBe(true)
  })

  it("số tiền <= 0 -> lỗi", () => {
    expect(
      transactionFormSchema.safeParse({ ...base, amount: "0", type: "expense" })
        .success
    ).toBe(false)
  })
})
