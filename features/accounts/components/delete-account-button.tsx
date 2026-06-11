"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/core"
import { ConfirmDialog } from "@/components/patterns"
import { useDisclosure } from "@/lib/hooks/use-disclosure"
import { queryKeys } from "@/lib/query-keys"
import { notify } from "@/lib/toast"
import { deleteAccountAction } from "../actions"

export function DeleteAccountButton({ id, name }: { id: string; name: string }) {
  const { isOpen, setIsOpen, open } = useDisclosure()
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  async function onConfirm() {
    setLoading(true)
    const res = await deleteAccountAction({ id })
    setLoading(false)

    if (res?.serverError) {
      notify.error(res.serverError)
      return
    }
    notify.success("Đã xóa tài khoản")
    setIsOpen(false)
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
        title={`Xóa "${name}"?`}
        description="Hành động này không thể hoàn tác. Mọi giao dịch của tài khoản cũng sẽ bị xóa."
        confirmLabel="Xóa"
        destructive
        loading={loading}
        onConfirm={onConfirm}
      />
    </>
  )
}
