"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/core"

const ALL_DAYS = "all"

function pad(n: number) {
  return String(n).padStart(2, "0")
}

export function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
}

function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
}

function daysInMonth(month: string) {
  const [y, m] = month.split("-").map(Number)
  return new Date(y, m, 0).getDate()
}

/**
 * Lọc giao dịch theo tháng (?month=YYYY-MM), tùy chọn lọc 1 ngày trong tháng
 * (?day=YYYY-MM-DD). Mặc định "Tất cả ngày" = cả tháng. State nằm trong URL.
 */
export function PeriodFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const month = searchParams.get("month") ?? currentMonth()
  const day = searchParams.get("day")
  // Ngày chỉ hợp lệ khi thuộc tháng đang chọn; ngược lại coi như "tất cả".
  const daySelection = day && day.startsWith(`${month}-`) ? day : ALL_DAYS

  const commit = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      mutate(params)
      params.set("page", "1") // đổi bộ lọc -> về trang 1
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const setMonth = useCallback(
    (m: string) => {
      if (!m) return
      commit((p) => {
        p.set("month", m)
        p.delete("day") // ngày cũ thuộc tháng cũ -> bỏ
      })
    },
    [commit]
  )

  const setDay = useCallback(
    (value: string) => {
      commit((p) => {
        p.set("month", month)
        if (value === ALL_DAYS) p.delete("day")
        else p.set("day", value)
      })
    },
    [commit, month]
  )

  const dayOptions = [
    { value: ALL_DAYS, label: "Tất cả ngày" },
    ...Array.from({ length: daysInMonth(month) }, (_, i) => {
      const d = pad(i + 1)
      return { value: `${month}-${d}`, label: `Ngày ${i + 1}` }
    }),
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
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
        className="h-9 w-40 sm:w-44"
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

      <Select
        items={dayOptions}
        value={daySelection}
        onValueChange={(value) => setDay(value as string)}
      >
        <SelectTrigger className="h-9 w-36" aria-label="Chọn ngày">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {dayOptions.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
