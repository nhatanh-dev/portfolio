"use client";

import { useState, useEffect } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BatteryCharging,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import evoltLanding from "../../public/projects/evolt-landing.png";
import evoltDashboard from "../../public/projects/evolt-dashboard.png";
import smartInvoiceArchitecture from "../../public/projects/smartinvoice-aws-architecture.png";
import ScrollReveal from "./ScrollReveal";
import SpotlightCard from "./SpotlightCard";

interface ProjectMedia {
  label: string;
  image: StaticImageData;
  description: string;
}

interface Project {
  title: string;
  role: string;
  period: string;
  summary: string;
  outcome: string;
  tech: string[];
  highlights: string[];
  icon: LucideIcon;
  repositoryUrl: string;
  reverse?: boolean;
  media: ProjectMedia[];
}

const projects: Project[] = [
  {
    title: "EV Station Management System",
    role: "Backend Developer",
    period: "Sep 2025 - Nov 2025",
    summary:
      "A real-time platform for charging sessions, reservations, payments, and day-to-day station operations.",
    outcome:
      "Kept customer and operator views synchronized across charging events, timeouts, faults, and penalty handling.",
    tech: [".NET 9", "EF Core", "SQL Server", "SignalR", "VNPay"],
    highlights: [
      "Built SignalR channels for battery percentage, remaining time, and charging-state updates.",
      "Handled session timeouts and penalty calculations across concurrent station flows.",
      "Integrated payment and notification events across the booking and charging lifecycle.",
    ],
    icon: BatteryCharging,
    repositoryUrl: "https://github.com/nhatanh-dev/EVoltStation_BE",
    media: [
      {
        label: "Public landing page",
        image: evoltLanding,
        description: "Customer entry point for discovering and accessing the EV charging platform.",
      },
      {
        label: "Station dashboard",
        image: evoltDashboard,
        description: "Map-based station search with vehicle and charging information in one view.",
      },
    ],
  },
  {
    title: "SmartInvoice Shield",
    role: "Cloud and Backend Developer",
    period: "Jan 2026 - Apr 2026",
    summary:
      "A multi-tenant invoice platform combining OCR, tax-risk checks, approval workflows, and AWS deployment.",
    outcome:
      "Designed a resilient processing path from upload to OCR, validation, review, and final approval.",
    tech: [".NET 9", "PostgreSQL", "AWS", "Docker", "ECS", "SQS"],
    highlights: [
      "Built a .NET API with tenant isolation, audit logging, and role-based access control.",
      "Designed S3, SQS, ECS Fargate, ALB, and CloudFront infrastructure for asynchronous processing.",
      "Applied retry, circuit breaker, and timeout policies to external validation calls.",
    ],
    icon: ShieldCheck,
    repositoryUrl: "https://github.com/nhatanh-dev/SmartInvoice",
    reverse: true,
    media: [
      {
        label: "AWS system architecture",
        image: smartInvoiceArchitecture,
        description: "Event-driven cloud design covering delivery, processing, storage, queues, and CI/CD.",
      },
    ],
  },
];

function ProjectMediaCarousel({
  projectTitle,
  media,
}: {
  projectTitle: string;
  media: ProjectMedia[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const rawReduceMotion = useReducedMotion();
  const reduceMotion = isMounted ? rawReduceMotion : false;
  
  const activeMedia = media[activeIndex] ?? media[0];
  const hasMultiple = media.length > 1;

  const goTo = (index: number) => {
    setActiveIndex((index + media.length) % media.length);
  };

  return (
    <SpotlightCard className="project-media overflow-hidden rounded-[var(--radius-surface)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex min-h-11 items-center justify-between border-b border-[var(--border)] px-4 sm:px-5 relative z-10">
        <span className="truncate text-xs font-bold tracking-[0.06em] text-[var(--muted-strong)] uppercase">
          {activeMedia.label}
        </span>
        {hasMultiple && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous project screenshot"
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-[var(--radius-control)] border border-[var(--border)] text-[var(--foreground-soft)] transition-colors duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)] active:scale-[0.98]"
            >
              <ChevronLeft size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next project screenshot"
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-[var(--radius-control)] border border-[var(--border)] text-[var(--foreground-soft)] transition-colors duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)] active:scale-[0.98]"
            >
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-soft)] sm:aspect-video z-10">
        {media.map((item, index) => {
          const active = index === activeIndex;

          return (
          <motion.div
            key={`${projectTitle}-${item.label}-${index}`}
            initial={false}
            animate={
              reduceMotion
                ? { opacity: active ? 1 : 0, x: 0 }
                : { opacity: active ? 1 : 0, x: active ? 0 : index < activeIndex ? -18 : 18 }
            }
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-0 ${active ? "" : "pointer-events-none"}`}
            aria-hidden={!active}
          >
            <Image
              src={item.image}
              alt={`${item.label} for ${projectTitle}`}
              fill
              sizes="(max-width: 1024px) calc(100vw - 40px), 720px"
              className="object-contain"
              placeholder="blur"
            />
          </motion.div>
          );
        })}
      </div>

      <figcaption className="border-t border-[var(--border)] px-4 py-4 sm:px-5 relative z-10">
        <p className="text-sm leading-6 text-[var(--muted-strong)]">{activeMedia.description}</p>
      </figcaption>
    </SpotlightCard>
  );
}

function ExternalAction({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="interactive-control inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-strong)] px-4 text-sm font-bold whitespace-nowrap text-[var(--foreground)] hover:border-[var(--accent)] hover:bg-[rgba(98,198,223,0.08)] active:scale-[0.98]"
    >
      {children}
      <ArrowUpRight size={15} className="control-arrow" aria-hidden="true" />
    </a>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-20 sm:py-24 lg:pt-24 lg:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <header className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <ScrollReveal>
              <h2 id="projects-title" className="max-w-[16ch] text-4xl leading-[1.02] font-bold tracking-[-0.045em] text-[var(--foreground)] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.04] lg:tracking-[-0.04em]">
                Projects with real engineering depth.
              </h2>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-4 lg:mb-1">
            <ScrollReveal delay={0.1}>
              <p className="max-w-[62ch] text-base leading-7 text-[var(--muted-strong)] sm:text-lg sm:leading-8">
                Two systems that show how I approach concurrency, cloud architecture, data integrity,
                and product delivery.
              </p>
            </ScrollReveal>
          </div>
        </header>

        <div className="mt-10 border-t border-[var(--border-strong)] sm:mt-12">
          {projects.map((project, index) => {
            const Icon = project.icon;

            return (
              <article
                key={project.title}
                className="grid grid-cols-1 gap-9 border-b border-[var(--border)] py-12 sm:py-14 lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16"
              >
                <div
                  className={`order-2 lg:col-span-7 ${project.reverse ? "lg:order-2" : "lg:order-1"}`}
                >
                  <ScrollReveal>
                    <ProjectMediaCarousel projectTitle={project.title} media={project.media} />
                  </ScrollReveal>
                </div>

                <div
                  className={`order-1 lg:col-span-5 ${project.reverse ? "lg:order-1" : "lg:order-2"}`}
                >
                  <ScrollReveal>
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[rgba(98,198,223,0.06)] text-[var(--accent)]">
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-[var(--accent)]">{project.role}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                          <CalendarDays size={13} aria-hidden="true" />
                          {project.period}
                        </p>
                      </div>
                    </div>

                    <h3 className="mt-6 text-3xl leading-[1.05] font-bold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl">
                      {project.title}
                    </h3>
                    <p className="mt-5 text-base leading-7 text-[var(--foreground-soft)]">
                      {project.summary}
                    </p>

                    <dl className="mt-6 border-l border-[var(--border-strong)] pl-4">
                      <dt className="text-xs font-bold tracking-[0.08em] text-[var(--muted)] uppercase">
                        Engineering outcome
                      </dt>
                      <dd className="mt-2 text-sm leading-6 text-[var(--foreground-soft)]">
                        {project.outcome}
                      </dd>
                    </dl>

                    <ul className="mt-7 grid gap-3">
                      {project.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="grid grid-cols-[1.4rem_minmax(0,1fr)] gap-3 text-sm leading-6 text-[var(--muted-strong)]"
                        >
                          <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-md bg-[rgba(98,198,223,0.08)] text-[var(--accent)]">
                            <Check size={12} aria-hidden="true" />
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-7 flex flex-wrap gap-2" aria-label={`${project.title} technologies`}>
                      {project.tech.map((technology) => (
                        <li
                          key={technology}
                          className="rounded-[var(--radius-control)] border border-[var(--border)] bg-white/[0.018] px-3 py-1.5 text-xs font-semibold text-[var(--foreground-soft)]"
                        >
                          {technology}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <ExternalAction href={project.repositoryUrl}>
                        <Code2 size={16} aria-hidden="true" />
                        View repository
                      </ExternalAction>
                    </div>
                  </ScrollReveal>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
