"use client"

import { useFormContext, type FieldValues, type Path } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from "@/components/core"

export interface TextareaFieldProps<T extends FieldValues> {
  name: Path<T>
  label?: string
  description?: string
  placeholder?: string
  rows?: number
  disabled?: boolean
}

export function TextareaField<T extends FieldValues>({
  name,
  label,
  description,
  ...textareaProps
}: TextareaFieldProps<T>) {
  const { control } = useFormContext<T>()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea {...textareaProps} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
