"use server"

import { revalidatePath } from "next/cache"

import {
  deleteCategory,
  insertCategory,
  updateCategory,
} from "@/lib/data/categories"
import { authActionClient } from "@/lib/safe-action"
import {
  categoryFormSchema,
  deleteCategorySchema,
  updateCategorySchema,
} from "@/lib/validations/category"

export const createCategoryAction = authActionClient
  .inputSchema(categoryFormSchema)
  .action(async ({ parsedInput, ctx }) => {
    const category = await insertCategory(ctx.supabase, ctx.user.id, {
      ...parsedInput,
      color: parsedInput.color || null,
    })
    revalidatePath("/categories")
    return category
  })

export const updateCategoryAction = authActionClient
  .inputSchema(updateCategorySchema)
  .action(async ({ parsedInput: { id, ...input }, ctx }) => {
    const category = await updateCategory(ctx.supabase, id, {
      ...input,
      color: input.color || null,
    })
    revalidatePath("/categories")
    return category
  })

export const deleteCategoryAction = authActionClient
  .inputSchema(deleteCategorySchema)
  .action(async ({ parsedInput: { id }, ctx }) => {
    await deleteCategory(ctx.supabase, id)
    revalidatePath("/categories")
    return { id }
  })
