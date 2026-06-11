import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

// Apple touch icon (iOS "Thêm vào màn hình chính"). iOS tự bo góc.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#4F46E5",
          color: "white",
          fontSize: 120,
          fontWeight: 700,
        }}
      >
        đ
      </div>
    ),
    { ...size }
  )
}
