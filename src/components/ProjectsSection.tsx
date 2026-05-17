"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Calendar, ExternalLink, Zap } from "lucide-react";

interface Project {
  id: number;
  title: string;
  role: string;
  period: string;
  tech: string[];
  highlights: string[];
  accent: string;
  icon: string;
  tagColor: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "EV Station Management System",
    role: "Backend Developer",
    period: "09/2025 – 11/2025",
    tech: [".NET", "EF Core", "SQL Server", "SignalR", "VNPay"],
    highlights: [
      "Leveraged SignalR to push real-time charging status updates (battery %, remaining time) to connected clients with sub-second latency.",
      "Implemented push notification system for session events — start, finish, fault, and penalty triggers.",
      "Engineered complex concurrent-safe logic handling charging session timeouts, penalty calculations, and simultaneous multi-station scenarios.",
    ],
    accent: "#38bdf8",
    icon: "⚡",
    tagColor: "blue",
  },
  {
    id: 2,
    title: "SmartInvoice Shield",
    role: "Cloud & Backend Developer",
    period: "01/2026 – 04/2026",
    tech: [".NET 9", "PostgreSQL", "AWS", "Docker"],
    highlights: [
      "Architected cloud infrastructure on AWS using ECS + ALB for Auto-Scaling and Load Balancing on an automated invoice processing system.",
      "Containerised microservices with Docker; deployed to AWS ECS Fargate for zero-downtime rolling updates.",
      "Designed a resilient data pipeline on PostgreSQL with optimised indexing to handle high-throughput invoice ingestion.",
    ],
    accent: "#f97316",
    icon: "🛡️",
    tagColor: "orange",
  },
];

export default function ProjectsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="projects" ref={ref} className="py-24 relative">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-0 top-1/3 w-[35rem] max-w-full h-[35rem] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #38bdf8, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-mono text-[#38bdf8] text-sm mb-2 tracking-widest">04. PROJECTS</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Featured <span className="text-gradient">Work</span>
          </h2>
          <p className="mt-3 text-slate-400 max-w-md">
            A selection of projects that reflect my focus on backend performance and cloud-native architecture.
          </p>
        </motion.div>

        {/* Project cards */}
        <div className="flex flex-col gap-8">
          {projects.map((project, i) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
              className="gradient-border rounded-2xl p-7 card-hover group"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left — Icon + meta */}
                <div className="lg:w-64 flex-shrink-0">
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl mb-4"
                    style={{ background: `${project.accent}14` }}
                  >
                    {project.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                  <p
                    className="text-sm font-semibold mb-3"
                    style={{ color: project.accent }}
                  >
                    {project.role}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 mb-5">
                    <Calendar size={11} />
                    {project.period}
                  </div>

                  {/* Tech chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-md text-xs font-medium"
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
                </div>

                {/* Divider */}
                <div
                  className="hidden lg:block w-px self-stretch"
                  style={{ background: `${project.accent}18` }}
                />

                {/* Right — Highlights */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={14} style={{ color: project.accent }} />
                    <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                      Key Highlights
                    </span>
                  </div>
                  <ul className="space-y-4">
                    {project.highlights.map((h, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                        <span
                          className="flex-shrink-0 mt-0.5 font-mono font-bold"
                          style={{ color: project.accent }}
                        >
                          0{idx + 1}
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
