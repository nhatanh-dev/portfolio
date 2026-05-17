"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Code2, Mail, Phone, Link2, ArrowDown, ExternalLink } from "lucide-react";

const contactLinks = [
  {
    icon: Code2,
    label: "GitHub",
    href: "https://github.com/nhatanh-dev",
    display: "nhatanh-dev",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:anhnguyenphamnhat@gmail.com",
    display: "anhnguyenphamnhat@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    href: "tel:+84559371255",
    display: "0559 371 255",
  },
  {
    icon: Link2,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/anhnguyen2505/",
    display: "LinkedIn",
  },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden overflow-x-hidden"
    >
      {/* Background radial glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -5%, rgba(56,189,248,0.14) 0%, transparent 65%), radial-gradient(ellipse 55% 50% at 90% 90%, rgba(249,115,22,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Animated grid dots */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #38bdf8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
        {/* 2-column grid on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Badge */}
            <motion.div {...fadeUp(0.1)} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[rgba(56,189,248,0.08)] border border-[rgba(56,189,248,0.2)] text-[#38bdf8] tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse-slow" />
                Available for Internship / Part-time
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              {...fadeUp(0.2)}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-4"
            >
              Nguyen Pham
              <br />
              <span className="text-gradient">Nhat Anh</span>
            </motion.h1>

            {/* Title */}
            <motion.p
              {...fadeUp(0.3)}
              className="text-base sm:text-lg font-mono text-slate-400 mb-8 tracking-wide"
            >
              <span className="text-[#38bdf8]">&gt;</span>{" "}
              Software Engineering Student
              <span className="text-[#f97316] mx-2">|</span>
              Cloud &amp; Backend Enthusiast
            </motion.p>

            {/* Bio */}
            <motion.p
              {...fadeUp(0.4)}
              className="text-base text-slate-400 leading-relaxed max-w-xl mb-10 border-l-2 border-[rgba(56,189,248,0.3)] pl-4"
            >
              Motivated 3rd-year Software Engineering student. I am passionate about{" "}
              <span className="text-slate-200">backend development</span>,{" "}
              <span className="text-slate-200">cloud infrastructure</span>, and{" "}
              <span className="text-slate-200">software architecture</span>. Currently focusing on
              building scalable systems and expanding my knowledge in modern cloud technologies.
            </motion.p>

            {/* Contact links */}
            <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-3 mb-12">
              {contactLinks.map(({ icon: Icon, label, href, display }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] text-slate-300 hover:text-[#38bdf8] hover:border-[rgba(56,189,248,0.3)] hover:bg-[rgba(56,189,248,0.06)] transition-all duration-200"
                >
                  <Icon size={15} className="text-[#38bdf8] group-hover:scale-110 transition-transform" />
                  <span>{display}</span>
                  {href.startsWith("http") && <ExternalLink size={11} className="opacity-40" />}
                </a>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div {...fadeUp(0.6)} className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] text-[#050c1a] hover:shadow-lg hover:shadow-[rgba(56,189,248,0.35)] transition-all duration-300 hover:-translate-y-0.5"
              >
                View Projects
              </a>
              <a
                href="mailto:anhnguyenphamnhat@gmail.com"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm border border-[rgba(56,189,248,0.3)] text-slate-200 hover:bg-[rgba(56,189,248,0.08)] transition-all duration-300 hover:-translate-y-0.5"
              >
                Contact Me
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN — Avatar ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
            className="flex justify-center lg:justify-end"
          >
            {/* Outer glow ring */}
            <div className="relative">
              {/* Rotating gradient ring */}
              <div
                className="absolute -inset-[3px] rounded-full opacity-70"
                style={{
                  background:
                    "conic-gradient(from 0deg, #38bdf8, #0ea5e9, #f97316, #38bdf8)",
                  animation: "spin 8s linear infinite",
                  filter: "blur(2px)",
                }}
              />
              {/* Glow pulse behind avatar — clipped to parent to prevent overflow */}
              <div
                className="absolute -inset-6 rounded-full opacity-20 blur-2xl overflow-hidden"
                style={{ background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)" }}
              />
              {/* Avatar frame */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-2 border-[rgba(56,189,248,0.25)] bg-[#0d1630]">
                {/*
                  ─────────────────────────────────────────────────────
                  Replace the src below with your real photo:
                    src="/avatar.jpg"   ← put your file in /public/avatar.jpg
                  ─────────────────────────────────────────────────────
                */}
                <Image
                  src="/avt.jpg"
                  alt="Nguyen Pham Nhat Anh — profile photo"
                  fill
                  className="object-cover object-[center_90%]"
                  priority
                  unoptimized
                  sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 320px"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600"
      >
        <span className="text-[10px] tracking-widest uppercase font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
