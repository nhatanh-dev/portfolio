"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import styles from "@/app/(v2)/v2-preview/contact.module.css";
import { contact } from "./contactData";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LINES = ["Let's build", "something", "real"];

type CopyState = "idle" | "ok" | "fail";

export default function V2Contact() {
  const root = useRef<HTMLElement>(null);
  const addr = useRef<HTMLSpanElement>(null);
  const timer = useRef<number>(0);
  const [copy, setCopy] = useState<CopyState>("idle");

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add({ ok: "(prefers-reduced-motion: no-preference)", fine: "(hover: hover) and (pointer: fine)" }, (ctx) => {
        const { ok, fine } = ctx.conditions as { ok: boolean; fine: boolean };
        if (!ok) return;

        // Headline: each line is wiped in left to right, scrubbed to scroll (reversible), staggered by start offset.
        q('[data-c="line"]').forEach((l, i) =>
          gsap.fromTo(
            l,
            { clipPath: "inset(-4% 100% -4% 0%)" },
            { clipPath: "inset(-4% -2% -4% 0%)", ease: "none", scrollTrigger: { trigger: el, start: `top ${80 - i * 9}%`, end: `top ${52 - i * 9}%`, scrub: 0.6 } },
          ),
        );
        gsap.fromTo(q('[data-c="kicker"]'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, ease: "none", scrollTrigger: { trigger: el, start: "top 88%", end: "top 66%", scrub: 0.6 } });

        // The vermilion slab keeps the Voice slab's shape and x position, and drops down from the seam as that one rose from below.
        gsap.fromTo(q('[data-c="slab"]'), { scaleY: 0 }, { scaleY: 1, transformOrigin: "50% 0", ease: "none", scrollTrigger: { trigger: el, start: "top 84%", end: "top 30%", scrub: 0.6 } });
        gsap.fromTo(q('[data-c="ctaIn"]'), { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, ease: "none", scrollTrigger: { trigger: el, start: "top 52%", end: "top 28%", scrub: 0.6 } });

        gsap.fromTo(
          q('[data-c="rv"]'),
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.09, scrollTrigger: { trigger: el, start: "top 40%", toggleActions: "play none none reverse" } },
        );

        // Magnetic CTA label (fine pointers only). It has its own wrapper, separate from the scrubbed entrance above.
        if (fine) {
          const cell = q('[data-c="cell"]')[0] as HTMLElement;
          const mag = q('[data-c="mag"]')[0] as HTMLElement;
          const mx = gsap.quickTo(mag, "x", { duration: 0.6, ease: "power3.out" });
          const my = gsap.quickTo(mag, "y", { duration: 0.6, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const r = cell.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            mx(gsap.utils.clamp(-14, 14, dx * 0.08));
            my(gsap.utils.clamp(-10, 10, dy * 0.08));
          };
          const leave = () => {
            mx(0);
            my(0);
          };
          cell.addEventListener("pointermove", move);
          cell.addEventListener("pointerleave", leave);
          return () => {
            cell.removeEventListener("pointermove", move);
            cell.removeEventListener("pointerleave", leave);
          };
        }
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const copyAddress = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopy("ok");
    } catch {
      // Clipboard blocked: select the visible address so Ctrl/Cmd+C still works.
      if (addr.current) window.getSelection()?.selectAllChildren(addr.current);
      setCopy("fail");
    }
    timer.current = window.setTimeout(() => setCopy("idle"), 4000);
  };

  const backToTop = () => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
    // Once the page has settled at the top, hand keyboard focus back to the first control of the page.
    const logo = document.querySelector<HTMLElement>('a[aria-label="NPA home"]');
    const t0 = performance.now();
    let last = -1;
    let still = 0;
    const tick = () => {
      const y = window.scrollY;
      still = y === last ? still + 1 : 0;
      last = y;
      if ((y <= 0 && still >= 2) || performance.now() - t0 > 4000) {
        logo?.focus({ preventScroll: true });
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return (
    <section id="contact" ref={root} className={styles.contact} aria-labelledby="v2-contact">
      <div className={styles.inner}>
        <p className={styles.kicker} data-c="kicker">
          <b>08</b> Contact · The final frame
        </p>

        <h2 id="v2-contact" className={styles.title} aria-label="Let's build something real.">
          {LINES.map((l, i) => (
            <span key={l} className={styles.line} aria-hidden="true">
              <span data-c="line" className={styles.lineIn}>
                {l}
                {i === LINES.length - 1 && <i>.</i>}
              </span>
            </span>
          ))}
        </h2>

        <p className={styles.lede} data-c="rv">
          {contact.lede}
        </p>

        <div className={styles.cell} data-c="cell">
          <span className={styles.slab} data-c="slab" aria-hidden="true" />
          <a href={`mailto:${contact.email}`} className={styles.cta} aria-label={`Email ${contact.name} at ${contact.email}`}>
            <span className={styles.ctaIn} data-c="ctaIn">
              <span className={styles.ctaMag} data-c="mag">
                <span className={styles.ctaKick}>Say hello</span>
                <span className={styles.ctaWord}>
                  Email me <ArrowUpRight className={styles.ctaArrow} aria-hidden="true" />
                </span>
              </span>
            </span>
          </a>
        </div>

        <div className={styles.body}>
          <div className={styles.addrRow} data-c="rv">
            <span ref={addr} className={styles.addr}>
              {contact.email}
            </span>
            <button type="button" className={styles.copyBtn} onClick={copyAddress}>
              {copy === "ok" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              <span>{copy === "ok" ? "Copied" : "Copy address"}</span>
            </button>
          </div>
          <p className={styles.status} role="status" aria-live="polite" data-state={copy}>
            {copy === "ok" && "Address copied to the clipboard."}
            {copy === "fail" && "Couldn't copy automatically. The address is selected: press Ctrl or Cmd + C."}
          </p>

          <ul className={styles.links} data-c="rv">
            {contact.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className={styles.pill}>
                  {l.label} <ArrowUpRight size={18} aria-hidden="true" />
                  <span className={styles.srOnly}> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <footer className={styles.foot}>
        <div className={styles.names}>
          <p className={styles.fullName}>{contact.name}</p>
          <p className={styles.alias}>
            <span lang="en">{contact.alias}</span>
          </p>
        </div>
        <p className={styles.fine}>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {contact.name}. {contact.builtWith}.
        </p>
        <button type="button" className={styles.top} onClick={backToTop}>
          <ArrowUp size={18} aria-hidden="true" />
          Back to top
        </button>
      </footer>
    </section>
  );
}
