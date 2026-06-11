/**
 * Design system layer — API công khai DUY NHẤT cho UI primitives.
 *
 * App/feature code import từ "@/components/core", KHÔNG bao giờ import thẳng
 * "@/components/ui/*" (bị ESLint chặn — xem CLAUDE.md Luật vàng #3).
 *
 * Thêm primitive mới: chạy shadcn CLI vào components/ui rồi re-export ở đây
 * (kèm tùy biến variant/token nếu cần) TRƯỚC khi feature được phép dùng.
 */

export * from "@/components/ui/button"
export * from "./link-button"
export * from "@/components/ui/input"
export * from "@/components/ui/input-group"
export * from "@/components/ui/label"
export * from "@/components/ui/textarea"
export * from "@/components/ui/checkbox"
export * from "@/components/ui/switch"
export * from "@/components/ui/select"
export * from "@/components/ui/card"
export * from "@/components/ui/badge"
export * from "@/components/ui/separator"
export * from "@/components/ui/skeleton"
export * from "@/components/ui/table"
export * from "@/components/ui/dialog"
export * from "@/components/ui/alert-dialog"
export * from "@/components/ui/dropdown-menu"
export * from "@/components/ui/popover"
export * from "@/components/ui/command"
export * from "@/components/ui/form"
export * from "@/components/ui/sonner"
