"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/core"
import { AppForm, SubmitButton } from "@/components/forms"
import { LoadingState } from "@/components/patterns"
import { allAccountsQueryOptions } from "@/features/accounts/queries"
import { allCategoriesQueryOptions } from "@/features/categories/queries"
import { useDisclosure } from "@/lib/hooks/use-disclosure"
import { queryKeys } from "@/lib/query-keys"
import { createClient } from "@/lib/supabase/client"
import { transactionFormSchema } from "@/lib/validations/transaction"
import { createTransactionAction } from "../actions"
import { TransactionFields } from "./transaction-fields"

export function CreateTransactionDialog() {
  const { isOpen, setIsOpen, open } = useDisclosure()
  const supabase = useMemo(() => createClient(), [])

  const { data: accounts, isPending: accountsPending } = useQuery(
    allAccountsQueryOptions(supabase)
  )
  const { data: categories } = useQuery(allCategoriesQueryOptions(supabase))

  const accountOptions = (accounts ?? []).map((a) => ({
    value: a.id,
    label: a.name,
  }))
  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <Button onClick={open}>
        <Plus />
        Thêm giao dịch
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm giao dịch</DialogTitle>
            <DialogDescription>Ghi nhận thu, chi hoặc chuyển khoản.</DialogDescription>
          </DialogHeader>

          {accountsPending ? (
            <LoadingState label="Đang tải tài khoản..." />
          ) : accountOptions.length === 0 ? (
            <p className="text-muted-foreground py-4 text-sm">
              Bạn cần tạo ít nhất một tài khoản trước khi thêm giao dịch.
            </p>
          ) : (
            <AppForm
              schema={transactionFormSchema}
              action={createTransactionAction}
              defaultValues={{
                type: "expense",
                amount: "",
                accountId: accounts![0].id,
                toAccountId: undefined,
                categoryId: undefined,
                occurredAt: today,
                note: "",
              }}
              successMessage="Đã thêm giao dịch"
              invalidateKeys={[
                queryKeys.transactions.all,
                queryKeys.accounts.all,
              ]}
              onSuccess={() => setIsOpen(false)}
              className="grid gap-4"
            >
              <TransactionFields
                accountOptions={accountOptions}
                categories={categories ?? []}
              />
              <DialogFooter>
                <SubmitButton>Lưu</SubmitButton>
              </DialogFooter>
            </AppForm>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
