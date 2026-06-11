import Link from "next/link"
import { type VariantProps } from "class-variance-authority"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Link mang style của Button (đúng semantic <a>, không phải <button>).
 * Dùng cho điều hướng; tránh `<Button render={<Link/>}>` (Base UI cảnh báo
 * vì Button mong đợi native <button>).
 */
export function LinkButton({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants>) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
