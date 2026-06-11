import { z } from "zod"

import { parseMoneyInput } from "@/lib/money"

export const budgetFormSchema = z.object({
  categoryId: z.uuid("Vui lòng chọn danh mục"),
  month: z.string().min(1, "Vui lòng chọn tháng"),
  amount: z
    .string()
    .min(1, "Vui lòng nhập số tiền")
    .refine((s) => {
      const parsed = parseMoneyInput(s)
      return parsed !== null && Number(parsed) >= 0
    }, "Số tiền không hợp lệ"),
})

export type BudgetFormInput = z.input<typeof budgetFormSchema>

export const deleteBudgetSchema = z.object({ id: z.uuid() })
