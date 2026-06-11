"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { EmptyState, ErrorState, LoadingState } from "@/components/patterns"
import { formatMoney } from "@/lib/money"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { budgetsQueryOptions } from "../queries"
import { DeleteBudgetButton } from "./delete-budget-button"

export function BudgetsView({ month }: { month: string }) {
  const supabase = useMemo(() => createClient(), [])
  const { data, isPending, isError } = useQuery(
    budgetsQueryOptions(supabase, month)
  )

  if (isPending) return <LoadingState />
  if (isError) return <ErrorState description="Không tải được ngân sách." />
  if (data.length === 0) {
    return (
      <EmptyState
        title="Chưa có ngân sách"
        description="Đặt ngân sách cho từng danh mục chi để theo dõi."
      />
    )
  }

  return (
    <div className="grid gap-3">
      {data.map((b) => {
        const pct = b.amount > 0 ? (b.spent / b.amount) * 100 : 0
        const over = b.spent > b.amount
        const remaining = b.amount - b.spent
        return (
          <div key={b.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{b.categoryName}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm tabular-nums">
                  {formatMoney(b.spent)} / {formatMoney(b.amount)}
                </span>
                <DeleteBudgetButton id={b.id} />
              </div>
            </div>
            <div className="bg-muted mt-2 h-2 overflow-hidden rounded-full">
              <div
                className={cn(
                  "h-2 rounded-full transition-all",
                  over ? "bg-destructive" : "bg-primary"
                )}
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
            <p
              className={cn(
                "mt-1 text-xs",
                over ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {over
                ? `Vượt ${formatMoney(-remaining)}`
                : `Còn lại ${formatMoney(remaining)}`}
            </p>
          </div>
        )
      })}
    </div>
  )
}
