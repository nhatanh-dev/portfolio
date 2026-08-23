import { ImageResponse } from "next/og";

export const alt = "Nguyen Pham Nhat Anh, Backend and Cloud Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#07111a",
        color: "#f2f7f8",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
        <div
          style={{
            display: "flex",
            color: "#62c6df",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.14em",
          }}
        >
          NPNA.DEV
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 72,
            lineHeight: 0.98,
            fontWeight: 700,
            letterSpacing: "-0.055em",
          }}
        >
          Nguyen Pham Nhat Anh
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            color: "#c7d4d9",
            fontSize: 31,
            lineHeight: 1.3,
          }}
        >
          Backend systems. Cloud infrastructure. Dependable delivery.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 34,
            color: "#8bd9eb",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          .NET / AWS / Real-time systems
        </div>
      </div>

      <div
        style={{
          width: 230,
          height: 360,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid rgba(98,198,223,0.5)",
          borderRadius: 28,
          background: "#10212e",
          color: "#62c6df",
          fontSize: 92,
          fontWeight: 700,
          letterSpacing: "-0.08em",
        }}
      >
        NP
      </div>
    </div>,
    size,
  );
}
