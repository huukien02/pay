import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LinkButton,
} from "@/components/core"
import { CategorySpendChart } from "@/components/charts"
import { EmptyState, PageHeader } from "@/components/patterns"
import {
  getAccountBalances,
  getCategorySpend,
  getMonthlyCashflow,
} from "@/lib/data/dashboard"
import { formatMoney } from "@/lib/money"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthKey = `${monthStart.getFullYear()}-${String(
    monthStart.getMonth() + 1
  ).padStart(2, "0")}-01`

  const [balances, cashflow, categorySpend] = await Promise.all([
    getAccountBalances(supabase),
    getMonthlyCashflow(supabase, monthKey),
    getCategorySpend(supabase, monthKey),
  ])

  const spendData = categorySpend.map((c) => ({
    name: c.category_name ?? "Không phân loại",
    value: Number(c.total ?? 0),
    color: c.category_color,
  }))

  // Tổng số dư theo từng loại tiền.
  const totalsByCurrency = new Map<string, number>()
  for (const b of balances) {
    const cur = b.currency ?? "VND"
    totalsByCurrency.set(
      cur,
      (totalsByCurrency.get(cur) ?? 0) + Number(b.balance ?? 0)
    )
  }
  const totalLines = [...totalsByCurrency.entries()].map(([cur, val]) =>
    formatMoney(val, cur)
  )

  const income = cashflow.reduce((s, c) => s + Number(c.income ?? 0), 0)
  const expense = cashflow.reduce((s, c) => s + Number(c.expense ?? 0), 0)

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Tổng quan"
        description="Bảng điều khiển tài chính của bạn."
      />

      {balances.length === 0 ? (
        <EmptyState
          title="Chưa có dữ liệu"
          description="Tạo tài khoản và thêm giao dịch để thấy số liệu ở đây."
          action={<LinkButton href="/accounts">Tạo tài khoản</LinkButton>}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardDescription>Tổng số dư</CardDescription>
                <CardTitle className="text-2xl tabular-nums">
                  {totalLines.length ? totalLines.join(" · ") : "—"}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Thu tháng này</CardDescription>
                <CardTitle className="text-2xl tabular-nums text-emerald-600">
                  {formatMoney(income)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Chi tháng này</CardDescription>
                <CardTitle className="text-destructive text-2xl tabular-nums">
                  {formatMoney(expense)}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Số dư theo tài khoản
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {balances.map((b) => (
                  <div
                    key={b.account_id}
                    className="flex items-center justify-between border-b py-2 last:border-0"
                  >
                    <span className={b.archived ? "text-muted-foreground" : ""}>
                      {b.name}
                    </span>
                    <span className="font-medium tabular-nums">
                      {formatMoney(b.balance ?? 0, b.currency ?? "VND")}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Chi theo danh mục (tháng này)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CategorySpendChart data={spendData} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
