"use client"

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
import { DEFAULT_CURRENCY } from "@/lib/constants"
import { useDisclosure } from "@/lib/hooks/use-disclosure"
import { queryKeys } from "@/lib/query-keys"
import { accountFormSchema } from "@/lib/validations/account"
import { createAccountAction } from "../actions"
import { AccountFields } from "./account-fields"

export function CreateAccountDialog() {
  const { isOpen, setIsOpen, open } = useDisclosure()

  return (
    <>
      <Button onClick={open}>
        <Plus />
        Thêm tài khoản
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm tài khoản</DialogTitle>
            <DialogDescription>Tạo một tài khoản tiền mới.</DialogDescription>
          </DialogHeader>
          <AppForm
            schema={accountFormSchema}
            action={createAccountAction}
            defaultValues={{ name: "", type: "cash", currency: DEFAULT_CURRENCY }}
            successMessage="Đã thêm tài khoản"
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
