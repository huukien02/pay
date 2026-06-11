import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description:
    "Chính sách bảo mật của Ví Thu Chi — ứng dụng quản lý thu chi cá nhân.",
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <Link href="/" className="text-primary text-sm hover:underline">
        ← Về trang chủ
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">
        Chính sách bảo mật
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Cập nhật lần cuối: 11/06/2026
      </p>

      <div className="mt-8 grid gap-6 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_p]:text-muted-foreground [&_ul]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1">
        <p>
          Ví Thu Chi (&quot;chúng tôi&quot;, &quot;ứng dụng&quot;) tôn trọng
          quyền riêng tư của bạn. Tài liệu này giải thích chúng tôi thu thập,
          sử dụng và bảo vệ thông tin của bạn như thế nào khi bạn sử dụng ứng
          dụng quản lý thu chi cá nhân Ví Thu Chi.
        </p>

        <section className="grid gap-2">
          <h2>1. Thông tin chúng tôi thu thập</h2>
          <ul>
            <li>
              <strong>Thông tin tài khoản:</strong> email và tên hiển thị do
              nhà cung cấp đăng nhập (Google hoặc Facebook) cung cấp khi bạn
              đăng nhập.
            </li>
            <li>
              <strong>Dữ liệu tài chính bạn nhập:</strong> tài khoản tiền, danh
              mục, giao dịch (thu/chi/chuyển khoản) và ngân sách mà bạn tự tạo
              trong ứng dụng.
            </li>
            <li>
              <strong>Dữ liệu kỹ thuật tối thiểu:</strong> cookie phiên đăng
              nhập để giữ bạn ở trạng thái đã đăng nhập.
            </li>
          </ul>
        </section>

        <section className="grid gap-2">
          <h2>2. Cách chúng tôi sử dụng thông tin</h2>
          <p>
            Thông tin chỉ được dùng để cung cấp chức năng của ứng dụng: ghi
            nhận giao dịch, tính số dư, lập ngân sách và hiển thị báo cáo tài
            chính cho riêng bạn. Chúng tôi <strong>không bán</strong>, không
            cho thuê và không chia sẻ dữ liệu của bạn cho mục đích quảng cáo.
          </p>
        </section>

        <section className="grid gap-2">
          <h2>3. Lưu trữ và bảo mật</h2>
          <p>
            Dữ liệu được lưu trên hạ tầng của Supabase (cơ sở dữ liệu Postgres).
            Mỗi người dùng chỉ truy cập được dữ liệu của chính mình nhờ cơ chế
            Row Level Security — không ai khác, kể cả người dùng khác, xem được
            dữ liệu của bạn.
          </p>
        </section>

        <section className="grid gap-2">
          <h2>4. Bên thứ ba</h2>
          <ul>
            <li>
              <strong>Google / Facebook:</strong> chỉ dùng để xác thực đăng
              nhập. Chúng tôi nhận email và tên hiển thị; không truy cập mật
              khẩu hay dữ liệu khác trên tài khoản của bạn.
            </li>
            <li>
              <strong>Supabase:</strong> nhà cung cấp dịch vụ lưu trữ dữ liệu và
              xác thực.
            </li>
          </ul>
        </section>

        <section className="grid gap-2">
          <h2>5. Xóa dữ liệu</h2>
          <p>
            Bạn có thể xóa từng tài khoản tiền, danh mục, giao dịch hoặc ngân
            sách bất cứ lúc nào ngay trong ứng dụng. Nếu muốn xóa toàn bộ tài
            khoản và dữ liệu liên quan, vui lòng liên hệ qua email bên dưới —
            chúng tôi sẽ xóa vĩnh viễn trong thời gian hợp lý.
          </p>
        </section>

        <section className="grid gap-2">
          <h2>6. Liên hệ</h2>
          <p>
            Mọi thắc mắc về quyền riêng tư, vui lòng liên hệ:{" "}
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
