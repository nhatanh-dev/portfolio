"use client";

import { useState } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BatteryCharging,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  ImagePlus,
  Monitor,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  role: string;
  period: string;
  summary: string;
  outcome: string;
  tech: string[];
  highlights: string[];
  accent: string;
  icon: LucideIcon;
  repositoryUrl?: string;
  liveUrl?: string;
  imageSlots: {
    label: string;
    path: string;
    description: string;
  }[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "EV Station Management System",
    role: "Backend Developer",
    period: "09/2025 - 11/2025",
    summary:
      "A charging-station management platform focused on live session tracking, billing events, penalties, and operator visibility.",
    outcome: "Real-time charging status, session alerts, and safer concurrent station handling.",
    tech: [".NET", "EF Core", "SQL Server", "SignalR", "VNPay"],
    highlights: [
      "Built SignalR channels for live battery percentage, remaining time, and charging-session state updates.",
      "Implemented notifications for start, finish, fault, penalty, and timeout events.",
      "Designed concurrent-safe logic for session timeouts, penalty calculation, and multi-station scenarios.",
    ],
    accent: "#38bdf8",
    icon: BatteryCharging,
    imageSlots: [
      {
        label: "Landing Page",
        path: "/projects/evolt-landing.png",
        description: "Public EV charging landing page with hero banner and login entry.",
      },
      {
        label: "Dashboard",
        path: "/projects/evolt-dashboard.png",
        description: "User dashboard with map-based station search and current vehicle panel.",
      },
    ],
  },
  {
    id: 2,
    title: "SmartInvoice Shield",
    role: "Cloud & Backend Developer",
    period: "01/2026 - 04/2026",
    summary:
      "An automated invoice-processing system with cloud deployment, containerized services, and resilient data ingestion.",
    outcome: "AWS ECS deployment flow with rolling updates and a PostgreSQL pipeline ready for high-volume invoice intake.",
    tech: [".NET 9", "PostgreSQL", "AWS", "Docker", "ECS"],
    highlights: [
      "Architected AWS infrastructure with ECS, ALB, and Auto Scaling for production-style deployment.",
      "Containerized backend services with Docker and deployed them to ECS Fargate.",
      "Planned PostgreSQL indexes and ingestion flow for dependable invoice processing under load.",
    ],
    accent: "#f97316",
    icon: ShieldCheck,
    imageSlots: [
      {
        label: "AWS architecture",
        path: "/projects/smartinvoice-aws-architecture.png",
        description: "Cloud architecture with Amplify, CloudFront, ECS Fargate, ALB, PostgreSQL, SQS, and CI/CD flow.",
      },
    ],
  },
];

function ProjectMediaCarousel({
  accent,
  projectTitle,
  slots,
}: {
  accent: string;
  projectTitle: string;
  slots: Project["imageSlots"];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedPaths, setFailedPaths] = useState<string[]>([]);
  const activeSlot = slots[activeIndex] ?? slots[0];
  const hasMultiple = slots.length > 1;
  const failed = failedPaths.includes(activeSlot.path);

  const goTo = (index: number) => {
    const nextIndex = (index + slots.length) % slots.length;
    setActiveIndex(nextIndex);
  };

  return (
    <figure className="group/screen relative overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/35">
      <div className="flex h-8 items-center gap-1.5 border-b border-white/8 bg-white/[0.035] px-3">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-amber-300/70" />
        <span className="h-2 w-2 rounded-full bg-emerald-300/70" />
        <span className="ml-2 truncate text-[11px] font-medium text-slate-500">{activeSlot.label}</span>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden bg-[#f8fafc] sm:aspect-video">
        {!failed ? (
          <Image
            key={activeSlot.path}
            src={activeSlot.path}
            alt={`${activeSlot.label} screenshot for ${projectTitle}`}
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-contain transition-transform duration-500 group-hover/screen:scale-[1.015]"
            loading="lazy"
            unoptimized
            onError={() => setFailedPaths((paths) => [...new Set([...paths, activeSlot.path])])}
          />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-35"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
              <ImagePlus size={26} style={{ color: accent }} aria-hidden="true" className="mb-3" />
              <p className="text-sm font-semibold text-white">{activeSlot.label}</p>
              <p className="mt-2 max-w-[15rem] text-xs leading-relaxed text-slate-500">
                Add image at <span className="font-mono text-slate-300">{activeSlot.path}</span>
              </p>
            </div>
          </>
        )}

        {hasMultiple && (
          <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover/screen:opacity-100">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous project screenshot"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#071122]/85 text-slate-200 shadow-lg shadow-black/30 transition-all duration-200 hover:border-white/30 hover:bg-[#0e1a31] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8]"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next project screenshot"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#071122]/85 text-slate-200 shadow-lg shadow-black/30 transition-all duration-200 hover:border-white/30 hover:bg-[#0e1a31] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8]"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <figcaption className="border-t border-white/8 bg-[#071122]/80 px-3.5 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-200">{activeSlot.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{activeSlot.description}</p>
          </div>
          {hasMultiple && (
            <div className="flex flex-wrap gap-1.5">
              {slots.map((slot, index) => (
                <button
                  key={slot.path}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Show ${slot.label}`}
                  aria-pressed={index === activeIndex}
                  className="min-h-8 cursor-pointer rounded-md border px-2.5 text-[11px] font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8]"
                  style={{
                    borderColor: index === activeIndex ? `${accent}70` : "rgba(255,255,255,0.1)",
                    background: index === activeIndex ? `${accent}18` : "rgba(255,255,255,0.03)",
                    color: index === activeIndex ? "#ffffff" : "#94a3b8",
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

function ProjectAction({
  href,
  icon: Icon,
  children,
}: {
  href?: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  if (!href) {
    return (
      <span className="inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3.5 py-2 text-sm font-semibold text-slate-500">
        <Icon size={15} aria-hidden="true" />
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(56,189,248,0.35)] hover:bg-[rgba(56,189,248,0.08)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8]"
    >
      <Icon size={15} aria-hidden="true" />
      {children}
      <ArrowUpRight size={13} aria-hidden="true" className="opacity-60" />
    </a>
  );
}

export default function ProjectsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="projects" ref={ref} className="relative py-24">
      <div
        className="pointer-events-none absolute left-0 top-1/3 h-[35rem] w-[35rem] max-w-full rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #38bdf8, transparent 70%)" }}
      />

      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 grid gap-5 lg:grid-cols-[0.85fr_1fr] lg:items-end"
        >
          <div>
            <p className="mb-2 font-mono text-sm tracking-widest text-[#38bdf8]">
              04. PROJECTS
            </p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Featured <span className="text-gradient">case studies</span>
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Each project now has space for product context, engineering impact, repository links,
            demo links, and screenshot frames. Drop your real UI images into{" "}
            <span className="font-mono text-slate-200">public/projects</span> and update the paths
            in this component when they are ready.
          </p>
        </motion.div>

        <div className="space-y-10">
          {projects.map((project, i) => {
            const Icon = project.icon;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.12 * i }}
                className="gradient-border group overflow-hidden rounded-2xl p-5 card-hover sm:p-7"
              >
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                  <div>
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl border"
                        style={{
                          background: `${project.accent}14`,
                          borderColor: `${project.accent}30`,
                        }}
                      >
                        <Icon size={22} style={{ color: project.accent }} aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                        <p className="text-sm font-semibold" style={{ color: project.accent }}>
                          {project.role}
                        </p>
                      </div>
                    </div>

                    <div className="mb-5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Calendar size={12} aria-hidden="true" />
                      {project.period}
                    </div>

                    <p className="max-w-xl text-sm leading-relaxed text-slate-400">
                      {project.summary}
                    </p>

                    <div className="mt-5 rounded-xl border border-white/8 bg-white/[0.025] p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                        <CheckCircle2 size={14} style={{ color: project.accent }} aria-hidden="true" />
                        Engineering outcome
                      </div>
                      <p className="text-sm leading-relaxed text-slate-300">{project.outcome}</p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-md px-2.5 py-1 text-xs font-semibold"
                          style={{
                            background: `${project.accent}10`,
                            border: `1px solid ${project.accent}28`,
                            color: project.accent,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <ProjectAction href={project.repositoryUrl} icon={Code2}>
                        GitHub repo
                      </ProjectAction>
                      <ProjectAction href={project.liveUrl} icon={Monitor}>
                        Live preview
                      </ProjectAction>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <ProjectMediaCarousel
                      accent={project.accent}
                      projectTitle={project.title}
                      slots={project.imageSlots}
                    />

                    <div>
                      <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Implementation notes
                      </div>
                      <ul className="space-y-3">
                        {project.highlights.map((h, idx) => (
                          <li key={idx} className="flex gap-3 text-sm leading-relaxed text-slate-400">
                            <span
                              className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-bold"
                              style={{
                                background: `${project.accent}12`,
                                color: project.accent,
                              }}
                            >
                              {idx + 1}
                            </span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
