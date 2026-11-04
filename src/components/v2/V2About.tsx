"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CalendarDays, Code2, GraduationCap } from "lucide-react";
import styles from "@/app/(v2)/v2-preview/v2.module.css";
import V2Chars from "./V2Chars";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function V2About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const clip = (sel: string) => getComputedStyle(q(sel)[0]).clipPath;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The journey shares the hero's scroll range: as the hero drains away, the vermilion stem drops through the seam
        // into the photo slab, the photo unmasks and the title rises. Fully scrubbed, so it reverses with the scroll.
        const frameEnd = clip('[data-a="frame"]');
        const slabEnd = clip('[data-a="slab"]');
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: document.getElementById("hero") ?? el, start: "top top", end: "bottom 30%", scrub: 0.6, invalidateOnRefresh: true },
          })
          .fromTo(q('[data-a="stem"]'), { scaleY: 0, autoAlpha: 1 }, { scaleY: 1, duration: 0.5, ease: "power1.out" }, 0.05)
          .fromTo(q('[data-a="slab"]'), { clipPath: "polygon(14% 0%, 100% 0%, 100% 0%, 14% 0%)" }, { clipPath: slabEnd, duration: 0.55 }, 0.3)
          .fromTo(q('[data-a="frame"]'), { clipPath: "polygon(9% 0%, 100% 0%, 100% 0%, 9% 0%)" }, { clipPath: frameEnd, duration: 0.6 }, 0.25)
          .fromTo(q('[data-a="img"]'), { scale: 1.28, yPercent: -7 }, { scale: 1, yPercent: 0, duration: 0.8 }, 0.2)
          .fromTo(q('[data-a="index"]'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.25 }, 0.5)
          .fromTo(q('[data-a="ch"]'), { yPercent: 118 }, { yPercent: 0, duration: 0.3, stagger: 0.035, ease: "power2.out" }, 0.5);

        // Copy: each block is scrubbed over a short window as it enters, so it rewinds when scrolling back up.
        q('[data-a="rv"]').forEach((t) =>
          gsap.fromTo(
            t,
            { autoAlpha: 0, y: 36 },
            { autoAlpha: 1, y: 0, ease: "none", scrollTrigger: { trigger: t, start: "top 92%", end: "top 68%", scrub: 0.6 } },
          ),
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className={styles.about} aria-labelledby="v2-about">
      <figure className={styles.aboutPhoto}>
        <span className={styles.stem} data-a="stem" aria-hidden="true" />
        <span className={styles.photoSlab} data-a="slab" aria-hidden="true" />
        <div className={styles.photoFrame} data-a="frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/v2/portraits/working-laptop.webp"
            width={960}
            height={1441}
            sizes="(min-width: 1024px) 52vw, 92vw"
            alt="Nhat Anh working on a laptop at an FPT University event"
            loading="lazy"
            data-a="img"
          />
        </div>
      </figure>

      <div className={styles.aboutContent}>
        <div className={styles.aboutHead}>
          <span className={styles.index} data-a="index">
            02<i>/</i>
          </span>
          <h2 id="v2-about" className={styles.sectionTitle} aria-label="About Me.">
            <span className={styles.titleMask}>
              <V2Chars text="About Me." motion="ch" attr="data-a" />
            </span>
          </h2>
        </div>
        <p className={styles.lede} data-a="rv">
          A software engineer who enjoys building reliable and scalable systems.
        </p>
        <p className={styles.aboutText} data-a="rv">
          I&apos;m a Software Engineering student at FPT University, focused on backend development and
          cloud infrastructure. I enjoy solving real-world problems, understanding how systems work, and
          turning technical ideas into practical and impactful products.
        </p>
        <ul className={styles.facts} data-a="rv">
          <li>
            <Code2 size={26} strokeWidth={1.5} aria-hidden="true" />
            <span>
              <b>Backend &amp; Cloud</b>
              <small>My focus</small>
            </span>
          </li>
          <li>
            <GraduationCap size={26} strokeWidth={1.5} aria-hidden="true" />
            <span>
              <b>FPT University</b>
              <small>Software Engineering</small>
            </span>
          </li>
          <li>
            <CalendarDays size={26} strokeWidth={1.5} aria-hidden="true" />
            <span>
              <b>2027</b>
              <small>Expected graduation</small>
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
