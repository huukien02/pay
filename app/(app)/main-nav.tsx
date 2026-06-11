"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tổng quan" },
  { href: "/accounts", label: "Tài khoản" },
  { href: "/categories", label: "Danh mục" },
  { href: "/transactions", label: "Giao dịch" },
  { href: "/budgets", label: "Ngân sách" },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-0.5 text-sm">
      {NAV_ITEMS.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 whitespace-nowrap transition-colors",
              active
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
