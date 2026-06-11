"use client"

import { useFormContext, type FieldValues, type Path } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/core"
import { DEFAULT_CURRENCY, type Currency } from "@/lib/constants"

export interface MoneyFieldProps<T extends FieldValues> {
  name: Path<T>
  label?: string
  description?: string
  placeholder?: string
  currency?: Currency | string
  disabled?: boolean
}

/**
 * Nhập tiền. Giá trị giữ dạng CHUỖI (decimal) để không mất chính xác —
 * KHÔNG ép number ở đây (xem CLAUDE.md #1). Chuẩn hóa input -> decimal làm ở
 * Zod schema / action.
 */
export function MoneyField<T extends FieldValues>({
  name,
  label,
  description,
  placeholder = "0",
  currency = DEFAULT_CURRENCY,
  disabled,
}: MoneyFieldProps<T>) {
  const { control } = useFormContext<T>()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                value={field.value ?? ""}
                inputMode="decimal"
                placeholder={placeholder}
                disabled={disabled}
                className="h-11 pr-12 text-right tabular-nums"
              />
              <span className="text-muted-foreground pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm">
                {currency}
              </span>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
