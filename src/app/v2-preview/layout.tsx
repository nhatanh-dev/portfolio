import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import styles from "./v2.module.css";

const anton = Anton({ variable: "--v2-display", weight: "400", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--v2-sans", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--v2-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Nguyen Pham Nhat Anh (Alvin Nguyen) | V2 Preview",
  robots: { index: false, follow: false },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${anton.variable} ${inter.variable} ${mono.variable} ${styles.root}`}>
      {children}
    </div>
  );
}
