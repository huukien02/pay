"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { Button } from "@/components/core"
import { notify } from "@/lib/toast"
import { logoutAction } from "../actions"

export function LogoutButton() {
  const router = useRouter()

  async function onLogout() {
    const res = await logoutAction()
    if (res?.serverError) {
      notify.error("Đăng xuất thất bại. Vui lòng thử lại.")
      return
    }
    notify.success("Đã đăng xuất")
    router.replace("/login")
    router.refresh()
  }

  return (
    <Button variant="ghost" size="sm" onClick={onLogout}>
      <LogOut />
      Đăng xuất
    </Button>
  )
}
