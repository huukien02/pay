"use client"

import { SelectField, TextField } from "@/components/forms"
import { ACCOUNT_TYPE_LABELS, ACCOUNT_TYPES, toOptions } from "@/lib/constants"
import type { AccountFormInput } from "@/lib/validations/account"

const typeOptions = toOptions(ACCOUNT_TYPES, ACCOUNT_TYPE_LABELS)

/** Các field của form tài khoản (tái dùng cho create/edit). Tiền tệ mặc định VND. */
export function AccountFields() {
  return (
    <>
      <TextField<AccountFormInput>
        name="name"
        label="Tên tài khoản"
        placeholder="Ví Momo, Vietcombank..."
      />
      <SelectField<AccountFormInput>
        name="type"
        label="Loại"
        options={typeOptions}
      />
    </>
  )
}
