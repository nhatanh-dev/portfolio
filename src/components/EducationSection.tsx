"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { GraduationCap, Star, Activity, Wind } from "lucide-react";

export default function EducationSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="education" ref={ref} className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-mono text-[#38bdf8] text-sm mb-2 tracking-widest">05. EDUCATION</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Background &amp; <span className="text-gradient">Interests</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Education card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 gradient-border rounded-2xl p-7 card-hover"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)] flex items-center justify-center flex-shrink-0">
                <GraduationCap size={22} className="text-[#38bdf8]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">FPT University HCM</h3>
                <p className="text-[#38bdf8] text-sm font-medium">
                  Bachelor of Software Engineering
                </p>
                <p className="text-slate-500 text-sm font-mono mt-0.5">Expected 2027</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-[rgba(56,189,248,0.05)] border border-[rgba(56,189,248,0.1)] p-4 text-center">
                <div className="text-3xl font-bold text-gradient-blue mb-1">8.6</div>
                <div className="text-xs text-slate-500 tracking-wide">Cumulative GPA</div>
              </div>
              <div className="rounded-xl bg-[rgba(56,189,248,0.05)] border border-[rgba(56,189,248,0.1)] p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="text-3xl font-bold text-gradient-blue">9.3</span>
                  <span className="text-slate-400 text-sm font-mono">/10</span>
                </div>
                <div className="text-xs text-slate-500 tracking-wide">DSA Score</div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[rgba(56,189,248,0.05)] border border-[rgba(56,189,248,0.12)]">
              <Star size={14} className="text-amber-400 fill-amber-400 flex-shrink-0" />
              <p className="text-sm text-slate-300">
                <span className="font-semibold text-white">High Distinction </span> in Data Structures &amp; Algorithms
              </p>
            </div>
          </motion.div>

          {/* Interests card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="gradient-border rounded-2xl p-7 card-hover"
          >
            <h3 className="text-sm font-semibold text-slate-400 tracking-widest uppercase mb-6">
              Outside of Code
            </h3>

            <div className="space-y-5">
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-[rgba(56,189,248,0.04)] border border-[rgba(56,189,248,0.1)] hover:border-[rgba(56,189,248,0.25)] transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-[rgba(56,189,248,0.1)] flex items-center justify-center flex-shrink-0">
                  <Activity size={18} className="text-[#38bdf8]" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Long-distance Running</p>
                  <p className="text-xs text-slate-500 mt-0.5">Endurance &amp; mental fortitude</p>
                </div>
              </div>

              <div className="group flex items-center gap-4 p-4 rounded-xl bg-[rgba(249,115,22,0.04)] border border-[rgba(249,115,22,0.1)] hover:border-[rgba(249,115,22,0.25)] transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-[rgba(249,115,22,0.1)] flex items-center justify-center flex-shrink-0">
                  <Wind size={18} className="text-[#f97316]" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Badminton</p>
                  <p className="text-xs text-slate-500 mt-0.5">Agility &amp; competitive spirit</p>
                </div>
              </div>
            </div>

            {/* Caption */}
            <p className="mt-6 text-xs text-slate-600 italic leading-relaxed">
              &quot;Discipline on the track translates directly to discipline in the codebase.&quot;
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
