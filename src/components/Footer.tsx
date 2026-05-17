"use client";

import { Code2, Mail, Phone, Link2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-[rgba(56,189,248,0.08)]">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-mono text-[#38bdf8] font-semibold text-sm">
            npna<span className="text-white">.dev</span>
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Nguyen Pham Nhat Anh · Built with Next.js &amp; Tailwind CSS
          </p>
        </div>

        <div className="flex items-center gap-4">
          {[
            { icon: Code2, href: "https://github.com/nhatanh-dev", label: "GitHub" },
            { icon: Mail, href: "mailto:anhnguyenphamnhat@gmail.com", label: "Email" },
            { icon: Phone, href: "tel:+84559371255", label: "Phone" },
            { icon: Link2, href: "https://www.linkedin.com/in/anhnguyen2505/", label: "LinkedIn" },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-[#38bdf8] hover:bg-[rgba(56,189,248,0.08)] border border-transparent hover:border-[rgba(56,189,248,0.2)] transition-all duration-200"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
