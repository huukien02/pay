import { type NextRequest } from "next/server"

import { updateSession } from "@/lib/supabase/middleware"

// Next.js 16: thay cho "middleware". Refresh session Supabase + bảo vệ route.
export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Khớp mọi path TRỪ:
     * - _next/static, _next/image
     * - favicon.ico, file ảnh tĩnh
     */
    "/((?!_next/static|_next/image|favicon.ico|firebase-messaging-sw.js|robots.txt|sitemap.xml|opengraph-image|apple-icon|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
