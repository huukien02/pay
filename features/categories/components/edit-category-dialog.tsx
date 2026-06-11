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
import { type CategoryKind } from "@/lib/constants"
import type { Category } from "@/lib/data/categories"
import { useDisclosure } from "@/lib/hooks/use-disclosure"
import { queryKeys } from "@/lib/query-keys"
import { updateCategorySchema } from "@/lib/validations/category"
import { updateCategoryAction } from "../actions"
import { CategoryFields } from "./category-fields"

export function EditCategoryDialog({ category }: { category: Category }) {
  const { isOpen, setIsOpen, open } = useDisclosure()

  return (
    <>
      <Button variant="ghost" size="icon-sm" onClick={open} aria-label="Sửa">
        <Pencil />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sửa danh mục</DialogTitle>
            <DialogDescription>Cập nhật thông tin danh mục.</DialogDescription>
          </DialogHeader>
          <AppForm
            schema={updateCategorySchema}
            action={updateCategoryAction}
            defaultValues={{
              id: category.id,
              name: category.name,
              kind: category.kind as CategoryKind,
              color: category.color ?? "#64748b",
            }}
            successMessage="Đã cập nhật danh mục"
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
