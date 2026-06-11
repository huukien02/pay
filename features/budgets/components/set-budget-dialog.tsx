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
import { AppForm, MoneyField, SelectField, SubmitButton } from "@/components/forms"
import { allCategoriesQueryOptions } from "@/features/categories/queries"
import { useDisclosure } from "@/lib/hooks/use-disclosure"
import { queryKeys } from "@/lib/query-keys"
import { createClient } from "@/lib/supabase/client"
import {
  budgetFormSchema,
  type BudgetFormInput,
} from "@/lib/validations/budget"
import { setBudgetAction } from "../actions"

export function SetBudgetDialog({ month }: { month: string }) {
  const { isOpen, setIsOpen, open } = useDisclosure()
  const supabase = useMemo(() => createClient(), [])
  const { data: categories } = useQuery(allCategoriesQueryOptions(supabase))

  const options = (categories ?? [])
    .filter((c) => c.kind === "expense")
    .map((c) => ({ value: c.id, label: c.name }))

  return (
    <>
      <Button onClick={open}>
        <Plus />
        Đặt ngân sách
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Đặt ngân sách</DialogTitle>
            <DialogDescription>
              Ngân sách chi cho một danh mục trong tháng này.
            </DialogDescription>
          </DialogHeader>

          {options.length === 0 ? (
            <p className="text-muted-foreground py-4 text-sm">
              Bạn cần tạo danh mục chi trước.
            </p>
          ) : (
            <AppForm
              schema={budgetFormSchema}
              action={setBudgetAction}
              defaultValues={{
                categoryId: options[0].value,
                month,
                amount: "",
              }}
              successMessage="Đã lưu ngân sách"
              invalidateKeys={[queryKeys.budgets.all]}
              onSuccess={() => setIsOpen(false)}
              className="grid gap-4"
            >
              <SelectField<BudgetFormInput>
                name="categoryId"
                label="Danh mục"
                options={options}
              />
              <MoneyField<BudgetFormInput>
                name="amount"
                label="Ngân sách / tháng"
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
