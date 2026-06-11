"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/core"
import { useDisclosure } from "@/lib/hooks/use-disclosure"
import { ConfirmDialog } from "@/components/patterns"
import { queryKeys } from "@/lib/query-keys"
import { notify } from "@/lib/toast"
import { deleteBudgetAction } from "../actions"

export function DeleteBudgetButton({ id }: { id: string }) {
  const { isOpen, setIsOpen, open } = useDisclosure()
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  async function onConfirm() {
    setLoading(true)
    const res = await deleteBudgetAction({ id })
    setLoading(false)
    if (res?.serverError) {
      notify.error(res.serverError)
      return
    }
    notify.success("Đã xóa ngân sách")
    setIsOpen(false)
    queryClient.invalidateQueries({ queryKey: queryKeys.budgets.all })
  }

  return (
    <>
      <Button variant="ghost" size="icon-sm" onClick={open} aria-label="Xóa">
        <Trash2 />
      </Button>
      <ConfirmDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Xóa ngân sách?"
        confirmLabel="Xóa"
        destructive
        loading={loading}
        onConfirm={onConfirm}
      />
    </>
  )
}
