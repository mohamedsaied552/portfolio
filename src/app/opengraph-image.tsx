import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mohamed Saied — Software Engineer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: 80,
          background: "linear-gradient(135deg, #030712 0%, #0a1628 50%, #001a33 100%)",
          color: "#f0f4ff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.3em",
            color: "#00d4ff",
            marginBottom: 24,
            textTransform: "uppercase",
          }}
        >
          Software Engineer
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1,
            marginBottom: 24,
            background: "linear-gradient(90deg, #ffffff, #00d4ff)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Mohamed Saied
        </div>
        <div style={{ fontSize: 32, color: "#8892b0" }}>Interactive Experiences · Egypt</div>
      </div>
    ),
    { ...size }
  );
}
