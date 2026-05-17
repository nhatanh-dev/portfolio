"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Briefcase, Calendar, Award } from "lucide-react";

export default function ExperienceSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="experience" ref={ref} className="py-24 relative">
      {/* Background accent */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[40rem] max-w-full h-[40rem] rounded-full opacity-[0.04] overflow-hidden"
        style={{ background: "radial-gradient(circle, #f97316, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-mono text-[#38bdf8] text-sm mb-2 tracking-widest">03. EXPERIENCE</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Where I&apos;ve <span className="text-gradient">Worked</span>
          </h2>
        </motion.div>

        {/* Timeline card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative timeline-line"
        >
          {/* Dot */}
          <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-[rgba(56,189,248,0.12)] border border-[rgba(56,189,248,0.35)] flex items-center justify-center glow-blue">
            <Briefcase size={16} className="text-[#38bdf8]" />
          </div>

          {/* Content */}
          <div className="ml-16 gradient-border rounded-2xl p-6 card-hover">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  First Cloud AI Journey (FCAJ) Member / Intern
                </h3>
                <p className="text-[#f97316] font-semibold mt-0.5">AWS Study Bootcamp</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] px-3 py-1.5 rounded-full">
                <Calendar size={11} />
                3-Month OJT Program
              </div>
            </div>

            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex gap-3">
                <span className="text-[#38bdf8] mt-0.5 flex-shrink-0">▹</span>
                <span>
                  Completed a 3-month on-the-job training (OJT) internship within an intensive
                  cloud learning bootcamp.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#38bdf8] mt-0.5 flex-shrink-0">▹</span>
                <span>
                  Active member of the{" "}
                  <span className="text-slate-200 font-medium">FCAJ Challenger Group</span>,
                  collaborating on hands-on team projects.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#38bdf8] mt-0.5 flex-shrink-0">▹</span>
                <span>
                  Directly studied and applied AWS infrastructure services — including EC2, S3,
                  ECS, ALB, and CloudWatch — in real group-based project scenarios.
                </span>
              </li>
            </ul>

            {/* Badge */}
            <div className="mt-5 flex flex-wrap gap-2">
              {["AWS", "Cloud Infrastructure", "OJT", "Team Collaboration"].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-xs bg-[rgba(249,115,22,0.08)] border border-[rgba(249,115,22,0.2)] text-[#f97316]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Achievement card below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-6 ml-16 flex items-center gap-3 px-5 py-3 rounded-xl bg-[rgba(56,189,248,0.04)] border border-[rgba(56,189,248,0.12)] w-fit"
        >
          <Award size={16} className="text-[#38bdf8] flex-shrink-0" />
          <p className="text-sm text-slate-400">
            <span className="text-slate-200 font-medium">FCAJ Challenger</span> — recognised as an
            active contributor in the bootcamp cohort.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
