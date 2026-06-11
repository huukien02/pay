"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/core"
import { LogoutButton } from "@/features/auth/components/logout-button"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tổng quan" },
  { href: "/accounts", label: "Tài khoản" },
  { href: "/categories", label: "Danh mục" },
  { href: "/transactions", label: "Giao dịch" },
  { href: "/budgets", label: "Ngân sách" },
]

export function MobileNav({ email }: { email?: string | null }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Mở menu"
        onClick={() => setOpen(true)}
      >
        <Menu />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 gap-0 p-0">
          <SheetHeader className="border-b p-4">
            <SheetTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md text-xs font-bold">
                ₫
              </span>
              Ví Thu Chi
            </SheetTitle>
          </SheetHeader>

          <nav className="grid gap-1 p-3">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto border-t p-4">
            {email && (
              <p className="text-muted-foreground mb-2 truncate text-sm">
                {email}
              </p>
            )}
            <LogoutButton />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
