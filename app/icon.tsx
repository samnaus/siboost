import { ImageResponse } from "next/og"

export const size = { width: 64, height: 64 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "64px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2563EB",
          color: "white",
          fontSize: 40,
          fontWeight: 800,
          borderRadius: 16,
        }}
      >
        s
      </div>
    ),
    size,
  )
}
