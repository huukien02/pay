import { AlertCircle, Inbox, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

/** Trạng thái rỗng chuẩn hóa. */
export function EmptyState({
  title = "Chưa có dữ liệu",
  description,
  icon: Icon = Inbox,
  action,
  className,
}: {
  title?: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-12 text-center",
        className
      )}
    >
      <Icon className="text-muted-foreground size-8" />
      <p className="font-medium">{title}</p>
      {description && (
        <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

/** Trạng thái lỗi chuẩn hóa. */
export function ErrorState({
  title = "Đã có lỗi xảy ra",
  description,
  action,
  className,
}: {
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "border-destructive/30 bg-destructive/5 flex flex-col items-center justify-center gap-2 rounded-lg border py-12 text-center",
        className
      )}
    >
      <AlertCircle className="text-destructive size-8" />
      <p className="font-medium">{title}</p>
      {description && (
        <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

/** Trạng thái đang tải chuẩn hóa. */
export function LoadingState({
  label = "Đang tải...",
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "text-muted-foreground flex items-center justify-center gap-2 py-12 text-sm",
        className
      )}
    >
      <Loader2 className="size-4 animate-spin" />
      {label}
    </div>
  )
}
