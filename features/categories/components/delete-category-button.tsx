"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/core"
import { ConfirmDialog } from "@/components/patterns"
import { useDisclosure } from "@/lib/hooks/use-disclosure"
import { queryKeys } from "@/lib/query-keys"
import { notify } from "@/lib/toast"
import { deleteCategoryAction } from "../actions"

export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const { isOpen, setIsOpen, open } = useDisclosure()
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  async function onConfirm() {
    setLoading(true)
    const res = await deleteCategoryAction({ id })
    setLoading(false)

    if (res?.serverError) {
      notify.error(res.serverError)
      return
    }
    notify.success("Đã xóa danh mục")
    setIsOpen(false)
    queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
  }

  return (
    <>
      <Button variant="ghost" size="icon-sm" onClick={open} aria-label="Xóa">
        <Trash2 />
      </Button>
      <ConfirmDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={`Xóa "${name}"?`}
        description="Giao dịch đang dùng danh mục này sẽ chuyển về không phân loại."
        confirmLabel="Xóa"
        destructive
        loading={loading}
        onConfirm={onConfirm}
      />
    </>
  )
}
