import { z } from "zod"

import { CATEGORY_KINDS } from "@/lib/constants"

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên danh mục").max(80, "Tên quá dài"),
  kind: z.enum(CATEGORY_KINDS),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, "Mã màu không hợp lệ")
    .optional()
    .or(z.literal("")),
})

export type CategoryFormInput = z.infer<typeof categoryFormSchema>

export const updateCategorySchema = categoryFormSchema.extend({
  id: z.uuid(),
})

export const deleteCategorySchema = z.object({ id: z.uuid() })
