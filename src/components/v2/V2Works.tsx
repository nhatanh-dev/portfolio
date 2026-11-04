"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { projectPath } from "@/lib/site";
import styles from "@/app/(v2)/v2-preview/v2.module.css";
import V2Chars from "./V2Chars";
import V2ProjectIndex from "./V2ProjectIndex";
import { cardDiagram, featuredProjects, githubProfile, type Project } from "./projects";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Pills({ items }: { items: string[] }) {
  return (
    <p className={styles.pills} data-w="copy">
      {items.map((t) => (
        <span key={t}>{t}</span>
      ))}
    </p>
  );
}

function RepoLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className={styles.repoLink} target="_blank" rel="noopener noreferrer">
      {label} <ArrowUpRight size={18} aria-hidden="true" />
      <span className={styles.srOnly}> (opens in a new tab)</span>
    </a>
  );
}

/** Primary action is the case study; the repository link is secondary and only rendered when the project has a public one. */
function Actions({ p }: { p: Project }) {
  return (
    <div className={styles.workActions} data-w="copy">
      <Link href={projectPath(p.slug)} className={`${styles.repoLink} ${styles.caseLink}`}>
        View Case Study <ArrowUpRight size={18} aria-hidden="true" />
      </Link>
      {p.visibility === "public" && p.repository && <RepoLink href={p.repository} label="Source" />}
    </div>
  );
}

const kicker = (p: Project, i: number) => `${String(i + 1).padStart(2, "0")} — ${p.role} · ${p.period}`;

/** Card with screenshots: copy on one side, two layered screenshots (back and front) on the other. */
function ShotsCard({ p, i }: { p: Project; i: number }) {
  const [back, front] = p.screens ?? [];
  return (
    <article className={styles.featured} data-w="featured">
      <div className={styles.featuredCopy}>
        <p className={styles.kicker} data-w="copy">
          {kicker(p, i)}
        </p>
        <Pills items={p.cardTags ?? p.stack.slice(0, 3)} />
        <h3 data-w="copy">{p.title}</h3>
        <p data-w="copy">{p.summary}</p>
        <Actions p={p} />
      </div>
      <div className={styles.shots}>
        {back && (
          <div className={styles.shotBack} data-w="back">
            <Image src={back.image} alt={back.alt} sizes="(min-width: 1024px) 40vw, 80vw" />
          </div>
        )}
        {front && (
          <div className={styles.shotFront} data-w="front">
            <Image src={front.image} alt={front.alt} sizes="(min-width: 1024px) 44vw, 90vw" />
          </div>
        )}
      </div>
    </article>
  );
}

/** Card with a single diagram (or video poster). */
function DiagramCard({ p, i }: { p: Project; i: number }) {
  const d = cardDiagram(p);
  return (
    <article className={styles.secondary} data-w="secondary">
      {d && (
        <div className={styles.diagram} data-w="diagram">
          <Image src={d.image} alt={d.alt} sizes="(min-width: 1024px) 30vw, 90vw" />
          {d.label && <span>{d.label}</span>}
        </div>
      )}
      <div className={styles.secondaryCopy}>
        <p className={styles.kicker} data-w="copy">
          {kicker(p, i)}
        </p>
        <Pills items={p.cardTags ?? p.stack.slice(0, 3)} />
        <h3 data-w="copy">{p.title}</h3>
        <p data-w="copy">{p.summary}</p>
        <Actions p={p} />
      </div>
    </article>
  );
}

export default function V2Works() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      // Late layout shifts (fonts, images) move trigger positions.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1) Paper -> Ink: the dark section is revealed by a rising, slanted edge tied to scroll.
        const slantPct = () => {
          const slant = Math.min(44, Math.max(18, window.innerWidth * 0.03));
          return (slant / el.offsetHeight) * 100;
        };
        gsap.fromTo(
          el,
          { clipPath: "polygon(0% 100%, 100% 96%, 100% 100%, 0% 100%)" },
          {
            clipPath: () => `polygon(0% ${slantPct()}%, 100% 0%, 100% 100%, 0% 100%)`,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 90%", end: "top 40%", scrub: 0.6, invalidateOnRefresh: true },
          },
        );

        // 2) Showcase introduction: staggered, plays forward and rewinds when scrolling back up.
        const intro = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: el, start: "top 60%", toggleActions: "play none none reverse" },
        });
        intro
          .fromTo(q('[data-w="index"]'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.7 }, 0)
          .fromTo(q('[data-w="ch"]'), { yPercent: 118, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.03, transformOrigin: "0% 100%" }, 0.05)
          .fromTo(q('[data-w="lede"]'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.4)
          .fromTo(q('[data-w="featured"]'), { autoAlpha: 0, clipPath: "inset(14% 5% 0% 5% round 24px)" }, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.1, clearProps: "clipPath" }, 0.3)
          .fromTo(q('[data-w="featured"] [data-w="copy"]'), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.7)
          .fromTo(q('[data-w="back"]'), { clipPath: "inset(0% 100% 0% 0%)", xPercent: -8 }, { clipPath: "inset(0% 0% 0% 0%)", xPercent: 0, duration: 1.1, clearProps: "clipPath" }, 0.65)
          .fromTo(q('[data-w="front"]'), { clipPath: "inset(0% 0% 0% 100%)", xPercent: 8 }, { clipPath: "inset(0% 0% 0% 0%)", xPercent: 0, duration: 1.1, clearProps: "clipPath" }, 0.85)
          .fromTo(q('[data-w="secondary"]'), { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1 }, 1.0)
          .fromTo(q('[data-w="diagram"]'), { scale: 0.94 }, { scale: 1, duration: 1.1 }, 1.1)
          .fromTo(q('[data-w="secondary"] [data-w="copy"]'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07 }, 1.2);

        // 3) Media depth: back/front layers drift at different rates while the card scrolls through.
        const drift = (sel: string, from: number, to: number, trigger: string) =>
          q(sel).forEach((t) =>
            q(trigger)[0] &&
            gsap.fromTo(
              t,
              { yPercent: from },
              { yPercent: to, ease: "none", scrollTrigger: { trigger: q(trigger)[0], start: "top bottom", end: "bottom top", scrub: true } },
            ),
          );
        drift('[data-w="back"]', 9, -9, '[data-w="featured"]');
        drift('[data-w="front"]', 5, -11, '[data-w="featured"]');
        drift('[data-w="diagram"]', 6, -6, '[data-w="secondary"]');

        // 4) Pointer depth on desktop: the screenshot layers counter-move inside the featured card.
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const card = q('[data-w="featured"]')[0];
        if (!card) return;
        const lay: [Element, number, number][] = [
          [q('[data-w="back"]')[0], 14, 8],
          [q('[data-w="front"]')[0], -12, -7],
        ];
        const m = lay.filter(([t]) => t).map(([t, dx, dy]) => ({
          dx,
          dy,
          x: gsap.quickTo(t, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(t, "y", { duration: 0.9, ease: "power3.out" }),
        }));
        const onMove = (e: Event) => {
          const pe = e as PointerEvent;
          const r = card.getBoundingClientRect();
          const nx = ((pe.clientX - r.left) / r.width - 0.5) * 2;
          const ny = ((pe.clientY - r.top) / r.height - 0.5) * 2;
          m.forEach((l) => {
            l.x(nx * l.dx);
            l.y(ny * l.dy);
          });
        };
        const onLeave = () =>
          m.forEach((l) => {
            l.x(0);
            l.y(0);
          });
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        return () => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => {
        window.removeEventListener("load", refresh);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section id="works" ref={root} className={styles.works} aria-labelledby="v2-works">
      <div className={styles.worksIntro}>
        <span className={styles.index} data-w="index">
          03<i>/</i>
        </span>
        <h2 id="v2-works" className={`${styles.sectionTitle} ${styles.onDark}`} aria-label="Selected Works">
          <span className={styles.titleMask}>
            <V2Chars text="Selected" motion="ch" attr="data-w" />
          </span>
          <span className={styles.titleMask}>
            <V2Chars text="Works" motion="ch" attr="data-w" />
          </span>
        </h2>
        <p data-w="lede">
          A collection of real projects where I design, build, and deploy backend systems, with a focus on
          reliability, scalability, and real-world impact.
        </p>
        <a href={githubProfile} className={styles.profileLink} target="_blank" rel="noopener noreferrer" data-w="lede">
          All repositories on GitHub <ArrowUpRight size={16} aria-hidden="true" />
          <span className={styles.srOnly}> (opens in a new tab)</span>
        </a>
      </div>

      <div className={styles.projects}>
        {featuredProjects.map((p, i) => (p.screens?.length ? <ShotsCard key={p.slug} p={p} i={i} /> : <DiagramCard key={p.slug} p={p} i={i} />))}
      </div>

      <V2ProjectIndex />
    </section>
  );
}
