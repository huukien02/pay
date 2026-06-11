"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useWatch } from "react-hook-form"
import { Pencil } from "lucide-react"

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/core"
import {
  AppForm,
  MoneyField,
  SelectField,
  SubmitButton,
  TextField,
} from "@/components/forms"
import { allAccountsQueryOptions } from "@/features/accounts/queries"
import { allCategoriesQueryOptions } from "@/features/categories/queries"
import type { TransactionListItem } from "@/lib/data/transactions"
import { useDisclosure } from "@/lib/hooks/use-disclosure"
import { queryKeys } from "@/lib/query-keys"
import { createClient } from "@/lib/supabase/client"
import {
  updateTransactionSchema,
  type UpdateTransactionInput,
} from "@/lib/validations/transaction"
import { updateTransactionAction } from "../actions"

const TYPE_OPTIONS = [
  { value: "expense", label: "Chi" },
  { value: "income", label: "Thu" },
]

function EditFields({
  accountOptions,
  categories,
}: {
  accountOptions: { value: string; label: string }[]
  categories: { id: string; name: string; kind: string }[]
}) {
  const type = useWatch<UpdateTransactionInput>({ name: "type" }) as string
  const categoryOptions = categories
    .filter((c) => c.kind === type)
    .map((c) => ({ value: c.id, label: c.name }))

  return (
    <>
      <SelectField<UpdateTransactionInput>
        name="type"
        label="Loại"
        options={TYPE_OPTIONS}
      />
      <MoneyField<UpdateTransactionInput> name="amount" label="Số tiền" />
      <SelectField<UpdateTransactionInput>
        name="accountId"
        label="Tài khoản"
        options={accountOptions}
      />
      <SelectField<UpdateTransactionInput>
        name="categoryId"
        label="Danh mục"
        options={categoryOptions}
        placeholder="Không phân loại"
      />
      <TextField<UpdateTransactionInput>
        name="occurredAt"
        label="Ngày"
        type="date"
      />
      <TextField<UpdateTransactionInput> name="note" label="Ghi chú (tùy chọn)" />
    </>
  )
}

export function EditTransactionDialog({ tx }: { tx: TransactionListItem }) {
  const { isOpen, setIsOpen, open } = useDisclosure()
  const supabase = useMemo(() => createClient(), [])
  const { data: accounts } = useQuery(allAccountsQueryOptions(supabase))
  const { data: categories } = useQuery(allCategoriesQueryOptions(supabase))

  const accountOptions = (accounts ?? []).map((a) => ({
    value: a.id,
    label: a.name,
  }))

  return (
    <>
      <Button variant="ghost" size="icon-sm" onClick={open} aria-label="Sửa">
        <Pencil />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sửa giao dịch</DialogTitle>
            <DialogDescription>Cập nhật khoản thu/chi.</DialogDescription>
          </DialogHeader>
          <AppForm
            schema={updateTransactionSchema}
            action={updateTransactionAction}
            defaultValues={{
              id: tx.id,
              type: tx.type as "income" | "expense",
              amount: String(tx.amount),
              accountId: tx.account_id,
              categoryId: tx.category_id ?? undefined,
              occurredAt: tx.occurred_at.slice(0, 10),
              note: tx.note ?? "",
            }}
            successMessage="Đã cập nhật giao dịch"
            invalidateKeys={[
              queryKeys.transactions.all,
              queryKeys.accounts.all,
            ]}
            onSuccess={() => setIsOpen(false)}
            className="grid gap-4"
          >
            <EditFields
              accountOptions={accountOptions}
              categories={categories ?? []}
            />
            <DialogFooter>
              <SubmitButton>Lưu</SubmitButton>
            </DialogFooter>
          </AppForm>
        </DialogContent>
      </Dialog>
    </>
  )
}
