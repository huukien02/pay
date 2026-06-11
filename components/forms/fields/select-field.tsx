"use client"

import { useFormContext, type FieldValues, type Path } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/core"

export interface SelectOption {
  value: string
  label: string
}

export interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>
  options: SelectOption[]
  label?: string
  description?: string
  placeholder?: string
  disabled?: boolean
}

export function SelectField<T extends FieldValues>({
  name,
  options,
  label,
  description,
  placeholder = "Chọn...",
  disabled,
}: SelectFieldProps<T>) {
  const { control } = useFormContext<T>()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            items={options}
            value={field.value ?? null}
            onValueChange={(value) => field.onChange(value)}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className="!h-11 w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
