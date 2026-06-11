import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/** Route công khai (không cần đăng nhập). */
const PUBLIC_PATHS = ["/login", "/auth", "/error"]

function isPublic(pathname: string) {
  // Landing page "/" công khai (khớp chính xác).
  if (pathname === "/") return true
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )
}

/**
 * Refresh session Supabase + bảo vệ route. Gọi từ middleware.ts gốc.
 * Lưu ý: phải trả về `supabaseResponse` để cookie session được ghi đúng.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // QUAN TRỌNG: không chèn logic giữa createServerClient và getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Chưa đăng nhập + vào route bảo vệ -> đẩy về /login (kèm redirect-back).
  if (!user && !isPublic(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  // Đã đăng nhập mà vào trang login -> đẩy về dashboard.
  if (user && pathname === "/login") {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
