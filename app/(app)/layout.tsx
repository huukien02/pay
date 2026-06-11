import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { LoginToast } from "@/features/auth/components/login-toast"
import { LogoutButton } from "@/features/auth/components/logout-button"
import { createClient } from "@/lib/supabase/server"
import { MainNav } from "./main-nav"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Lớp bảo vệ thứ 2 (middleware là lớp 1) — RSC tự đảm bảo có user.
  if (!user) redirect("/login")

  return (
    <div className="flex min-h-svh flex-col">
      <Suspense>
        <LoginToast />
      </Suspense>
      <header className="bg-background/70 sticky top-0 z-30 border-b backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-semibold whitespace-nowrap"
          >
            <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg text-sm font-bold">
              ₫
            </span>
            <span className="hidden sm:inline">Ví Thu Chi</span>
          </Link>

          <div className="flex min-w-0 flex-1 overflow-x-auto">
            <MainNav />
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden items-center gap-2 lg:flex">
              <span className="bg-muted text-foreground flex size-7 items-center justify-center rounded-full text-xs font-semibold uppercase">
                {user.email?.[0] ?? "U"}
              </span>
              <span className="text-muted-foreground max-w-[160px] truncate text-sm">
                {user.email}
              </span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  )
}
