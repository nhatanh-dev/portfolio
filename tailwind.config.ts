import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#050c1a",
          900: "#080f1f",
          800: "#0d1630",
          700: "#111d3f",
          600: "#162450",
        },
        accent: {
          blue: "#38bdf8",
          "blue-dim": "#0ea5e9",
          orange: "#f97316",
          "orange-dim": "#ea6c0a",
          glow: "rgba(56,189,248,0.15)",
        },
        surface: {
          DEFAULT: "#0f172a",
          card: "#111827",
          border: "rgba(56,189,248,0.12)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(56,189,248,0.15), transparent), radial-gradient(ellipse 60% 60% at 100% 100%, rgba(249,115,22,0.06), transparent)",
        "card-gradient":
          "linear-gradient(135deg, rgba(17,24,39,0.9) 0%, rgba(13,22,48,0.9) 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
