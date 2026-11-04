import { ImageResponse } from "next/og";
import { person } from "@/lib/site";

export const dynamic = "force-static";

/** Shared 1200x630 social preview for V2 pages: the site's Ink, Warm Paper and Vermilion, with the name and role only. */
export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#111112", color: "#F5F0E8", fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, padding: "0 0 0 84px" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#E45B47", fontWeight: 700 }}>{person.alias.toUpperCase()}</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 26, fontSize: 104, lineHeight: 0.95, fontWeight: 800, textTransform: "uppercase" }}>
            <span>Nguyen Pham</span>
            <span style={{ color: "#E45B47" }}>Nhat Anh.</span>
          </div>
          <div style={{ display: "flex", marginTop: 36, fontSize: 34, color: "#AEB0AE" }}>Backend &amp; Cloud Developer</div>
        </div>
        <div style={{ display: "flex", width: 330, height: "100%", background: "#E45B47", clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)" }} />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
