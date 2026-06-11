"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button, Input } from "@/components/core"

export function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

/** Lọc giao dịch theo tháng — state nằm trong URL (?month=YYYY-MM). */
export function MonthFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const month = searchParams.get("month") ?? currentMonth()

  const setMonth = useCallback(
    (m: string) => {
      if (!m) return
      const params = new URLSearchParams(searchParams.toString())
      params.set("month", m)
      params.set("page", "1") // đổi tháng -> về trang 1
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Tháng trước"
        onClick={() => setMonth(shiftMonth(month, -1))}
      >
        <ChevronLeft />
      </Button>
      <Input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="h-9 w-48 sm:w-52"
        aria-label="Chọn tháng"
      />
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Tháng sau"
        onClick={() => setMonth(shiftMonth(month, 1))}
      >
        <ChevronRight />
      </Button>
    </div>
  )
}
