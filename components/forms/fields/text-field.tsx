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

export interface TextFieldProps<T extends FieldValues> {
  name: Path<T>
  label?: string
  description?: string
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
  autoComplete?: string
  disabled?: boolean
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
}

export function TextField<T extends FieldValues>({
  name,
  label,
  description,
  ...inputProps
}: TextFieldProps<T>) {
  const { control } = useFormContext<T>()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input className="h-11" {...inputProps} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
