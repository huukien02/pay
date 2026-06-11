import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  PiggyBank,
  Wallet,
  ArrowLeftRight,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LinkButton,
} from "@/components/core"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

// JSON-LD (schema.org) — giúp Google hiểu đây là ứng dụng tài chính web.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Ví Thu Chi",
  description:
    "Theo dõi thu chi, số dư, ngân sách và báo cáo tài chính cá nhân ở một nơi.",
  url: siteUrl,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  inLanguage: "vi-VN",
  offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
  featureList: [
    "Quản lý nhiều tài khoản tiền",
    "Ghi nhận thu, chi và chuyển khoản",
    "Đặt ngân sách theo tháng",
    "Báo cáo số dư và biểu đồ chi tiêu",
  ],
}

const FEATURES = [
  {
    icon: Wallet,
    title: "Nhiều tài khoản",
    desc: "Tiền mặt, ngân hàng, thẻ tín dụng, tiết kiệm — theo dõi mọi nguồn tiền.",
  },
  {
    icon: ArrowLeftRight,
    title: "Thu / chi / chuyển khoản",
    desc: "Ghi nhận giao dịch nhanh; chuyển khoản nội bộ luôn cân số dư.",
  },
  {
    icon: PiggyBank,
    title: "Ngân sách theo tháng",
    desc: "Đặt hạn mức cho từng danh mục và theo dõi mức chi thực tế.",
  },
  {
    icon: BarChart3,
    title: "Báo cáo trực quan",
    desc: "Số dư, dòng tiền và biểu đồ chi tiêu cập nhật theo thời gian thực.",
  },
]

const STEPS = [
  {
    n: 1,
    title: "Tạo tài khoản tiền",
    desc: "Thêm ví, tài khoản ngân hàng hoặc thẻ bạn đang dùng.",
  },
  {
    n: 2,
    title: "Phân loại danh mục",
    desc: "Lập danh mục thu/chi như Ăn uống, Lương, Đi lại...",
  },
  {
    n: 3,
    title: "Ghi giao dịch",
    desc: "Nhập khoản thu, chi hoặc chuyển khoản chỉ trong vài giây.",
  },
  {
    n: 4,
    title: "Đặt ngân sách & theo dõi",
    desc: "Xem dashboard số dư, biểu đồ và so chi tiêu với ngân sách.",
  },
]

const AUDIENCES = [
  {
    title: "Sinh viên & người mới đi làm",
    desc: "Kiểm soát chi tiêu hằng tháng, tránh cháy túi cuối tháng và tập thói quen tiết kiệm từ sớm.",
  },
  {
    title: "Người đi làm bận rộn",
    desc: "Ghi giao dịch trong vài giây, xem báo cáo ngay và đặt ngân sách cho từng khoản chi.",
  },
  {
    title: "Gia đình",
    desc: "Theo dõi các khoản thu chi chung, lên kế hoạch tiết kiệm cho những mục tiêu lớn.",
  },
  {
    title: "Freelancer & kinh doanh nhỏ",
    desc: "Quản lý nhiều tài khoản, tách bạch dòng tiền cá nhân và công việc rõ ràng.",
  },
]

const FAQS = [
  {
    q: "Ví Thu Chi là gì?",
    a: "Ví Thu Chi là ứng dụng quản lý thu chi và tài chính cá nhân, giúp bạn ghi lại các khoản thu, chi, chuyển khoản, theo dõi số dư tài khoản và ngân sách hằng tháng — hoàn toàn bằng tiền Việt (VND).",
  },
  {
    q: "Ứng dụng quản lý chi tiêu này có miễn phí không?",
    a: "Có. Ví Thu Chi miễn phí cho nhu cầu quản lý chi tiêu cá nhân hằng ngày.",
  },
  {
    q: "Dữ liệu tài chính của tôi có an toàn không?",
    a: "An toàn. Mỗi người dùng chỉ truy cập được dữ liệu của chính mình nhờ cơ chế bảo mật theo từng tài khoản (Row Level Security). Bạn đăng nhập bằng Google hoặc Facebook, không cần đặt mật khẩu riêng.",
  },
  {
    q: "Tôi có thể quản lý nhiều tài khoản tiền không?",
    a: "Có. Bạn thêm được nhiều tài khoản như tiền mặt, ngân hàng, thẻ tín dụng, tiết kiệm và theo dõi số dư của từng tài khoản.",
  },
  {
    q: "Ví Thu Chi có theo dõi ngân sách không?",
    a: "Có. Bạn đặt ngân sách cho từng danh mục theo tháng, ứng dụng tự so sánh mức chi thực tế với hạn mức và cảnh báo khi vượt.",
  },
  {
    q: "Tôi có cần cài đặt ứng dụng không?",
    a: "Không. Ví Thu Chi chạy trực tiếp trên trình duyệt và có thể thêm vào màn hình chính điện thoại như một ứng dụng (PWA).",
  },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
}

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Header */}
      <header className="bg-background/70 sticky top-0 z-30 border-b backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          <span className="flex items-center gap-2 font-semibold">
            <span className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md text-xs font-bold">
              ₫
            </span>
            Ví Thu Chi
          </span>
          <div className="flex items-center gap-2">
            <LinkButton href="/login">Khám Phá</LinkButton>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* gradient trang trí */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[28rem] bg-[radial-gradient(60%_60%_at_50%_0%,var(--primary)_0%,transparent_70%)] opacity-15"
          />
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 py-20 text-center sm:py-28">
            <span className="border-primary/20 bg-primary/5 text-primary inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
              Tài chính cá nhân
            </span>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">
              Quản lý tài chính cá nhân,{" "}
              <span className="text-primary">đơn giản và chính xác</span>
            </h1>
            <p className="text-muted-foreground max-w-xl text-lg text-pretty">
              Theo dõi thu chi, số dư và ngân sách ở một nơi. Mọi con số được
              tính chính xác và bảo mật theo từng người dùng.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <LinkButton size="lg" href="/login">
                Bắt đầu miễn phí
                <ArrowRight aria-hidden />
              </LinkButton>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-5xl px-4">

        {/* Features */}
        <section className="grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <f.icon className="text-primary size-6" aria-hidden />
                <CardTitle className="mt-2 text-base">{f.title}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        {/* Nội dung mô tả — tăng chiều sâu chủ đề cho SEO */}
        <section className="mx-auto max-w-3xl pb-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Quản lý chi tiêu cá nhân chưa bao giờ dễ đến thế
          </h2>
          <div className="text-muted-foreground mt-4 grid gap-4 leading-relaxed">
            <p>
              <strong className="text-foreground">Ví Thu Chi</strong> giúp bạn
              nắm rõ tiền của mình đi đâu mỗi ngày. Chỉ vài thao tác để ghi lại
              một khoản thu hay chi, ứng dụng tự động cập nhật số dư của từng tài
              khoản và tổng hợp thành báo cáo trực quan. Nhờ đó bạn biết chính
              xác mình đang tiêu vào đâu, tiết kiệm được bao nhiêu và điều chỉnh
              thói quen chi tiêu kịp thời.
            </p>
            <p>
              Khác với ghi chép thủ công trên giấy hay file Excel, Ví Thu Chi
              tính toán mọi con số bằng cơ sở dữ liệu nên luôn{" "}
              <strong className="text-foreground">chính xác đến từng đồng</strong>
              , không lo sai số. Bạn có thể đặt ngân sách cho từng danh mục như
              ăn uống, đi lại, mua sắm và theo dõi mức chi thực tế so với hạn mức
              ngay trên dashboard.
            </p>
            <p>
              Ứng dụng chạy trực tiếp trên trình duyệt, miễn phí và bảo mật — dữ
              liệu của bạn chỉ mình bạn xem được. Đăng nhập nhanh bằng Google
              hoặc Facebook và{" "}
              <Link
                href="/login"
                className="text-primary underline underline-offset-4"
              >
                bắt đầu quản lý chi tiêu cá nhân
              </Link>{" "}
              ngay hôm nay.
            </p>
          </div>
        </section>

        {/* Dành cho ai — từ khóa theo đối tượng */}
        <section className="pb-16">
          <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight">
            Ví Thu Chi dành cho ai?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {AUDIENCES.map((a) => (
              <Card key={a.title}>
                <CardHeader>
                  <CardTitle className="text-base">{a.title}</CardTitle>
                  <CardDescription>{a.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="pb-20">
          <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight">
            Bắt đầu trong 4 bước
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n}>
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full font-semibold">
                      {s.n}
                    </div>
                    <h3 className="mt-3 font-medium">{s.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {s.desc}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ — nội dung giàu từ khóa + dữ liệu có cấu trúc (FAQPage) */}
        <section className="pb-20">
          <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight">
            Câu hỏi thường gặp
          </h2>
          <div className="mx-auto grid max-w-3xl gap-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-lg border px-4 py-3 [&_summary]:cursor-pointer"
              >
                <summary className="flex items-center justify-between gap-4 font-medium list-none">
                  {f.q}
                  <span className="text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="text-muted-foreground mt-2 text-sm">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        </div>
      </main>

      <footer className="border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-sm sm:flex-row">
          <span>Ví Thu Chi — dự án cá nhân.</span>
          <nav className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Điều khoản
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
