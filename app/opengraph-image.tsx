import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Torah Skits — a new parsha skit every week";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#2c2519",
          color: "#f3ead7",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 9999,
            border: "10px solid #e0b455",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#e0b455",
            fontSize: 120,
            marginBottom: 36,
          }}
        >
          ת
        </div>
        <div style={{ fontSize: 76, fontWeight: 900 }}>Torah Skits</div>
        <div style={{ fontSize: 34, color: "#cdbd9e", marginTop: 14 }}>
          A new parsha skit every week
        </div>
      </div>
    ),
    { ...size }
  );
}
