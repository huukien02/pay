"use client"

import { Loader2 } from "lucide-react"
import { useFormState } from "react-hook-form"

import { Button } from "@/components/core"

/** Nút submit tự disable + hiện spinner khi form đang gửi. Dùng trong <AppForm>. */
export function SubmitButton({
  children,
  disabled,
  size = "lg",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { isSubmitting } = useFormState()
  return (
    <Button type="submit" size={size} disabled={isSubmitting || disabled} {...props}>
      {isSubmitting && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  )
}
