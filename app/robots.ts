import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Khu vực sau đăng nhập + callback: không index.
      disallow: [
        "/dashboard",
        "/accounts",
        "/categories",
        "/transactions",
        "/budgets",
        "/auth/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
