import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = "Ví Thu Chi";
const description =
  "Theo dõi thu chi, số dư, ngân sách và báo cáo tài chính cá nhân ở một nơi. Chính xác đến từng đồng, bảo mật theo từng người dùng.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Quản lý tài chính cá nhân`,
    template: `%s · ${siteName}`,
  },
  description,
  applicationName: siteName,
  keywords: [
    "quản lý tài chính cá nhân",
    "quản lý chi tiêu",
    "sổ thu chi",
    "ngân sách cá nhân",
    "theo dõi chi tiêu",
    "personal finance",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName,
    title: `${siteName} — Quản lý tài chính cá nhân`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Quản lý tài chính cá nhân`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#4F46E5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${fontSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
