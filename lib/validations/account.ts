import { z } from "zod"

import {
  ACCOUNT_TYPES,
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
} from "@/lib/constants"

export const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, "Vui lòng nhập tên tài khoản")
    .max(80, "Tên quá dài"),
  type: z.enum(ACCOUNT_TYPES),
  currency: z.enum(SUPPORTED_CURRENCIES).default(DEFAULT_CURRENCY),
})

export type AccountFormInput = z.infer<typeof accountFormSchema>

export const updateAccountSchema = accountFormSchema.extend({
  id: z.uuid(),
  archived: z.boolean().optional(),
})

export const deleteAccountSchema = z.object({ id: z.uuid() })
