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
import { ACCOUNT_TYPE_LABELS, type AccountType } from "@/lib/constants"
import { usePagination } from "@/lib/hooks/use-pagination"
import { createClient } from "@/lib/supabase/client"
import { accountsQueryOptions } from "../queries"
import { DeleteAccountButton } from "./delete-account-button"
import { EditAccountDialog } from "./edit-account-dialog"

export function AccountsView() {
  const supabase = useMemo(() => createClient(), [])
  const { page, pageSize } = usePagination()
  const { data, isPending, isError } = useQuery(
    accountsQueryOptions(supabase, { page, pageSize })
  )

  if (isPending) return <LoadingState />
  if (isError) return <ErrorState description="Không tải được danh sách tài khoản." />
  if (data.total === 0) {
    return (
      <EmptyState
        title="Chưa có tài khoản"
        description="Thêm tài khoản đầu tiên để bắt đầu ghi nhận giao dịch."
      />
    )
  }

  return (
    <div className="grid gap-3">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">
                  {account.name}
                  {account.archived && (
                    <Badge variant="secondary" className="ml-2">
                      Đã lưu trữ
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {ACCOUNT_TYPE_LABELS[account.type as AccountType] ??
                    account.type}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <EditAccountDialog account={account} />
                    <DeleteAccountButton id={account.id} name={account.name} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination pageCount={data.pageCount} />
    </div>
  )
}
