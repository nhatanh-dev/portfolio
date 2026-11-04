"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import styles from "@/app/(v2)/v2-preview/dock.module.css";
import { v2Sections } from "./registry";
import { useActiveSection } from "./useActiveSection";
import { contact } from "./contactData";

const pad = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Floating dock for wide screens. The hero keeps its own navigation; once the visitor is past it, a small capsule (current section,
 * progress ticks, section list, Email) is available at the top right. Scrolling down shrinks it to a minimal chip so it stays clear of
 * the oversized headlines; scrolling up, hovering or moving keyboard focus into it expands it. With reduced motion it stays a chip until
 * hovered or focused. It is position: fixed and never touches section transforms.
 */
export default function V2Dock() {
  const active = useActiveSection();
  const idx = Math.max(
    0,
    v2Sections.findIndex((s) => s.id === active),
  );
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let last = window.scrollY;
    let acc = 0;
    let raf = 0;
    let idle = 0;
    const onScroll = () => {
      // Scrolling up reveals the full dock; once the visitor stops, it settles back to the chip (hover, focus or an open list keep it).
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        setCompact(true);
        setPinned(false);
      }, 1800);
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const d = window.scrollY - last;
        last = window.scrollY;
        if (!d) return;
        acc = Math.sign(d) === Math.sign(acc) ? acc + d : d;
        if (acc > 80) {
          setCompact(true);
          setPinned(false);
        }
        else if (acc < -48) setCompact(false);
      });
    };
    const apply = () => {
      window.removeEventListener("scroll", onScroll);
      if (mq.matches) setCompact(true);
      else window.addEventListener("scroll", onScroll, { passive: true });
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
    };
  }, []);

  useEffect(() => {
    if (!open && !pinned) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) {
        setOpen(false);
        setPinned(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, pinned]);

  const hidden = active === "hero";

  return (
    <div ref={root} className={styles.dock} data-hidden={hidden} data-compact={compact} data-open={open} data-pinned={pinned}>
      <nav aria-label="Section navigator" className={styles.capsule}>
        {/* Touch affordance only (keyboard and AT users reach the real controls, which expand on focus): tap to expand. */}
        <span className={styles.num} aria-hidden="true" onClick={() => setPinned(true)}>
          {pad(idx)}
          <ChevronDown size={12} />
        </span>
        <div className={styles.extra}>
          <a href="#hero" className={styles.logo} aria-label="NPA home">
            NPA<span>.</span>
          </a>
          <span className={styles.ticks} aria-hidden="true">
            {v2Sections.map((s, i) => (
              <b key={s.id} data-on={i === idx} />
            ))}
          </span>
          <button ref={toggle} type="button" className={styles.cur} aria-expanded={open} aria-controls="v2-dock-list" onClick={() => setOpen((v) => !v)}>
            <sup>{pad(idx)}</sup>
            <span>{v2Sections[idx].label}</span>
            <ChevronDown size={14} aria-hidden="true" />
            <span className={styles.srOnly}>, current section. {open ? "Close" : "Open"} section list</span>
          </button>
        </div>
        <a href={`mailto:${contact.email}`} className={styles.mail} data-ghost={active === "contact"} aria-label={`Email ${contact.name}`}>
          Email <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </nav>
      <ul id="v2-dock-list" className={styles.list} hidden={!open}>
        {v2Sections.map((s, i) => (
          <li key={s.id}>
            <a href={`#${s.id}`} aria-current={s.id === active ? "location" : undefined} onClick={() => setOpen(false)}>
              <sup>{pad(i)}</sup>
              {s.label}
            </a>
          </li>
        ))}
        <li className={styles.sep} aria-hidden="true" />
        <li>
          <a href={`mailto:${contact.email}`} className={styles.listMail} onClick={() => setOpen(false)}>
            Email me <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </li>
      </ul>
    </div>
  );
}
