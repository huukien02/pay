import { z } from "zod"

import { TRANSACTION_TYPES } from "@/lib/constants"
import { parseMoneyInput } from "@/lib/money"

export const transactionFormSchema = z
  .object({
    type: z.enum(TRANSACTION_TYPES),
    amount: z
      .string()
      .min(1, "Vui lòng nhập số tiền")
      .refine((s) => {
        const parsed = parseMoneyInput(s)
        return parsed !== null && Number(parsed) > 0
      }, "Số tiền không hợp lệ"),
    accountId: z.uuid("Vui lòng chọn tài khoản"),
    toAccountId: z.uuid().optional(),
    categoryId: z.uuid().optional(),
    occurredAt: z.string().min(1, "Vui lòng chọn ngày"),
    note: z.string().max(280, "Ghi chú quá dài").optional(),
  })
  .superRefine((val, ctx) => {
    if (val.type === "transfer") {
      if (!val.toAccountId) {
        ctx.addIssue({
          path: ["toAccountId"],
          code: "custom",
          message: "Vui lòng chọn tài khoản đích",
        })
      } else if (val.toAccountId === val.accountId) {
        ctx.addIssue({
          path: ["toAccountId"],
          code: "custom",
          message: "Tài khoản đích phải khác tài khoản nguồn",
        })
      }
    }
  })

export type TransactionFormInput = z.input<typeof transactionFormSchema>

/** Sửa giao dịch — chỉ thu/chi (không sửa chuyển khoản qua form này). */
export const updateTransactionSchema = z.object({
  id: z.uuid(),
  type: z.enum(["income", "expense"]),
  amount: z
    .string()
    .min(1, "Vui lòng nhập số tiền")
    .refine((s) => {
      const parsed = parseMoneyInput(s)
      return parsed !== null && Number(parsed) > 0
    }, "Số tiền không hợp lệ"),
  accountId: z.uuid("Vui lòng chọn tài khoản"),
  categoryId: z.uuid().optional(),
  occurredAt: z.string().min(1, "Vui lòng chọn ngày"),
  note: z.string().max(280, "Ghi chú quá dài").optional(),
})

export type UpdateTransactionInput = z.input<typeof updateTransactionSchema>

export const deleteTransactionSchema = z.object({ id: z.uuid() })
