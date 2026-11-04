"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import styles from "@/app/v2-preview/v2.module.css";
import { v2Sections } from "./registry";
import { useActiveSection } from "./useActiveSection";

/**
 * Inline links on wide screens; below 1024px the same <nav> becomes a full-screen menu opened by a button. The list comes from
 * the registry, so only implemented sections are ever linked, however many are added.
 */
export default function V2Nav() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const btn = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    nav.current?.querySelector<HTMLElement>("a")?.focus();

    const close = () => {
      setOpen(false);
      btn.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "Tab") {
        // Loop focus through the toggle and the links while the menu covers the page.
        const f = [btn.current, ...Array.from(nav.current?.querySelectorAll<HTMLElement>("a") ?? [])].filter(Boolean) as HTMLElement[];
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    // Rotating or widening to the inline layout must not leave the page scroll-locked.
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      root.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <header className={styles.nav} data-open={open}>
      <a href="#hero" className={styles.logo} aria-label="NPA home" onClick={() => setOpen(false)}>
        NPA<span>.</span>
      </a>
      <button
        ref={btn}
        type="button"
        className={styles.menuBtn}
        aria-expanded={open}
        aria-controls="v2-menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        <span>{open ? "Close" : "Menu"}</span>
      </button>
      <nav id="v2-menu" ref={nav} aria-label="Primary" className={styles.navLinks}>
        {v2Sections.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} aria-current={s.id === active ? "location" : undefined} onClick={() => setOpen(false)}>
            <sup>{String(i + 1).padStart(2, "0")}</sup>
            {s.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
