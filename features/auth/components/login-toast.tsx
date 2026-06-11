"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { notify } from "@/lib/toast"

/**
 * Bắn toast "Đăng nhập thành công" sau khi OAuth callback redirect kèm
 * ?login=success, rồi dọn param khỏi URL. Render trong (app) layout.
 */
export function LoginToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const shown = useRef(false)

  useEffect(() => {
    if (searchParams.get("login") !== "success" || shown.current) return
    shown.current = true
    notify.success("Đăng nhập thành công")

    const params = new URLSearchParams(searchParams.toString())
    params.delete("login")
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    })
  }, [searchParams, router, pathname])

  return null
}
