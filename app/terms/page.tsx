import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description: "Điều khoản sử dụng ứng dụng Ví Thu Chi.",
}

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <Link href="/" className="text-primary text-sm hover:underline">
        ← Về trang chủ
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">
        Điều khoản sử dụng
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Cập nhật lần cuối: 11/06/2026
      </p>

      <div className="mt-8 grid gap-6 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_p]:text-muted-foreground">
        <section className="grid gap-2">
          <h2>1. Chấp nhận điều khoản</h2>
          <p>
            Khi sử dụng Ví Thu Chi, bạn đồng ý với các điều khoản dưới đây. Nếu
            không đồng ý, vui lòng không sử dụng ứng dụng.
          </p>
        </section>

        <section className="grid gap-2">
          <h2>2. Mục đích sử dụng</h2>
          <p>
            Ví Thu Chi là công cụ giúp bạn ghi chép và theo dõi thu chi cá nhân.
            Ứng dụng chỉ phục vụ mục đích quản lý tài chính cá nhân, không phải
            dịch vụ tư vấn tài chính, kế toán hay ngân hàng.
          </p>
        </section>

        <section className="grid gap-2">
          <h2>3. Trách nhiệm của bạn</h2>
          <p>
            Bạn chịu trách nhiệm về tính chính xác của dữ liệu mình nhập và bảo
            mật tài khoản đăng nhập (Google/Facebook) của mình. Vui lòng không
            sử dụng ứng dụng cho mục đích vi phạm pháp luật.
          </p>
        </section>

        <section className="grid gap-2">
          <h2>4. Cung cấp &quot;nguyên trạng&quot;</h2>
          <p>
            Ứng dụng được cung cấp &quot;nguyên trạng&quot; (as-is) mà không có
            bảo đảm nào. Chúng tôi nỗ lực giữ dữ liệu chính xác và an toàn nhưng
            không chịu trách nhiệm cho mọi thiệt hại phát sinh từ việc sử dụng,
            mất mát dữ liệu hay gián đoạn dịch vụ.
          </p>
        </section>

        <section className="grid gap-2">
          <h2>5. Thay đổi điều khoản</h2>
          <p>
            Chúng tôi có thể cập nhật điều khoản này theo thời gian. Việc tiếp
            tục sử dụng ứng dụng sau khi thay đổi đồng nghĩa bạn chấp nhận điều
            khoản mới.
          </p>
        </section>

        <section className="grid gap-2">
          <h2>6. Liên hệ</h2>
          <p>
            Liên hệ:{" "}
            <a
              href="mailto:lehuukien270702@gmail.com"
              className="text-primary underline"
            >
              lehuukien270702@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  )
}
