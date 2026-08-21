import Image from "next/image";
import { ArrowRight, ArrowUpRight, Code2, Link2, Mail } from "lucide-react";
import avatarImage from "../../public/avt.jpg";
import HexagonBackground from "./HexagonBackground";
import ScrambleText from "./ScrambleText";
import ScrollReveal from "./ScrollReveal";

const quickFacts = [
  { label: "Primary focus", value: ".NET + AWS" },
  { label: "Availability", value: "Internship / Part-time" },
  { label: "Graduation", value: "June 2027" },
];

const profileLinks = [
  {
    label: "GitHub",
    href: "https://github.com/nhatanh-dev",
    icon: Code2,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/anhnguyen2505/",
    icon: Link2,
  },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden"
    >
      <div className="hero-backdrop pointer-events-none absolute inset-0" aria-hidden="true" />
      
      {/* 3D Network Particle Effect */}
      <HexagonBackground />

      <div className="relative mx-auto w-full max-w-7xl px-5 pt-28 pb-16 sm:px-8 sm:pt-32 sm:pb-20 lg:pt-24 lg:pb-16 z-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          <div className="max-w-3xl lg:col-span-7">
            <ScrollReveal delay={0.05}>
              <p className="mb-5 text-xs font-bold tracking-[0.16em] text-[var(--accent)] uppercase">
                Nguyen Pham Nhat Anh
              </p>
            </ScrollReveal>

            <h1 className="text-[clamp(2.55rem,6.4vw,5.75rem)] leading-[0.94] font-bold tracking-[-0.06em] text-[var(--foreground)]">
              <ScrollReveal delay={0.15}>
                <span className="block whitespace-nowrap"><ScrambleText text="Backend systems." /></span>
              </ScrollReveal>
              <ScrollReveal delay={0.25}>
                <span className="block whitespace-nowrap text-[var(--accent)]"><ScrambleText text="Cloud-ready." /></span>
              </ScrollReveal>
            </h1>

            <ScrollReveal delay={0.35}>
              <p className="mt-7 max-w-[56ch] text-lg leading-8 text-[var(--foreground-soft)] sm:text-xl sm:leading-9">
                Software Engineering student focused on .NET, real-time workflows, and AWS
                infrastructure for production-minded teams.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.45}>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="interactive-control inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--accent)] bg-[var(--accent)] px-5 text-sm font-bold whitespace-nowrap text-[var(--accent-ink)] hover:bg-[var(--accent-strong)] active:scale-[0.98]"
                >
                  View projects
                  <ArrowRight size={16} className="control-arrow" aria-hidden="true" />
                </a>
                <a
                  href="mailto:anhnguyenphamnhat@gmail.com"
                  className="interactive-control inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-strong)] px-5 text-sm font-bold whitespace-nowrap text-[var(--foreground)] hover:border-[var(--accent)] hover:bg-[rgba(98,198,223,0.08)] active:scale-[0.98]"
                >
                  <Mail size={16} aria-hidden="true" />
                  Email me
                </a>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.2} className="relative mx-auto w-full max-w-[15rem] sm:max-w-[19rem] lg:col-span-5 lg:mr-0 lg:max-w-[22rem]">
            <figure className="portrait-frame relative aspect-[4/5] overflow-hidden rounded-[var(--radius-surface)] border border-[var(--border-strong)] bg-[var(--surface)]">
              <Image
                src={avatarImage}
                alt="Portrait of Nguyen Pham Nhat Anh wearing an AWS shirt"
                fill
                className="object-cover object-[center_78%] saturate-[0.9] contrast-[1.02] transition-transform duration-700 hover:scale-105"
                loading="eager"
                placeholder="blur"
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 304px, 352px"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(4,10,16,0.18),transparent_35%)]"
              />
            </figure>
          </ScrollReveal>
        </div>
      </div>

      <aside aria-label="Quick portfolio facts" className="relative border-y border-[var(--border)] bg-[rgba(4,10,16,0.22)] z-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1fr_1fr_1fr_1.45fr]">
          {quickFacts.map((fact, i) => (
            <ScrollReveal key={fact.label} delay={0.1 * i} className="border-b border-[var(--border)] py-5 sm:border-r sm:px-5 sm:first:pl-0 sm:[&:nth-child(2)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r">
              <p className="text-xs font-semibold tracking-[0.08em] text-[var(--muted)] uppercase">
                {fact.label}
              </p>
              <p className="mt-1.5 text-sm font-semibold text-[var(--foreground)] sm:text-base">
                {fact.value}
              </p>
            </ScrollReveal>
          ))}

          <ScrollReveal delay={0.4} className="flex flex-wrap items-center gap-2 py-4 sm:px-5 lg:justify-end lg:pr-0">
            {profileLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-control group inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-white/[0.018] px-3 text-sm font-semibold text-[var(--foreground-soft)] active:scale-[0.98]"
              >
                <Icon size={15} className="text-[var(--accent)]" aria-hidden="true" />
                {label}
                <ArrowUpRight size={14} className="social-arrow text-[var(--muted)]" aria-hidden="true" />
              </a>
            ))}
          </ScrollReveal>
        </div>
      </aside>
    </section>
  );
}
