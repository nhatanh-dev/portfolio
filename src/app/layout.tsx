import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://npna.dev"),
  title: {
    default: "Nguyen Pham Nhat Anh | Backend & Cloud Developer",
    template: "%s | Nguyen Pham Nhat Anh",
  },
  description:
    "Portfolio of Nguyen Pham Nhat Anh, a Software Engineering student focused on .NET, AWS, real-time systems, and cloud infrastructure.",
  keywords: [
    "backend developer",
    "cloud developer",
    ".NET",
    "AWS",
    "portfolio",
    "software engineering",
    "FPT University",
    "SignalR",
    "Docker",
    "ECS",
  ],
  authors: [{ name: "Nguyen Pham Nhat Anh", url: "https://github.com/nhatanh-dev" }],
  creator: "Nguyen Pham Nhat Anh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://npna.dev",
    siteName: "Nguyen Pham Nhat Anh",
    title: "Nguyen Pham Nhat Anh | Backend & Cloud Developer",
    description:
      "Software Engineering student building dependable backend systems and cloud infrastructure.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nguyen Pham Nhat Anh | Backend & Cloud Developer",
    description:
      "Software Engineering student building dependable backend systems and cloud infrastructure.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${archivo.variable} ${spaceGrotesk.variable} w-full overflow-x-hidden antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
