"use server"

import { revalidatePath } from "next/cache"

import {
  createTransfer,
  deleteTransaction,
  insertIncomeExpense,
  updateTransaction,
} from "@/lib/data/transactions"
import { parseMoneyInput } from "@/lib/money"
import { ActionError, authActionClient } from "@/lib/safe-action"
import {
  deleteTransactionSchema,
  transactionFormSchema,
  updateTransactionSchema,
} from "@/lib/validations/transaction"

export const createTransactionAction = authActionClient
  .inputSchema(transactionFormSchema)
  .action(async ({ parsedInput, ctx }) => {
    const amount = parseMoneyInput(parsedInput.amount)
    if (!amount) throw new ActionError("Số tiền không hợp lệ")

    const occurredAt = new Date(parsedInput.occurredAt).toISOString()
    const note = parsedInput.note?.trim() || null

    if (parsedInput.type === "transfer") {
      await createTransfer(ctx.supabase, {
        fromAccount: parsedInput.accountId,
        toAccount: parsedInput.toAccountId!,
        amount: Number(amount),
        occurredAt,
        note,
      })
    } else {
      await insertIncomeExpense(ctx.supabase, ctx.user.id, {
        accountId: parsedInput.accountId,
        categoryId: parsedInput.categoryId ?? null,
        type: parsedInput.type,
        amount,
        occurredAt,
        note,
      })
    }

    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    return { ok: true as const }
  })

export const updateTransactionAction = authActionClient
  .inputSchema(updateTransactionSchema)
  .action(async ({ parsedInput: { id, ...input }, ctx }) => {
    const amount = parseMoneyInput(input.amount)
    if (!amount) throw new ActionError("Số tiền không hợp lệ")

    await updateTransaction(ctx.supabase, id, {
      accountId: input.accountId,
      categoryId: input.categoryId ?? null,
      type: input.type,
      amount,
      occurredAt: new Date(input.occurredAt).toISOString(),
      note: input.note?.trim() || null,
    })
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    return { ok: true as const }
  })

export const deleteTransactionAction = authActionClient
  .inputSchema(deleteTransactionSchema)
  .action(async ({ parsedInput: { id }, ctx }) => {
    await deleteTransaction(ctx.supabase, id)
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
    return { id }
  })
