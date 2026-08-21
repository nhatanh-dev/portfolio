import { Cloud, Code2, Database, GitBranch, type LucideIcon } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import SpotlightCard from "./SpotlightCard";
import { StackBackground } from "./SectionBackgrounds";

interface Category {
  title: string;
  description: string;
  icon: LucideIcon;
  skills: string[];
}

const categories: Category[] = [
  {
    title: "Backend systems",
    description: "APIs, data access, and real-time application flows.",
    icon: Database,
    skills: ["C#", ".NET 9", "EF Core", "SignalR", "REST APIs", "Java"],
  },
  {
    title: "Data and cloud",
    description: "Containerization and deployment foundations on AWS.",
    icon: Cloud,
    skills: ["PostgreSQL", "SQL Server", "AWS", "Docker", "ECS", "S3"],
  },
  {
    title: "Product surfaces",
    description: "Enough frontend fluency to ship complete product features.",
    icon: Code2,
    skills: ["React", "TypeScript", "Angular", "Flutter", "Tailwind CSS"],
  },
  {
    title: "Delivery workflow",
    description: "Practical tools for collaboration, testing, and release work.",
    icon: GitBranch,
    skills: ["Git", "GitHub Actions", "Postman", "Jira"],
  },
];

export default function TechStackSection() {
  return (
    <section id="stack" className="relative py-20 sm:py-24 lg:pt-24 lg:pb-14">
      <StackBackground />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16 relative z-10">
        <header className="max-w-2xl lg:col-span-4 lg:pt-2">
          <ScrollReveal>
            <h2 id="stack-title" className="text-4xl leading-[1.02] font-bold tracking-[-0.045em] text-[var(--foreground)] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.04] lg:tracking-[-0.04em]">
              A backend-first toolkit.
            </h2>
            <p className="mt-5 max-w-[42ch] text-base leading-7 text-[var(--muted-strong)] sm:text-lg sm:leading-8">
              I use the frontend when the product needs it, but backend reliability and cloud delivery
              are where I go deepest.
            </p>
          </ScrollReveal>
        </header>

        <div className="border-t border-[var(--border)] lg:col-span-8">
          {categories.map(({ title, description, icon: Icon, skills }, index) => (
            <ScrollReveal key={title}>
              <SpotlightCard className="stack-row grid gap-5 border-b border-[var(--border)] px-4 py-7 sm:grid-cols-[15rem_minmax(0,1fr)] sm:gap-8 sm:px-5 sm:py-7">
                <div className="flex items-start gap-3.5 relative z-10">
                  <span className="stack-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[rgba(98,198,223,0.06)] text-[var(--accent)] transition-transform duration-300">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold tracking-[-0.015em] text-[var(--foreground)]">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p>
                  </div>
                </div>

                <ul className="flex flex-wrap content-start gap-2 sm:justify-end relative z-10">
                  {skills.map((skill) => (
                    <li
                      key={skill}
                      className="tech-chip inline-flex min-h-9 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--border)] bg-white/[0.018] px-3 text-sm font-semibold text-[var(--foreground-soft)]"
                    >
                      <span aria-hidden="true" className="tech-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
