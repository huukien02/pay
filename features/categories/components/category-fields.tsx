"use client"

import { SelectField, TextField } from "@/components/forms"
import { CATEGORY_KIND_LABELS, CATEGORY_KINDS, toOptions } from "@/lib/constants"
import type { CategoryFormInput } from "@/lib/validations/category"

const kindOptions = toOptions(CATEGORY_KINDS, CATEGORY_KIND_LABELS)

export function CategoryFields() {
  return (
    <>
      <TextField<CategoryFormInput>
        name="name"
        label="Tên danh mục"
        placeholder="Ăn uống, Lương..."
      />
      <SelectField<CategoryFormInput>
        name="kind"
        label="Loại"
        options={kindOptions}
      />
      <TextField<CategoryFormInput>
        name="color"
        label="Màu (tùy chọn)"
        type="color"
      />
    </>
  )
}
