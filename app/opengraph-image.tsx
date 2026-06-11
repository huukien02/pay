import { ImageResponse } from "next/og"

export const alt = "Ví Thu Chi — Quản lý tài chính cá nhân"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Ảnh OG (preview khi share). Next tự gắn vào og:image + twitter:image.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0b1220",
          color: "white",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              background: "#4f46e5",
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            PF
          </div>
          <div style={{ fontSize: 36, fontWeight: 600 }}>Ví Thu Chi</div>
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            marginTop: 40,
            lineHeight: 1.1,
            maxWidth: 980,
          }}
        >
          Quản lý tài chính cá nhân, đơn giản và chính xác
        </div>
        <div style={{ fontSize: 30, color: "#94a3b8", marginTop: 28 }}>
          Thu chi · Số dư · Ngân sách · Báo cáo
        </div>
      </div>
    ),
    { ...size }
  )
}
