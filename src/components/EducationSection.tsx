import { Activity, GraduationCap, Medal, Wind } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import SpotlightCard from "./SpotlightCard";

const interests = [
  {
    name: "Long-distance running",
    description: "Endurance, pacing, and consistent progress.",
    icon: Activity,
  },
  {
    name: "Badminton",
    description: "Fast decisions and competitive focus.",
    icon: Wind,
  },
];

export default function EducationSection() {
  return (
    <section
      id="education"
      aria-labelledby="education-title"
      className="relative border-t border-[var(--border)] bg-[var(--background-deep)] py-20 sm:py-24 lg:pt-24 lg:pb-14"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <header className="max-w-4xl">
          <ScrollReveal>
            <h2 id="education-title" className="max-w-[22ch] text-4xl leading-[1.02] font-bold tracking-[-0.045em] text-[var(--foreground)] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.04] lg:tracking-[-0.04em]">
              <span className="block sm:whitespace-nowrap">Strong fundamentals.</span>
              <span className="block sm:whitespace-nowrap">Practical focus.</span>
            </h2>
            <p className="mt-5 max-w-[58ch] text-base leading-7 text-[var(--muted-strong)] sm:text-lg sm:leading-8">
              Academic discipline supports the systems work. Sport keeps the same consistency going
              outside the classroom.
            </p>
          </ScrollReveal>
        </header>

        <SpotlightCard className="mt-14 sm:mt-16 lg:mt-12 rounded-[var(--radius-surface)] p-1">
          <div className="grid border-t border-[var(--border-strong)] lg:grid-cols-12 lg:gap-12 relative z-10">
            <article className="py-8 lg:col-span-8 lg:pr-8">
              <ScrollReveal delay={0.1}>
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[rgba(98,198,223,0.06)] text-[var(--accent)]">
                    <GraduationCap size={21} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold tracking-[-0.03em] text-[var(--foreground)] sm:text-3xl">
                      FPT University HCM
                    </h3>
                    <p className="mt-1.5 text-base font-semibold text-[var(--accent)]">
                      Bachelor of Software Engineering
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">Expected graduation: June 2027</p>
                  </div>
                </div>

                <dl className="mt-9 grid grid-cols-2 border-y border-[var(--border)]">
                  <div className="border-r border-[var(--border)] py-6 pr-5">
                    <dt className="text-sm text-[var(--muted)]">Cumulative GPA</dt>
                    <dd className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-[var(--accent)] tabular-nums sm:text-5xl">
                      8.6<span className="ml-1 text-base font-semibold text-[var(--muted)]">/10</span>
                    </dd>
                  </div>
                  <div className="py-6 pl-5">
                    <dt className="text-sm text-[var(--muted)]">DSA score</dt>
                    <dd className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-[var(--accent)] tabular-nums sm:text-5xl">
                      9.3<span className="ml-1 text-base font-semibold text-[var(--muted)]">/10</span>
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex items-start gap-3">
                  <Medal size={18} className="mt-1 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                  <p className="text-sm leading-6 text-[var(--foreground-soft)]">
                    High Distinction in Data Structures and Algorithms.
                  </p>
                </div>
              </ScrollReveal>
            </article>

            <aside className="border-t border-[var(--border)] py-8 lg:col-span-4 lg:border-t-0 lg:border-l lg:pl-10">
              <ScrollReveal delay={0.2}>
                <h3 className="text-xl font-bold tracking-[-0.02em] text-[var(--foreground)]">
                  Outside the IDE
                </h3>
                <div className="mt-5 border-t border-[var(--border)]">
                  {interests.map(({ name, description, icon: Icon }) => (
                    <div
                      key={name}
                      className="flex items-start gap-4 border-b border-[var(--border)] py-5"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-[rgba(98,198,223,0.07)] text-[var(--accent)] transition-transform duration-300 hover:scale-110 hover:bg-[rgba(98,198,223,0.15)]">
                        <Icon size={17} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{name}</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </aside>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
