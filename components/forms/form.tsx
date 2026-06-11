"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query"
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type Resolver,
  type UseFormReturn,
} from "react-hook-form"
import { type ZodType } from "zod"

import { Form } from "@/components/core"
import { notify } from "@/lib/toast"

/** Hình dạng kết quả trả về từ một next-safe-action. */
type SafeActionResult<Data> = {
  data?: Data
  serverError?: string
  validationErrors?: unknown
}
type SafeActionFn<Input, Data> = (
  input: Input
) => Promise<SafeActionResult<Data> | undefined>

/** Marker: lỗi đã được xử lý (map về field) — đừng bắn toast lần nữa. */
class FormHandledError extends Error {}

/** Map validationErrors của next-safe-action về RHF setError. */
function applyValidationErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  validationErrors: unknown
) {
  if (!validationErrors || typeof validationErrors !== "object") return
  for (const [key, value] of Object.entries(
    validationErrors as Record<string, unknown>
  )) {
    if (key === "_errors") {
      const msgs = value as string[] | undefined
      if (Array.isArray(msgs) && msgs.length) {
        form.setError("root", { message: msgs[0] })
      }
      continue
    }
    const fieldErrors = (value as { _errors?: string[] } | undefined)?._errors
    if (Array.isArray(fieldErrors) && fieldErrors.length) {
      form.setError(key as Path<T>, { message: fieldErrors[0] })
    }
  }
}

interface AppFormProps<TFieldValues extends FieldValues, TData> {
  /** Zod schema có input khớp TFieldValues (suy ra kiểu form từ đây). */
  schema: ZodType<unknown, TFieldValues>
  action: SafeActionFn<TFieldValues, TData>
  defaultValues?: DefaultValues<TFieldValues>
  /** Query key cần invalidate sau khi thành công. */
  invalidateKeys?: QueryKey[]
  /** Toast khi thành công. */
  successMessage?: string
  onSuccess?: (data: TData | undefined) => void
  className?: string
  id?: string
  children: React.ReactNode
}

/**
 * <AppForm> — abstraction form DUY NHẤT của app (xem CLAUDE.md #6).
 * Tự: wire RHF + zodResolver -> gọi safe action qua React Query useMutation
 * -> map serverError/validationErrors về toast/setError -> invalidate query.
 * Feature chỉ khai báo schema + action + các <Field/>.
 */
export function AppForm<TFieldValues extends FieldValues, TData = unknown>({
  schema,
  action,
  defaultValues,
  invalidateKeys,
  successMessage,
  onSuccess,
  className,
  id,
  children,
}: AppFormProps<TFieldValues, TData>) {
  type Values = TFieldValues

  const form = useForm<Values>({
    resolver: zodResolver(schema as ZodType<Values, Values>) as Resolver<Values>,
    defaultValues,
  })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (values: Values) => {
      const res = await action(values)
      if (res?.validationErrors) {
        applyValidationErrors(form, res.validationErrors)
        throw new FormHandledError()
      }
      if (res?.serverError) throw new Error(res.serverError)
      return res?.data
    },
    onSuccess: async (data) => {
      if (invalidateKeys?.length) {
        await Promise.all(
          invalidateKeys.map((queryKey) =>
            queryClient.invalidateQueries({ queryKey })
          )
        )
      }
      if (successMessage) notify.success(successMessage)
      onSuccess?.(data)
    },
    onError: (error) => {
      if (error instanceof FormHandledError) return
      notify.error(error instanceof Error ? error.message : "Đã có lỗi xảy ra.")
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values)
    } catch {
      // Đã xử lý ở onError; bắt lại để không nổi unhandled rejection.
    }
  })

  return (
    <Form {...form}>
      <form id={id} onSubmit={onSubmit} className={className} noValidate>
        {children}
      </form>
    </Form>
  )
}
