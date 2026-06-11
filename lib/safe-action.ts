import { createSafeActionClient } from "next-safe-action"

import { createClient } from "@/lib/supabase/server"

/** Lỗi nghiệp vụ chủ động ném ra trong action -> trả nguyên message về client. */
export class ActionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ActionError"
  }
}

/** Action client gốc: chuẩn hóa server error message. */
export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof ActionError) return error.message
    // Lỗi không mong đợi: log chi tiết, trả message chung (không lộ nội bộ).
    console.error("[action] unexpected error:", error)
    return "Đã có lỗi xảy ra. Vui lòng thử lại."
  },
})

/**
 * Action client YÊU CẦU đăng nhập. Middleware tự kiểm tra session và inject
 * `ctx.user` + `ctx.supabase` (client server đã gắn cookie) cho mọi action.
 * Dùng cho MỌI action chạm dữ liệu người dùng (xem CLAUDE.md #8).
 */
export const authActionClient = actionClient.use(async ({ next }) => {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new ActionError("Bạn cần đăng nhập để thực hiện thao tác này.")
  }

  return next({ ctx: { user, supabase } })
})
