import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

/**
 * OAuth callback: đổi `code` (PKCE) lấy session rồi redirect về `next`
 * (kèm cờ login=success để client bắn toast).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const dest = new URL(next, origin)
      dest.searchParams.set("login", "success")

      // Sau load balancer (production) ưu tiên x-forwarded-host.
      const forwardedHost = request.headers.get("x-forwarded-host")
      if (process.env.NODE_ENV !== "development" && forwardedHost) {
        dest.protocol = "https:"
        dest.host = forwardedHost
      }
      return NextResponse.redirect(dest)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`)
}
