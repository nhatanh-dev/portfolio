import type { Metadata, Viewport } from "next";
import "./v2-base.css";
import { person, siteUrl } from "@/lib/site";

/**
 * Root layout for the V2 portfolio. It carries none of the legacy chrome: no legacy fonts, Tailwind utilities, grain overlay or
 * dark-teal body styling. The V2 fonts and the page root live in v2-preview/layout.tsx; the reset it relies on is in v2-base.css.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${person.name} | Backend & Cloud Developer`, template: `%s | ${person.name}` },
  applicationName: person.name,
  authors: [{ name: person.name, url: person.github }],
  creator: person.name,
  openGraph: { type: "website", locale: "en_US", siteName: person.name },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#111112" };

export default function V2RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="v2-skip">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
