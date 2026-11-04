"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";
import styles from "@/app/(v2)/v2-preview/tech.module.css";
import V2Chars from "./V2Chars";
import { curtainReveal } from "./motion";
import { neighbours, techCategories, techLinks, type TechCategory, type TechId } from "./techData";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const byId = Object.fromEntries(techCategories.map((c) => [c.id, c])) as Record<TechId, TechCategory>;
const pad = (n: number) => String(n).padStart(2, "0");

/** Curved connection between two node centres, in the map's 0-100 coordinate space. */
function linkPath(a: TechId, b: TechId, bend: number) {
  const { x: x1, y: y1 } = byId[a].pos;
  const { x: x2, y: y2 } = byId[b].pos;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  return `M ${x1} ${y1} Q ${mx - dy * bend} ${my + dx * bend} ${x2} ${y2}`;
}

type DetailProps = { cat: TechCategory; onPick: (id: TechId) => void };

/** Companion information: shared by the desktop panel and the mobile accordion. */
function Detail({ cat, onPick }: DetailProps) {
  const idx = techCategories.findIndex((c) => c.id === cat.id) + 1;
  return (
    <>
      <p className={styles.panelKicker} data-pi>
        {pad(idx)} / {pad(techCategories.length)}
      </p>
      <h3 className={styles.panelTitle} data-pi>
        {cat.name}
      </h3>
      <p className={styles.panelBlurb} data-pi>
        {cat.blurb}
      </p>

      <p className={styles.panelLabel} data-pi>
        Technologies
      </p>
      <ul className={styles.tools} data-pi aria-label={`${cat.name} technologies`}>
        {cat.tools.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <p className={styles.panelLabel} data-pi>
        Where it shows up
      </p>
      {cat.examples.length ? (
        <ul className={styles.examples} data-pi>
          {cat.examples.map((e) => (
            <li key={e.text}>
              <span>{e.source}</span>
              {e.text}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.note} data-pi>
          {cat.note}
        </p>
      )}

      <p className={styles.panelLabel} data-pi>
        Connected areas
      </p>
      <ul className={styles.related} data-pi aria-label="Connected areas">
        {neighbours(cat.id).map((id) => (
          <li key={id}>
            <button type="button" onClick={() => onPick(id)} aria-label={`Show ${byId[id].name}`}>
              {byId[id].short}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function V2Tech() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<TechId>("backend");
  const first = useRef(true);
  const cat = byId[active];
  const near = neighbours(active);

  // ---------- Scroll-linked introduction ----------
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        el.classList.add(styles.live);

        // Ink rises out of the Warm Paper section; the journey line from Experience drops in with it.
        curtainReveal(el);
        gsap.fromTo(
          q('[data-t="thread"]'),
          { scaleY: 0, autoAlpha: 1 },
          { scaleY: 1, transformOrigin: "50% 0", ease: "none", scrollTrigger: { trigger: el, start: "top 94%", end: "top 28%", scrub: 0.6 } },
        );

        gsap
          .timeline({ defaults: { ease: "expo.out" }, scrollTrigger: { trigger: el, start: "top 52%", toggleActions: "play none none reverse" } })
          .fromTo(q('[data-t="ch"]'), { yPercent: 118, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 1, stagger: 0.035, transformOrigin: "0% 100%" }, 0)
          .fromTo(q('[data-t="kicker"], [data-t="lede"], [data-t="sub"]'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.3);

        // Map: connections draw with scroll, then nodes pop in (plays and rewinds).
        const map = q('[data-t="map"]')[0];
        gsap.fromTo(
          q("[data-base]"),
          { strokeDashoffset: 1200 },
          { strokeDashoffset: 0, ease: "none", stagger: 0.12, scrollTrigger: { trigger: map, start: "top 88%", end: "top 30%", scrub: 0.6 } },
        );
        gsap
          .timeline({ defaults: { ease: "back.out(1.5)" }, scrollTrigger: { trigger: map, start: "top 72%", toggleActions: "play none none reverse" } })
          .fromTo(q("[data-node]"), { scale: 0.55, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.7, stagger: 0.09 }, 0)
          .fromTo(q('[data-t="panel"]'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out" }, 0.25)
          .fromTo(q("[data-acc]"), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.07 }, 0);

        return () => el.classList.remove(styles.live);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  // ---------- Selection transitions (skipped on first mount and under reduced motion) ----------
  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(root);
      gsap.to(q('[data-node]:not([data-on="true"]) [data-sat]'), { autoAlpha: 0, scale: 0.6, duration: 0.2, overwrite: true });
      gsap.to(q('[data-node]:not([data-on="true"]) [data-spoke]'), { scaleX: 0, duration: 0.2, overwrite: true });
      gsap.fromTo(q('[data-node][data-on="true"] [data-spoke]'), { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power2.out", stagger: 0.05, overwrite: true });
      gsap.fromTo(
        q('[data-node][data-on="true"] [data-sat]'),
        { autoAlpha: 0, scale: 0.4 },
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)", stagger: 0.06, delay: 0.12, overwrite: true },
      );
      gsap.fromTo(q('[data-hot="true"]'), { strokeDashoffset: 1200 }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.out", overwrite: true });
      gsap.fromTo(q("[data-panel] [data-pi]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out", stagger: 0.05, overwrite: true });
    },
    { scope: root, dependencies: [active] },
  );

  // Roving keyboard navigation for the map's tabs.
  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = techCategories.findIndex((c) => c.id === active);
    const n = techCategories.length;
    const to =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i + n - 1) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    const id = techCategories[to].id;
    setActive(id);
    requestAnimationFrame(() => document.getElementById(`tech-tab-${id}`)?.focus());
  };

  return (
    <section id="expertise" ref={root} className={styles.tech} aria-labelledby="v2-tech">
      <span className={styles.thread} data-t="thread" aria-hidden="true" />

      <header className={styles.head}>
        <p className={styles.kicker} data-t="kicker">
          <b>05</b> Technical expertise
        </p>
        <h2 id="v2-tech" className={styles.title} aria-label="Technical Expertise">
          <span className={styles.mask}>
            <V2Chars text="Technical" motion="ch" attr="data-t" />
          </span>
          <span className={styles.mask}>
            <V2Chars text="Expertise" motion="ch" attr="data-t" />
            <span className={styles.dot} aria-hidden="true">
              .
            </span>
          </span>
        </h2>
        <div className={styles.headText}>
          <p className={styles.lede} data-t="lede">
            A backend-first toolkit.
          </p>
          <p className={styles.sub} data-t="sub">
            I use the frontend when the product needs it, but backend reliability and cloud delivery are where I go deepest.
          </p>
        </div>
      </header>

      <div className={styles.body}>
        {/* ---------- Desktop: system map ---------- */}
        <div className={styles.mapWrap}>
          <div className={styles.map} data-t="map">
            <svg className={styles.links} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              {techLinks.map(([a, b], i) => {
                const d = linkPath(a, b, i % 2 ? 0.07 : -0.07);
                const hot = a === active || b === active;
                const warm = !hot && (near.includes(a) || near.includes(b));
                return (
                  <g key={`${a}-${b}`}>
                    <path d={d} className={styles.link} data-base data-s={hot ? "hot" : warm ? "warm" : "cold"} />
                    <path d={d} className={styles.linkHot} data-hot={hot} />
                  </g>
                );
              })}
            </svg>

            <div className={styles.nodes} role="tablist" aria-label="Technical areas" onKeyDown={onTabKey}>
              {techCategories.map((c) => {
                const on = c.id === active;
                const rel = on ? "active" : near.includes(c.id) ? "near" : "far";
                const n = c.core.length;
                return (
                  <div key={c.id} className={styles.node} data-node data-on={on} data-rel={rel} style={{ left: `${c.pos.x}%`, top: `${c.pos.y}%` }} role="presentation">
                    <button
                      type="button"
                      role="tab"
                      id={`tech-tab-${c.id}`}
                      aria-selected={on}
                      aria-controls="tech-panel"
                      tabIndex={on ? 0 : -1}
                      className={styles.hub}
                      aria-label={`${c.name}, ${c.tools.length} technologies`}
                      onClick={() => setActive(c.id)}
                    >
                      <span className={styles.hubName}>{c.short}</span>
                      <span className={styles.hubCount}>{pad(c.tools.length)}</span>
                    </button>
                    <ul className={styles.sats} aria-hidden="true">
                      {c.core.map((t, i) => {
                        const deg = n === 1 ? c.arc.start : c.arc.start + (c.arc.span * i) / (n - 1);
                        const rad = (deg * Math.PI) / 180;
                        // Alternate satellites between two radii so neighbouring labels never collide.
                        const st = { "--ux": Math.cos(rad).toFixed(3), "--uy": Math.sin(rad).toFixed(3), "--deg": `${deg}deg`, "--k": n > 2 && i % 2 ? 1.42 : 1 } as CSSProperties;
                        return (
                          <li key={t} className={styles.sat} style={st}>
                            <span className={styles.spokeWrap}>
                              <span className={styles.spoke} data-spoke />
                            </span>
                            <span className={styles.satPos}>
                              <span className={styles.satIn} data-sat>
                                {t}
                              </span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
          <p className={styles.legend}>
            Illustrative map: lines show how these areas typically relate in a system. It is not the architecture of any single project.
          </p>
        </div>

        <div id="tech-panel" role="tabpanel" aria-labelledby={`tech-tab-${active}`} tabIndex={0} className={styles.panel} data-t="panel" data-panel>
          <Detail cat={cat} onPick={setActive} />
        </div>

        {/* ---------- Mobile: simplified accordion ---------- */}
        <div className={styles.acc}>
          {techCategories.map((c) => {
            const open = c.id === active;
            return (
              <div key={c.id} className={styles.accItem} data-acc data-open={open}>
                <h3 className={styles.accHead}>
                  <button type="button" id={`acc-btn-${c.id}`} aria-expanded={open} aria-controls={`acc-${c.id}`} onClick={() => setActive(c.id)}>
                    <span className={styles.accName}>{c.name}</span>
                    <span className={styles.accCount}>{pad(c.tools.length)}</span>
                    <ChevronDown size={20} aria-hidden="true" />
                  </button>
                </h3>
                <div id={`acc-${c.id}`} role="region" aria-labelledby={`acc-btn-${c.id}`} className={styles.accPanel}>
                  <div className={styles.accInner}>
                    <Detail cat={c} onPick={setActive} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
