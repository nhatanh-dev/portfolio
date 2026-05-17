import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // metadataBase is required for absolute OG image URLs when deploying to Vercel
  metadataBase: new URL("https://npna.dev"),

  title: {
    default: "Nguyen Pham Nhat Anh | Backend & Cloud Developer",
    template: "%s | Nguyen Pham Nhat Anh",
  },
  description:
    "Personal portfolio of Nguyen Pham Nhat Anh — 3rd-year Software Engineering student specialising in .NET, AWS, and scalable backend systems.",
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
      "Software Engineering student passionate about backend development, cloud infrastructure, and software architecture.",
    images: [
      {
        url: "/og-image.png", // place a 1200×630 image in /public/og-image.png
        width: 1200,
        height: 630,
        alt: "Nguyen Pham Nhat Anh — Backend & Cloud Developer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Nguyen Pham Nhat Anh | Backend & Cloud Developer",
    description:
      "Software Engineering student passionate about backend, cloud, and scalable systems.",
    images: ["/og-image.png"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden w-full`}
      >
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
