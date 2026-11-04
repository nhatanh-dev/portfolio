"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "@/app/(v2)/v2-preview/experience.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Content is limited to what the existing portfolio already states about the FCAJ programme. Dates and sequence are not given there, so these four items are presented as journey highlights, not as chronological stages. */
const milestones = [
  {
    n: "01",
    title: "AWS Study Bootcamp",
    text: "Completed an intensive three-month hands-on cloud training program through AWS Study Bootcamp.",
  },
  {
    n: "02",
    title: "Hands-on infrastructure",
    text: "Applied EC2, S3, ECS, ALB, and CloudWatch in collaborative, project-based infrastructure work.",
    chips: ["EC2", "S3", "ECS", "ALB", "CloudWatch"],
  },
  {
    n: "03",
    title: "The Challenger group",
    text: "Worked with the FCAJ Challenger group to review solutions, share progress, and deliver as a team.",
  },
  {
    n: "04",
    title: "FCAJ Challenger",
    text: "Recognised as an FCAJ Challenger for active contribution within the cohort.",
  },
];

const photos = [
  {
    src: "/v2/experience/fcaj-group.webp",
    w: 1120,
    h: 747,
    alt: "A large group photo in a bright room with an AWS wall sign and the First Cloud Journey AI logo",
    cap: "First Cloud AI Journey · group photo",
  },
  {
    src: "/v2/experience/fcaj-aws-office.webp",
    w: 1120,
    h: 795,
    alt: "Seven people giving thumbs up in front of an AWS sign at the AWS office",
    cap: "At the AWS office",
  },
];

const WORD = "Experience";

export default function V2Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Everything below only exists while motion is live; without it the section renders in its final, fully visible state.
        el.classList.add(styles.live);

        // 1) Warm Paper rises out of the Ink section through the same slanted edge Works used, with the spine dropping from the seam.
        const slantPct = () => (Math.min(44, Math.max(18, window.innerWidth * 0.03)) / el.offsetHeight) * 100;
        gsap.fromTo(
          el,
          { clipPath: "polygon(0% 100%, 100% 96%, 100% 100%, 0% 100%)" },
          {
            clipPath: () => `polygon(0% ${slantPct()}%, 100% 0%, 100% 100%, 0% 100%)`,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 94%", end: "top 45%", scrub: 0.6, invalidateOnRefresh: true },
          },
        );

        // 2) Oversized word: per-letter mask reveal (plays and rewinds) plus a slow horizontal drift tied to scroll.
        gsap
          .timeline({ defaults: { ease: "expo.out" }, scrollTrigger: { trigger: el, start: "top 58%", toggleActions: "play none none reverse" } })
          .fromTo(q('[data-x="ch"]'), { yPercent: 118, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 1, stagger: 0.04, transformOrigin: "0% 100%" }, 0)
          .fromTo(q('[data-x="kicker"], [data-x="lede"], [data-x="sub"]'), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.35);
        gsap.fromTo(
          q('[data-x="word"]'),
          { xPercent: -2.5 },
          { xPercent: 2.5, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
        );

        // 3) Timeline: the vermilion head follows a line 55% down the viewport. Numerals fill and nodes light as it passes
        //    (class toggles are state, so scrolling back up un-lights them). The front photo switches at the halfway point.
        const line = q('[data-x="line"]')[0];
        const head = q('[data-x="head"]')[0];
        const spine = q('[data-x="spine"]')[0];
        const items = q('[data-x="ms"]') as HTMLElement[];
        const gallery = q('[data-x="gallery"]')[0] as HTMLElement;
        const setLine = gsap.quickSetter(line, "scaleY") as (v: number) => void;
        const setHead = gsap.quickSetter(head, "y", "px") as (v: number) => void;
        let nodeY: number[] = [];
        const measure = () => {
          const top = spine.getBoundingClientRect().top;
          nodeY = items.map((m) => m.getBoundingClientRect().top - top + 8);
        };
        let front = -1;
        const unlock = () => {
          delete gallery.dataset.locked;
          front = -1;
        };
        const update = () => {
          const r = el.getBoundingClientRect();
          const h = spine.offsetHeight;
          // Reference line sits 55% down the viewport; the mapping is scaled so the head reaches the end of the spine exactly
          // when the section bottom reaches the viewport bottom (the last scroll position on this page).
          const vh = window.innerHeight;
          const span = Math.max(1, r.height - vh * 0.45);
          const y = gsap.utils.clamp(0, h, (vh * 0.55 - r.top) * (h / span));
          setLine(h ? y / h : 0);
          setHead(y);
          items.forEach((m, i) => m.classList.toggle(styles.active, y >= nodeY[i]));
          const next = y > h * 0.5 ? 1 : 0;
          // A photo the visitor picked is never overridden by scroll; auto-switching resumes after the section has been left.
          if (!gallery.dataset.locked && next !== front) {
            front = next;
            setFront(gallery, next);
          }
        };
        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          invalidateOnRefresh: true,
          onLeave: () => unlock(),
          onLeaveBack: () => unlock(),
          onRefresh: () => {
            measure();
            update();
          },
          onUpdate: update,
        });

        // 4) Milestone copy: numerals and headings rise through masks as each node is reached (plays and rewinds).
        items.forEach((m) => {
          const n = m.querySelectorAll('[data-x="num"]');
          const chips = m.querySelectorAll('[data-x="chip"]');
          const tl = gsap
            .timeline({ defaults: { ease: "expo.out" }, scrollTrigger: { trigger: m, start: "top 78%", toggleActions: "play none none reverse" } })
            .fromTo(n, { yPercent: 110 }, { yPercent: 0, duration: 0.9 }, 0)
            .fromTo(m.querySelectorAll('[data-x="h"], [data-x="p"]'), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.1);
          // Only some milestones list services; tweening an empty set logs GSAP "target not found" warnings.
          if (chips.length) tl.fromTo(chips, { autoAlpha: 0, y: 14, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.06 }, 0.35);
        });

        // 5) Photos: wipe-reveal with depth (frames drift at different rates, images settle from a zoom).
        const frames = q('[data-x="frame"]');
        const clips = q('[data-x="clip"]');
        gsap
          .timeline({ defaults: { ease: "expo.out" }, scrollTrigger: { trigger: gallery, start: "top 80%", toggleActions: "play none none reverse" } })
          .fromTo(clips[0], { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, clearProps: "clipPath" }, 0)
          .fromTo(clips[1], { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, clearProps: "clipPath" }, 0.25)
          .fromTo(q('[data-x="img"]'), { scale: 1.25 }, { scale: 1, duration: 1.6, stagger: 0.25 }, 0);
        gsap.fromTo(frames[0], { yPercent: 6 }, { yPercent: -6, ease: "none", scrollTrigger: { trigger: gallery, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(frames[1], { yPercent: -4 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: gallery, start: "top bottom", end: "bottom top", scrub: true } });

        return () => el.classList.remove(styles.live);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="experience" ref={root} className={styles.exp} aria-labelledby="v2-exp">
      <div className={styles.spine} data-x="spine" aria-hidden="true">
        <span className={styles.spineLine} data-x="line" />
        <span className={styles.spineHead} data-x="head" />
      </div>

      <h2 id="v2-exp" className={styles.word} aria-label="Experience" data-x="word">
        <span className={styles.wordMask}>
          {Array.from(WORD).map((c, i) => (
            <span key={i} className={`${styles.ch} ${c === "x" ? styles.accent : ""}`} data-x="ch" aria-hidden="true">
              {c}
            </span>
          ))}
        </span>
      </h2>

      <div className={styles.intro}>
        <p className={styles.kicker} data-x="kicker">
          <b>04</b> AWS First Cloud AI Journey · FCAJ
        </p>
        <div>
          <p className={styles.lede} data-x="lede">
            Cloud experience, applied.
          </p>
          <p className={styles.sub} data-x="sub">
            Hands-on infrastructure work shaped how I think about deployment, observability, and reliable delivery beyond local
            development.
          </p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.hlWrap}>
          <p className={styles.hlLabel} data-x="kicker">
            Journey highlights
          </p>
        <ol className={styles.timeline} aria-label="FCAJ journey highlights">
          {milestones.map((m) => (
            <li key={m.n} className={styles.ms} data-x="ms">
              <span className={styles.num} aria-hidden="true">
                <span className={styles.numMask}>
                  <span style={{ display: "block" }} data-x="num">
                    {m.n}
                  </span>
                </span>
              </span>
              <h3 className={styles.msTitle} data-x="h">
                {m.title}
              </h3>
              <p className={styles.msText} data-x="p">
                {m.text}
              </p>
              {m.chips && (
                <ul className={styles.chips} aria-label="AWS services used">
                  {m.chips.map((c) => (
                    <li key={c} data-x="chip">
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
        </div>

        <div className={styles.gallery} data-x="gallery" data-active="0" role="group" aria-label="FCAJ photos">
          {photos.map((p, i) => (
            <div key={p.src} className={`${styles.frame} ${i === 0 ? styles.frameA : styles.frameB}`} data-x="frame">
              <button
                type="button"
                className={styles.photoBtn}
                aria-pressed={i === 0}
                aria-label={`${p.cap}. ${i === 0 ? "Showing in front" : "Bring to front"}`}
                onClick={(e) => {
                  const g = e.currentTarget.closest('[data-x="gallery"]') as HTMLElement;
                  g.dataset.locked = "1";
                  setFront(g, i);
                }}
              >
                <span className={styles.clip} data-x="clip">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} width={p.w} height={p.h} alt={p.alt} loading="lazy" data-x="img" />
                </span>
                <span className={styles.cap}>{p.cap}</span>
                <span className={styles.hint} aria-hidden="true">
                  Bring to front
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Brings one photo to the front by updating DOM state only (no React re-render while scrolling). */
function setFront(gallery: HTMLElement, i: number) {
  gallery.dataset.active = String(i);
  gallery.querySelectorAll("button").forEach((b, k) => {
    b.setAttribute("aria-pressed", String(k === i));
    b.setAttribute("aria-label", `${photos[k].cap}. ${k === i ? "Showing in front" : "Bring to front"}`);
  });
}
