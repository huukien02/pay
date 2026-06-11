"use server"

import { revalidatePath } from "next/cache"

import { deleteBudget, upsertBudget } from "@/lib/data/budgets"
import { parseMoneyInput } from "@/lib/money"
import { ActionError, authActionClient } from "@/lib/safe-action"
import { budgetFormSchema, deleteBudgetSchema } from "@/lib/validations/budget"

export const setBudgetAction = authActionClient
  .inputSchema(budgetFormSchema)
  .action(async ({ parsedInput, ctx }) => {
    const amount = parseMoneyInput(parsedInput.amount)
    if (amount === null) throw new ActionError("Số tiền không hợp lệ")

    await upsertBudget(ctx.supabase, ctx.user.id, {
      categoryId: parsedInput.categoryId,
      month: parsedInput.month,
      amount,
    })
    revalidatePath("/budgets")
    return { ok: true as const }
  })

export const deleteBudgetAction = authActionClient
  .inputSchema(deleteBudgetSchema)
  .action(async ({ parsedInput: { id }, ctx }) => {
    await deleteBudget(ctx.supabase, id)
    revalidatePath("/budgets")
    return { id }
  })
