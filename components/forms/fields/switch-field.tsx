"use client"

import { useFormContext, type FieldValues, type Path } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Switch,
} from "@/components/core"

export interface SwitchFieldProps<T extends FieldValues> {
  name: Path<T>
  label?: string
  description?: string
  disabled?: boolean
}

export function SwitchField<T extends FieldValues>({
  name,
  label,
  description,
  disabled,
}: SwitchFieldProps<T>) {
  const { control } = useFormContext<T>()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between gap-3">
          <div className="grid gap-1">
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </div>
          <FormControl>
            <Switch
              checked={Boolean(field.value)}
              onCheckedChange={(checked) => field.onChange(checked)}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
