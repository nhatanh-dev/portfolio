"use client";

import type { CSSProperties } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Cloud, Code2, Database, GitBranch, type LucideIcon } from "lucide-react";

interface Skill {
  name: string;
}

interface Category {
  title: string;
  icon: LucideIcon;
  accent: string;
  skills: Skill[];
}

const categories: Category[] = [
  {
    title: "Backend & Database",
    icon: Database,
    accent: "#38bdf8",
    skills: [
      { name: "C#" },
      { name: ".NET Core" },
      { name: "Java" },
      { name: "SQL Server" },
      { name: "PostgreSQL" },
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    accent: "#f97316",
    skills: [{ name: "AWS" }, { name: "Docker" }],
  },
  {
    title: "Frontend & Mobile",
    icon: Code2,
    accent: "#818cf8",
    skills: [
      { name: "React" },
      { name: "Angular" },
      { name: "Flutter" },
      { name: "JavaScript" },
      { name: "TypeScript" },
    ],
  },
  {
    title: "Tools & Workflow",
    icon: GitBranch,
    accent: "#34d399",
    skills: [{ name: "GitHub" }, { name: "Jira" }, { name: "Postman" }],
  },
];

function SkillBadge({ name, accent }: { name: string; accent: string }) {
  return (
    <button
      type="button"
      className="tech-skill-pill inline-flex min-h-10 cursor-pointer items-center rounded-lg border px-3 py-1.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ "--accent": accent } as CSSProperties}
      aria-label={`${name} skill`}
    >
      {name}
    </button>
  );
}

export default function TechStackSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="stack" ref={ref} className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="mb-2 font-mono text-sm tracking-widest text-[#38bdf8]">02. SKILLS</p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Tech <span className="text-gradient">stack</span>
          </h2>
          <p className="mt-3 max-w-md text-slate-400">
            Technologies I have worked with, from building APIs to deploying cloud infrastructure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;

            return (
              <motion.article
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="tech-stack-card group relative overflow-hidden rounded-2xl border p-6 shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-1 focus-within:-translate-y-1"
                style={{ "--accent": cat.accent } as CSSProperties}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-[var(--accent)] opacity-80" />
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--accent)] opacity-[0.08] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.16]" />
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105"
                    style={{ background: `${cat.accent}10`, borderColor: `${cat.accent}24` }}
                  >
                    <Icon size={18} style={{ color: cat.accent }} aria-hidden="true" />
                  </span>
                  <h3 className="text-sm font-semibold tracking-wide text-slate-200 transition-colors duration-300 group-hover:text-white">
                    {cat.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <SkillBadge key={skill.name} name={skill.name} accent={cat.accent} />
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
