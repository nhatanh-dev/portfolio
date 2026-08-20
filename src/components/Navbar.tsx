"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Stack", href: "#stack" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");
  const [isMounted, setIsMounted] = useState(false);
  
  const scrolledRef = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  const rawReduceMotion = useReducedMotion();
  const reduceMotion = isMounted ? rawReduceMotion : false;
  
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 20;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      setActiveSection(navLinks[navLinks.length - 1]?.href ?? activeSection);
    }
    if (next !== scrolledRef.current) {
      scrolledRef.current = next;
      setScrolled(next);
    }
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let maxVisible = 0;
        let mostVisibleSection = "";

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.intersectionRatio > maxVisible) {
              maxVisible = entry.intersectionRatio;
              mostVisibleSection = `#${entry.target.id}`;
            }
          }
        });

        if (mostVisibleSection) {
          setActiveSection(mostVisibleSection);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    navLinks.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    }, 0);

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  const handleMobileNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    setMobileOpen(false);

    window.setTimeout(() => {
      window.history.pushState(null, "", href);
      document.getElementById(href.slice(1))?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }, reduceMotion ? 0 : 80);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-200 ${
        scrolled || mobileOpen
          ? "border-[var(--border)] bg-[rgba(7,17,26,0.9)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8">
        <a
          href="#hero"
          onClick={(event) => {
            if (mobileOpen) handleMobileNavClick(event, "#hero");
          }}
          className="inline-flex min-h-11 items-center rounded-[var(--radius-control)] font-display text-sm font-bold tracking-[0.13em] text-[var(--accent)] transition-colors duration-200 hover:text-[var(--foreground)]"
          aria-label="Go to homepage"
        >
          npna<span className="text-[var(--foreground)]">.dev</span>
        </a>

        <ul className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => {
            const active = activeSection === link.href;

            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={active ? "location" : undefined}
                  className={`group relative inline-flex min-h-11 items-center rounded-[var(--radius-control)] px-3 text-sm font-semibold transition-[background-color,color] duration-200 hover:bg-white/[0.03] ${
                    active
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted-strong)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 bottom-1.5 h-px origin-left bg-[var(--accent)] transition-transform duration-200 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href="mailto:anhnguyenphamnhat@gmail.com"
          className="interactive-control hidden min-h-11 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-strong)] px-4 text-sm font-bold whitespace-nowrap text-[var(--foreground)] hover:border-[var(--accent)] hover:bg-[rgba(98,198,223,0.08)] md:inline-flex"
        >
          Email me
          <ArrowUpRight size={15} className="control-arrow" aria-hidden="true" />
        </a>

        <button
          ref={triggerRef}
          type="button"
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-[var(--radius-control)] border border-[var(--border)] text-[var(--foreground-soft)] transition-[background-color,border-color,color,transform] duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] active:scale-[0.98] md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>
      </nav>

      {/* Reading Progress Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[var(--accent)] origin-left z-50"
        style={{ scaleX }}
      />

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-navigation"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-[calc(100dvh-4.5rem)] border-t border-[var(--border)] bg-[var(--background)] md:hidden"
          >
            <div className="mx-auto flex h-full max-w-7xl flex-col px-5 py-5 sm:px-8">
              <ul>
                {navLinks.map((link) => {
                  const active = activeSection === link.href;

                  return (
                    <li key={link.href} className="border-b border-[var(--border)]">
                      <a
                        href={link.href}
                        aria-current={active ? "location" : undefined}
                        className={`flex min-h-14 items-center text-lg font-semibold transition-colors duration-200 ${
                          active
                            ? "text-[var(--accent)]"
                            : "text-[var(--foreground-soft)] hover:text-[var(--foreground)]"
                        }`}
                        onClick={(event) => handleMobileNavClick(event, link.href)}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <a
                href="mailto:anhnguyenphamnhat@gmail.com"
                className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--accent)] bg-[var(--accent)] px-5 text-sm font-bold text-[var(--accent-ink)] active:scale-[0.98]"
              >
                Email me
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
