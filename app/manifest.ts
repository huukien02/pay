import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ví Thu Chi — Quản lý tài chính cá nhân",
    short_name: "Ví Thu Chi",
    description:
      "Quản lý tài chính cá nhân — thu chi, số dư, ngân sách và báo cáo.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    lang: "vi",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  }
}
