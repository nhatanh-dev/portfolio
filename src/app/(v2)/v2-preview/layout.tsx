import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import styles from "./v2.module.css";
import { v2IsHome } from "@/lib/site";

const anton = Anton({ variable: "--v2-display", weight: "400", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--v2-sans", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--v2-mono", subsets: ["latin"], display: "swap" });

// Indexable only when V2 is the homepage (NEXT_PUBLIC_V2_HOME=1). In the preview build every /v2-preview URL is noindex.
export const metadata: Metadata = {
  robots: v2IsHome ? { index: true, follow: true } : { index: false, follow: false },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${anton.variable} ${inter.variable} ${mono.variable} ${styles.root}`}>
      {children}
    </div>
  );
}
