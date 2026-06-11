"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "next-themes"

import { Toaster } from "@/components/core"
import { getQueryClient } from "@/lib/query-client"

/** Gom toàn bộ client provider: React Query + Theme + Toaster. */
export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <Toaster richColors position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
