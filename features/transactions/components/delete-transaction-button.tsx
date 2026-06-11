"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/core"
import { ConfirmDialog } from "@/components/patterns"
import { useDisclosure } from "@/lib/hooks/use-disclosure"
import { queryKeys } from "@/lib/query-keys"
import { notify } from "@/lib/toast"
import { deleteTransactionAction } from "../actions"

export function DeleteTransactionButton({ id }: { id: string }) {
  const { isOpen, setIsOpen, open } = useDisclosure()
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  async function onConfirm() {
    setLoading(true)
    const res = await deleteTransactionAction({ id })
    setLoading(false)

    if (res?.serverError) {
      notify.error(res.serverError)
      return
    }
    notify.success("Đã xóa giao dịch")
    setIsOpen(false)
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all })
  }

  return (
    <>
      <Button variant="ghost" size="icon-sm" onClick={open} aria-label="Xóa">
        <Trash2 />
      </Button>
      <ConfirmDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Xóa giao dịch?"
        description="Nếu là chuyển khoản, cả hai vế (đi và đến) sẽ bị xóa."
        confirmLabel="Xóa"
        destructive
        loading={loading}
        onConfirm={onConfirm}
      />
    </>
  )
}
