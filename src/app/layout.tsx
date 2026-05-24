import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import Script from "next/script";
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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${archivo.variable} ${spaceGrotesk.variable} antialiased overflow-x-hidden w-full`}
        suppressHydrationWarning
      >
        <Script
          id="remove-extension-hydration-attrs"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var attr = "bis_skin_checked";
                function clean(root) {
                  if (!root || root.nodeType !== 1) return;
                  if (root.hasAttribute && root.hasAttribute(attr)) {
                    root.removeAttribute(attr);
                  }
                  if (root.querySelectorAll) {
                    root.querySelectorAll("[" + attr + "]").forEach(function (node) {
                      node.removeAttribute(attr);
                    });
                  }
                }
                clean(document.documentElement);
                var observer = new MutationObserver(function (mutations) {
                  mutations.forEach(function (mutation) {
                    if (mutation.type === "attributes" && mutation.attributeName === attr) {
                      mutation.target.removeAttribute(attr);
                    }
                    mutation.addedNodes.forEach(clean);
                  });
                });
                observer.observe(document.documentElement, {
                  subtree: true,
                  childList: true,
                  attributes: true,
                  attributeFilter: [attr]
                });
                window.addEventListener("load", function () {
                  window.setTimeout(function () {
                    clean(document.documentElement);
                    observer.disconnect();
                  }, 1500);
                });
              })();
            `,
          }}
        />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
