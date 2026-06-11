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
import { useDisclosure } from "@/lib/hooks/use-disclosure"
import { queryKeys } from "@/lib/query-keys"
import { categoryFormSchema } from "@/lib/validations/category"
import { createCategoryAction } from "../actions"
import { CategoryFields } from "./category-fields"

export function CreateCategoryDialog() {
  const { isOpen, setIsOpen, open } = useDisclosure()

  return (
    <>
      <Button onClick={open}>
        <Plus />
        Thêm danh mục
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm danh mục</DialogTitle>
            <DialogDescription>
              Phân loại các khoản thu/chi của bạn.
            </DialogDescription>
          </DialogHeader>
          <AppForm
            schema={categoryFormSchema}
            action={createCategoryAction}
            defaultValues={{ name: "", kind: "expense", color: "#64748b" }}
            successMessage="Đã thêm danh mục"
            invalidateKeys={[queryKeys.categories.all]}
            onSuccess={() => setIsOpen(false)}
            className="grid gap-4"
          >
            <CategoryFields />
            <DialogFooter>
              <SubmitButton>Lưu</SubmitButton>
            </DialogFooter>
          </AppForm>
        </DialogContent>
      </Dialog>
    </>
  )
}
