"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

interface Skill {
  name: string;
  color?: string;
}

interface Category {
  title: string;
  icon: string;
  accent: string;
  skills: Skill[];
}

const categories: Category[] = [
  {
    title: "Backend & Database",
    icon: "⚙️",
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
    icon: "☁️",
    accent: "#f97316",
    skills: [
      { name: "AWS" },
      { name: "Docker" },
    ],
  },
  {
    title: "Frontend & Mobile",
    icon: "🖥️",
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
    icon: "🛠️",
    accent: "#34d399",
    skills: [
      { name: "GitHub" },
      { name: "Jira" },
      { name: "Postman" },
    ],
  },
];

const skillColors: Record<string, string> = {
  "C#": "#9b59b6",
  ".NET Core": "#7b2fff",
  Java: "#f89820",
  "SQL Server": "#cc2927",
  PostgreSQL: "#336791",
  AWS: "#f97316",
  Docker: "#2496ed",
  React: "#61dafb",
  Angular: "#dd0031",
  Flutter: "#027dfd",
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  GitHub: "#ffffff",
  Jira: "#0052cc",
  Postman: "#ff6c37",
};

function SkillBadge({ name }: { name: string }) {
  const color = skillColors[name] ?? "#38bdf8";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 cursor-default"
      style={{
        background: `${color}12`,
        border: `1px solid ${color}30`,
        color: color === "#ffffff" ? "#e2e8f0" : color,
      }}
    >
      {name}
    </span>
  );
}

export default function TechStackSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="stack" ref={ref} className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-mono text-[#38bdf8] text-sm mb-2 tracking-widest">02. SKILLS</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Tech <span className="text-gradient">Stack</span>
          </h2>
          <p className="mt-3 text-slate-400 max-w-md">
            Technologies I&apos;ve worked with — from building APIs to deploying cloud infrastructure.
          </p>
        </motion.div>

        {/* Grid of categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="gradient-border rounded-2xl p-6 card-hover"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{cat.icon}</span>
                <h3
                  className="text-sm font-semibold tracking-wide"
                  style={{ color: cat.accent }}
                >
                  {cat.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <SkillBadge key={skill.name} name={skill.name} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
