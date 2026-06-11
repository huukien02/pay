"use server"

import { revalidatePath } from "next/cache"

import {
  deleteAccount,
  insertAccount,
  updateAccount,
} from "@/lib/data/accounts"
import { authActionClient } from "@/lib/safe-action"
import {
  accountFormSchema,
  deleteAccountSchema,
  updateAccountSchema,
} from "@/lib/validations/account"

export const createAccountAction = authActionClient
  .inputSchema(accountFormSchema)
  .action(async ({ parsedInput, ctx }) => {
    const account = await insertAccount(ctx.supabase, ctx.user.id, parsedInput)
    revalidatePath("/accounts")
    return account
  })

export const updateAccountAction = authActionClient
  .inputSchema(updateAccountSchema)
  .action(async ({ parsedInput: { id, ...input }, ctx }) => {
    const account = await updateAccount(ctx.supabase, id, input)
    revalidatePath("/accounts")
    return account
  })

export const deleteAccountAction = authActionClient
  .inputSchema(deleteAccountSchema)
  .action(async ({ parsedInput: { id }, ctx }) => {
    await deleteAccount(ctx.supabase, id)
    revalidatePath("/accounts")
    return { id }
  })
