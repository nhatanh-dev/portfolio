import { Award, BriefcaseBusiness, CalendarDays, Check } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import SpotlightCard from "./SpotlightCard";

const contributions = [
  "Completed an intensive three-month on-the-job cloud program through AWS Study Bootcamp.",
  "Applied EC2, S3, ECS, ALB, and CloudWatch in collaborative, project-based infrastructure work.",
  "Worked with the FCAJ Challenger group to review solutions, share progress, and deliver as a team.",
];

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="relative border-y border-[var(--border)] bg-[var(--background-deep)] py-20 sm:py-24 lg:pt-24 lg:pb-16"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <header className="max-w-3xl">
          <ScrollReveal>
            <h2 id="experience-title" className="text-4xl leading-[1.02] font-bold tracking-[-0.045em] text-[var(--foreground)] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.04] lg:tracking-[-0.04em]">
              Cloud experience, applied.
            </h2>
            <p className="mt-5 max-w-[58ch] text-base leading-7 text-[var(--muted-strong)] sm:text-lg sm:leading-8">
              Hands-on infrastructure work shaped how I think about deployment, observability, and
              reliable delivery beyond local development.
            </p>
          </ScrollReveal>
        </header>

        <SpotlightCard className="mt-12 border-t border-[var(--border-strong)] rounded-[var(--radius-surface)] p-1">
          <article className="grid lg:grid-cols-12 lg:gap-12 relative z-10">
            <div className="border-b border-[var(--border)] py-7 lg:col-span-3 lg:border-r lg:border-b-0 lg:py-8 lg:px-4">
              <ScrollReveal>
                <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[rgba(98,198,223,0.06)] text-[var(--accent)]">
                  <BriefcaseBusiness size={19} aria-hidden="true" />
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[var(--foreground-soft)]">
                  <CalendarDays size={15} className="text-[var(--accent)]" aria-hidden="true" />
                  Three-month OJT
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">AWS Study Bootcamp</p>
              </ScrollReveal>
            </div>

            <div className="py-8 lg:col-span-9 lg:px-4">
              <ScrollReveal>
                <p className="text-sm font-bold tracking-[0.06em] text-[var(--accent)] uppercase">
                  First Cloud AI Journey
                </p>
                <h3 className="mt-3 max-w-3xl text-2xl leading-tight font-bold tracking-[-0.03em] text-[var(--foreground)] sm:text-3xl">
                  FCAJ member and cloud intern
                </h3>

                <ul className="mt-7 grid max-w-4xl gap-4">
                  {contributions.map((item) => (
                    <li
                      key={item}
                      className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3 text-base leading-7 text-[var(--foreground-soft)]"
                    >
                      <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-md bg-[rgba(98,198,223,0.08)] text-[var(--accent)]">
                        <Check size={14} aria-hidden="true" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex max-w-3xl items-start gap-3 border-t border-[var(--border)] pt-6">
                  <Award size={18} className="mt-1 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                  <p className="text-sm leading-6 text-[var(--muted-strong)]">
                    Recognised as an <span className="font-semibold text-[var(--foreground)]">FCAJ Challenger</span>{" "}
                    for active contribution within the cohort.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </article>
        </SpotlightCard>
      </div>
    </section>
  );
}
