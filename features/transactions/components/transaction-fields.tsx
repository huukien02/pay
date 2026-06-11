"use client"

import { useWatch } from "react-hook-form"

import { MoneyField, SelectField, TextField } from "@/components/forms"
import {
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPES,
  toOptions,
} from "@/lib/constants"
import type { TransactionFormInput } from "@/lib/validations/transaction"

const typeOptions = toOptions(TRANSACTION_TYPES, TRANSACTION_TYPE_LABELS)

export function TransactionFields({
  accountOptions,
  categories,
}: {
  accountOptions: { value: string; label: string }[]
  categories: { id: string; name: string; kind: string }[]
}) {
  const type = useWatch<TransactionFormInput>({ name: "type" }) as string

  const categoryOptions = categories
    .filter((c) =>
      type === "income" || type === "expense" ? c.kind === type : true
    )
    .map((c) => ({ value: c.id, label: c.name }))

  return (
    <>
      <SelectField<TransactionFormInput>
        name="type"
        label="Loại"
        options={typeOptions}
      />
      <MoneyField<TransactionFormInput> name="amount" label="Số tiền" />
      <SelectField<TransactionFormInput>
        name="accountId"
        label={type === "transfer" ? "Từ tài khoản" : "Tài khoản"}
        options={accountOptions}
      />
      {type === "transfer" ? (
        <SelectField<TransactionFormInput>
          name="toAccountId"
          label="Đến tài khoản"
          options={accountOptions}
        />
      ) : (
        <SelectField<TransactionFormInput>
          name="categoryId"
          label="Danh mục"
          options={categoryOptions}
          placeholder="Không phân loại"
        />
      )}
      <TextField<TransactionFormInput>
        name="occurredAt"
        label="Ngày"
        type="date"
      />
      <TextField<TransactionFormInput>
        name="note"
        label="Ghi chú (tùy chọn)"
        placeholder="Mô tả ngắn..."
      />
    </>
  )
}
