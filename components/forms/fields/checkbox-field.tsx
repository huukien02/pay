"use client"

import { useFormContext, type FieldValues, type Path } from "react-hook-form"

import {
  Checkbox,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/core"

export interface CheckboxFieldProps<T extends FieldValues> {
  name: Path<T>
  label?: string
  description?: string
  disabled?: boolean
}

export function CheckboxField<T extends FieldValues>({
  name,
  label,
  description,
  disabled,
}: CheckboxFieldProps<T>) {
  const { control } = useFormContext<T>()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start gap-2.5">
          <FormControl>
            <Checkbox
              checked={Boolean(field.value)}
              onCheckedChange={(checked) => field.onChange(checked)}
              disabled={disabled}
            />
          </FormControl>
          <div className="grid gap-1 leading-none">
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  )
}
