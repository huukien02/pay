"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/core"
import {
  EmptyState,
  ErrorState,
  LoadingState,
  Pagination,
} from "@/components/patterns"
import { TRANSACTION_TYPE_LABELS, type TransactionType } from "@/lib/constants"
import type { TransactionListItem } from "@/lib/data/transactions"
import { formatDate } from "@/lib/format"
import { usePagination } from "@/lib/hooks/use-pagination"
import { formatMoney } from "@/lib/money"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { transactionsQueryOptions } from "../queries"
import { DeleteTransactionButton } from "./delete-transaction-button"
import { EditTransactionDialog } from "./edit-transaction-dialog"

/** Dấu + màu theo loại giao dịch. */
function signedAmount(t: TransactionListItem) {
  const value = formatMoney(t.amount, t.currency)
  if (t.type === "income") return { text: `+${value}`, className: "text-emerald-600" }
  if (t.type === "expense") return { text: `-${value}`, className: "text-destructive" }
  // transfer
  const isOut = t.transfer_direction === "out"
  return {
    text: `${isOut ? "-" : "+"}${value}`,
    className: "text-muted-foreground",
  }
}

export function TransactionsView({ month }: { month: string }) {
  const supabase = useMemo(() => createClient(), [])
  const { page, pageSize } = usePagination()
  const { data, isPending, isError } = useQuery(
    transactionsQueryOptions(supabase, { page, pageSize, filter: { month } })
  )

  if (isPending) return <LoadingState />
  if (isError)
    return <ErrorState description="Không tải được danh sách giao dịch." />
  if (data.total === 0) {
    return (
      <EmptyState
        title="Không có giao dịch"
        description="Chưa có giao dịch nào trong tháng đã chọn."
      />
    )
  }

  return (
    <div className="grid gap-3">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead className="hidden sm:table-cell">Tài khoản</TableHead>
              <TableHead className="hidden sm:table-cell">Danh mục</TableHead>
              <TableHead className="text-right">Số tiền</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((t) => {
              const amount = signedAmount(t)
              return (
                <TableRow key={t.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(t.occurred_at)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {TRANSACTION_TYPE_LABELS[t.type as TransactionType] ??
                        t.type}
                      {t.type === "transfer" &&
                        (t.transfer_direction === "out" ? " ↗" : " ↘")}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {t.account?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell">
                    {t.category?.name ?? (t.note || "—")}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium tabular-nums",
                      amount.className
                    )}
                  >
                    {amount.text}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {t.type !== "transfer" && (
                        <EditTransactionDialog tx={t} />
                      )}
                      <DeleteTransactionButton id={t.id} />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <Pagination pageCount={data.pageCount} />
    </div>
  )
}
