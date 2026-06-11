"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { formatMoney } from "@/lib/money"

const FALLBACK_COLORS = [
  "#6366f1",
  "#22c55e",
  "#ef4444",
  "#f59e0b",
  "#06b6d4",
  "#a855f7",
  "#ec4899",
  "#84cc16",
]

export interface CategorySpendDatum {
  name: string
  value: number
  color?: string | null
}

export function CategorySpendChart({ data }: { data: CategorySpendDatum[] }) {
  if (!data.length) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        Chưa có chi tiêu trong tháng này.
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {data.map((d, i) => (
            <Cell
              key={d.name}
              fill={d.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatMoney(Number(value))}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
