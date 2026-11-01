import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "siboost. Websites built for the way people search now."

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "white",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 800, color: "#2563EB", letterSpacing: -4 }}>siboost</div>
        <div style={{ marginTop: 24, fontSize: 36, color: "#0F172A", maxWidth: 860, lineHeight: 1.3 }}>
          Websites built for the way people search now.
        </div>
      </div>
    ),
    size,
  )
}
