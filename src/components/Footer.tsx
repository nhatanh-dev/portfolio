import { ArrowUpRight, Code2, Link2, Mail, Phone } from "lucide-react";

const contactLinks = [
  {
    label: "GitHub",
    href: "https://github.com/nhatanh-dev",
    icon: Code2,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/anhnguyen2505/",
    icon: Link2,
  },
  {
    label: "Phone",
    href: "tel:+84559371255",
    icon: Phone,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-strong)] bg-[var(--background-deep)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 py-16 sm:py-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="text-sm font-bold text-[var(--accent)]">Open to internship opportunities</p>
            <h2 className="mt-3 max-w-[15ch] text-3xl leading-[1.05] font-bold tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl">
              Looking for a backend and cloud intern who ships?
            </h2>
            <p className="mt-5 max-w-[52ch] text-base leading-7 text-[var(--muted-strong)]">
              I would be glad to discuss the role, the team, and the systems you are building.
            </p>
          </div>

          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <a
              href="mailto:anhnguyenphamnhat@gmail.com"
              className="interactive-control inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--accent)] bg-[var(--accent)] px-5 text-sm font-bold whitespace-nowrap text-[var(--accent-ink)] hover:bg-[var(--accent-strong)]"
            >
              <Mail size={16} aria-hidden="true" />
              Email me
              <ArrowUpRight size={15} className="control-arrow" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-7 border-t border-[var(--border)] py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-sm font-bold tracking-[0.12em] text-[var(--accent)]">
              npna<span className="text-[var(--foreground)]">.dev</span>
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              © {new Date().getFullYear()} Nguyen Pham Nhat Anh. Built with Next.js and Tailwind CSS.
            </p>
          </div>

          <nav aria-label="Contact links">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {contactLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="link-underline inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--muted-strong)]"
                  >
                    <Icon size={15} className="text-[var(--accent)]" aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
