"use client"

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
import { AppForm, SubmitButton } from "@/components/forms"
import { type AccountType, type Currency } from "@/lib/constants"
import type { Account } from "@/lib/data/accounts"
import { useDisclosure } from "@/lib/hooks/use-disclosure"
import { queryKeys } from "@/lib/query-keys"
import { updateAccountSchema } from "@/lib/validations/account"
import { updateAccountAction } from "../actions"
import { AccountFields } from "./account-fields"

export function EditAccountDialog({ account }: { account: Account }) {
  const { isOpen, setIsOpen, open } = useDisclosure()

  return (
    <>
      <Button variant="ghost" size="icon-sm" onClick={open} aria-label="Sửa">
        <Pencil />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sửa tài khoản</DialogTitle>
            <DialogDescription>Cập nhật thông tin tài khoản.</DialogDescription>
          </DialogHeader>
          <AppForm
            schema={updateAccountSchema}
            action={updateAccountAction}
            defaultValues={{
              id: account.id,
              name: account.name,
              type: account.type as AccountType,
              currency: account.currency as Currency,
            }}
            successMessage="Đã cập nhật tài khoản"
            invalidateKeys={[queryKeys.accounts.all]}
            onSuccess={() => setIsOpen(false)}
            className="grid gap-4"
          >
            <AccountFields />
            <DialogFooter>
              <SubmitButton>Lưu</SubmitButton>
            </DialogFooter>
          </AppForm>
        </DialogContent>
      </Dialog>
    </>
  )
}
