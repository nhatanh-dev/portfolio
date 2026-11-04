"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import styles from "@/app/(v2)/v2-preview/v2.module.css";
import { HeroCloud, HeroContainers } from "./V2HeroArt";
import V2Chars from "./V2Chars";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stack = [".NET", "AWS", "DOCKER", "DATABASE", "API"];

// Start shapes for the slab wipes; end shapes are read from the computed clip-path.
const SLAB_FROM_DESKTOP = "polygon(98% 10%, 98% 10%, 80% 100%, 80% 100%)";
const SLAB_FROM_MOBILE = "polygon(24% 100%, 100% 100%, 100% 100%, 0% 100%)";
// Where the slabs collapse to while the hero scrolls away (they drain down into the About section).
const SLAB_EXIT_DESKTOP = "polygon(40% 100%, 47% 100%, 47% 100%, 36% 100%)";
const SLAB_EXIT_MOBILE = "polygon(60% 100%, 72% 100%, 72% 100%, 60% 100%)";

type DriftCfg = {
  els: Element[];
  /** pointer parallax amplitude in px at the viewport edge */
  pdx?: number;
  pdy?: number;
  /** ambient oscillation amplitude in px; the sign sets the starting direction (contrasting layers use opposite signs) */
  ax?: number;
  ay?: number;
  /** ambient periods in seconds (full there-and-back cycle) and phase offset 0..1 */
  tx?: number;
  ty?: number;
  phase?: number;
};

/**
 * One additive motion system for the hero background. Each layer has two independent sources, a smoothed pointer offset
 * and a slow ambient oscillation, summed and written once per tick to the element's x/y. Nothing else writes x/y on these
 * elements (entrance and scroll use xPercent/yPercent/scale/clip-path), so the two sources can never fight.
 */
function createDrift(cfgs: DriftCfg[]) {
  const layers = cfgs.flatMap((c) =>
    c.els.map((el) => {
      const p = { x: 0, y: 0 };
      const a = { x: 0, y: 0 };
      const osc = (key: "x" | "y", amp = 0, period = 24) => {
        if (!amp) return null;
        const tw = gsap.fromTo(a, { [key]: -amp }, { [key]: amp, duration: period / 2, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true });
        tw.totalTime((c.phase ?? 0) * period);
        return tw;
      };
      return {
        c,
        p,
        a,
        setX: gsap.quickSetter(el, "x", "px") as (v: number) => void,
        setY: gsap.quickSetter(el, "y", "px") as (v: number) => void,
        qx: gsap.quickTo(p, "x", { duration: 1.1, ease: "power3.out" }),
        qy: gsap.quickTo(p, "y", { duration: 1.1, ease: "power3.out" }),
        tweens: [osc("x", c.ax, c.tx), osc("y", c.ay, c.ty)].filter(Boolean) as gsap.core.Tween[],
      };
    }),
  );
  // Blend factor 0 -> 1, eased in the first time the drift starts. Each oscillator begins at its own point of the cycle (not at zero) and the
  // pointer offset may already be non-zero, so without the blend the first tick would move every layer by up to ~20px in one frame.
  const blend = { k: 0 };
  let ramped = false;
  const apply = () => {
    for (const l of layers) {
      l.setX((l.p.x + l.a.x) * blend.k);
      l.setY((l.p.y + l.a.y) * blend.k);
    }
  };
  let on = false;
  return {
    /** Runs the ticker and ambient tweens only while active (hero on screen, tab visible, entrance done). */
    setActive(next: boolean) {
      if (next === on) return;
      on = next;
      if (next && !ramped) {
        ramped = true;
        gsap.to(blend, { k: 1, duration: 2.4, ease: "sine.inOut" });
      }
      layers.forEach((l) => l.tweens.forEach((t) => (next ? t.resume() : t.pause())));
      if (next) gsap.ticker.add(apply);
      else gsap.ticker.remove(apply);
    },
    aim(nx: number, ny: number) {
      for (const l of layers) {
        if (l.c.pdx) l.qx(nx * l.c.pdx);
        if (l.c.pdy) l.qy(ny * l.c.pdy);
      }
    },
    kill() {
      gsap.ticker.remove(apply);
      layers.forEach((l) => {
        l.tweens.forEach((t) => t.kill());
        gsap.killTweensOf(l.p);
      });
      gsap.killTweensOf(blend);
    },
  };
}

export default function V2Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      // Ambient layers (orbit trace, slab breathing, background drift) are gated by data-ambient / drift.setActive: they only run once the entrance
      // has landed, while the hero is on screen and the tab is visible. Reduced motion never starts them.
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let onScreen = true;
      let ambientReady = false;
      let drift: ReturnType<typeof createDrift> | null = null;
      const syncAmbient = () => {
        if (!ambientReady) return;
        const on = onScreen && !document.hidden;
        el.dataset.ambient = on ? "on" : "paused";
        drift?.setActive(on);
      };
      const io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        syncAmbient();
      });
      io.observe(el);
      document.addEventListener("visibilitychange", syncAmbient);
      const done = () => {
        el.dataset.motion = "done";
        if (!reduced) {
          ambientReady = true;
          syncAmbient();
        }
      };
      // If anything below throws or never runs, never leave the hero hidden.
      const failsafe = window.setTimeout(done, 6000);
      const clip = (sel: string) => getComputedStyle(q(sel)[0]).clipPath;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", done);

      // Scroll exit: the hero drains into About. Built once the entrance has landed so the two never fight over a property.
      const buildExit = (desktop: boolean) => {
        const exit = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "bottom 30%", scrub: 0.6, invalidateOnRefresh: true },
        });
        exit
          .to(q('[data-par="title"]'), { xPercent: -6 }, 0)
          .to(q('[data-m="ch"]'), { yPercent: -125, ease: "power2.in", stagger: { each: 0.018, from: "start" }, duration: 0.5 }, 0.12)
          .to(q('[data-m="eyebrow"], [data-m="tagline"], [data-m="tags"], [data-m="ctas"]'), { y: -48, autoAlpha: 0, stagger: 0.05, duration: 0.4 }, 0)
          // The portrait sinks slightly and fades as one piece while the slabs drain, so no head/body fragment is ever left
          // floating over About. Fully scrubbed and reversible.
          .to(q('[data-m="portrait"]'), { yPercent: 18, scale: 1.03, transformOrigin: "50% 100%", duration: 0.6 }, 0)
          .to(q('[data-m="portrait"]'), { autoAlpha: 0, ease: "power1.in", duration: 0.38 }, 0.04)
          .to(q('[data-m="slab"]'), { clipPath: desktop ? SLAB_EXIT_DESKTOP : SLAB_EXIT_MOBILE }, 0.08)
          .to(q('[data-m="slab2"]'), { clipPath: desktop ? SLAB_EXIT_DESKTOP : SLAB_EXIT_MOBILE }, 0)
          .to(q('[data-m="cloud"]'), { xPercent: -70, autoAlpha: 0, duration: 0.4 }, 0)
          .to(q('[data-m="crates"]'), { yPercent: 35, autoAlpha: 0, duration: 0.3 }, 0)
          .to(q('[data-m="arc"], [data-m="stacklist"], [data-m="cue"]'), { autoAlpha: 0, duration: 0.4 }, 0);
        return exit;
      };

      // ---------- Desktop ----------
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
        const slabEnd = clip('[data-m="slab"]');
        const slab2End = clip('[data-m="slab2"]');
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          onComplete: () => {
            done();
            buildExit(true);
          },
        });
        tl.fromTo(q('[data-m="slab2"]'), { clipPath: SLAB_FROM_DESKTOP, xPercent: 14 }, { clipPath: slab2End, xPercent: 0, duration: 1.15, ease: "power4.inOut" }, 0)
          .fromTo(q('[data-m="slab"]'), { clipPath: SLAB_FROM_DESKTOP, xPercent: 9 }, { clipPath: slabEnd, xPercent: 0, duration: 1.2, ease: "power4.inOut" }, 0.12)
          .fromTo(q('[data-m="arc"]'), { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 1.6 }, 0.1)
          .fromTo(q('[data-m="eyebrow"]'), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.9 }, 0.15)
          .fromTo(
            q('[data-m="ch"]'),
            { autoAlpha: 0, yPercent: 118, rotate: 7 },
            { autoAlpha: 1, yPercent: 0, rotate: 0, duration: 0.95, stagger: 0.03, transformOrigin: "0% 100%" },
            0.28,
          )
          .fromTo(
            q('[data-m="portrait"]'),
            { clipPath: "inset(100% 0% 0% 0%)", yPercent: 9, scale: 1.08, transformOrigin: "50% 100%" },
            { clipPath: "inset(0% 0% 0% 0%)", yPercent: 0, scale: 1, duration: 1.45, ease: "power3.out", clearProps: "clipPath" },
            0.5,
          )
          .set(q('[data-m="portrait"]'), { autoAlpha: 1 }, 0.5)
          .fromTo(q('[data-m="cloud"]'), { autoAlpha: 0, xPercent: -34 }, { autoAlpha: 1, xPercent: 0, duration: 1.4 }, 0.75)
          .fromTo(q('[data-m="crates"]'), { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: 1.15, stagger: 0.12 }, 0.8)
          .fromTo(q('[data-m="tagline"]'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.95)
          .fromTo(q('[data-m="tags"]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 1.05)
          .fromTo(q('[data-m="ctas"]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 1.15)
          .fromTo(q('[data-m="stacklist"]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 1.1)
          .fromTo(q('[data-m="stack"]'), { autoAlpha: 0, x: 16 }, { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.07 }, 1.2)
          .fromTo(q('[data-m="cue"]'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 1.55)
          // Ambient drift joins while the entrance is still settling (it only writes x/y, which no entrance tween touches) and is blended in from zero.
          .call(() => {
            ambientReady = true;
            syncAmbient();
          }, [], 1.35);
        tl.timeScale(1.3);
        el.dataset.motion = "running";

        // ----- Background drift: ambient oscillation + pointer parallax, summed per layer -----
        const crates = q('[data-m="crates"]');
        drift = createDrift([
          { els: q('[data-par="title"]'), pdx: 14, pdy: 6 },
          { els: q('[data-m="portrait"]'), pdx: 12, pdy: 5 },
          { els: q('[data-m="slab"]'), pdx: -26, pdy: -12, ax: 25, ay: 18, tx: 21, ty: 25, phase: 0 },
          { els: q('[data-m="slab2"]'), pdx: -44, pdy: -22, ax: -20, ay: 15, tx: 23, ty: 19, phase: 0.35 },
          { els: q('[data-m="cloud"]'), pdx: -46, pdy: -16, ax: 32, ay: 19, tx: 18, ty: 22, phase: 0.6 },
          { els: crates.slice(0, 1), pdx: 26, pdy: 14, ax: 18, ay: 12, tx: 21, ty: 17, phase: 0.2 },
          { els: crates.slice(1), pdx: 26, pdy: 14, ax: -18, ay: -14, tx: 20, ty: 24, phase: 0.75 },
          { els: q('[data-m="arc"]'), pdx: -64, pdy: -30, ax: 13, ay: 11, tx: 26, ty: 21, phase: 0.5 },
          { els: q('[data-m="stacklist"]'), pdx: 16, pdy: 9 },
        ]);
        syncAmbient();

        const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        let idleTimer = 0;
        const release = () => drift?.aim(0, 0);
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          // The nav overlays the hero but is a sibling, so track the window and test bounds ourselves.
          if (r.bottom < 0 || r.top > window.innerHeight || e.clientY < r.top || e.clientY > r.bottom) return release();
          drift?.aim(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / Math.min(r.height, window.innerHeight) - 0.5) * 2);
          // When the cursor stops, ease the pointer offset back to zero so the scene settles into its ambient drift.
          window.clearTimeout(idleTimer);
          idleTimer = window.setTimeout(release, 1500);
        };
        if (finePointer) {
          window.addEventListener("pointermove", move);
          document.documentElement.addEventListener("pointerleave", release);
        }

        // Magnetic CTAs: the button leans toward the cursor while hovered.
        const magnets = (finePointer ? q("[data-cta]") : []).map((b) => {
          const mx = gsap.quickTo(b, "x", { duration: 0.5, ease: "power3.out" });
          const my = gsap.quickTo(b, "y", { duration: 0.5, ease: "power3.out" });
          const onMove = (e: Event) => {
            const pe = e as PointerEvent;
            const r = b.getBoundingClientRect();
            mx(gsap.utils.clamp(-8, 8, (pe.clientX - (r.left + r.width / 2)) * 0.18));
            my(gsap.utils.clamp(-5, 5, (pe.clientY - (r.top + r.height / 2)) * 0.25));
          };
          const onLeave = () => {
            mx(0);
            my(0);
          };
          b.addEventListener("pointermove", onMove);
          b.addEventListener("pointerleave", onLeave);
          return () => {
            b.removeEventListener("pointermove", onMove);
            b.removeEventListener("pointerleave", onLeave);
          };
        });

        return () => {
          window.removeEventListener("pointermove", move);
          document.documentElement.removeEventListener("pointerleave", release);
          window.clearTimeout(idleTimer);
          magnets.forEach((off) => off());
          drift?.kill();
          drift = null;
        };
      });

      // ---------- Mobile: shorter vertical variant of the same sequence ----------
      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 1023px)", () => {
        const slabEnd = clip('[data-m="slab"]');
        const slab2End = clip('[data-m="slab2"]');
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          onComplete: () => {
            done();
            buildExit(false);
          },
        });
        tl.fromTo(q('[data-m="eyebrow"]'), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.7 }, 0)
          .fromTo(
            q('[data-m="ch"]'),
            { autoAlpha: 0, yPercent: 118, rotate: 7 },
            { autoAlpha: 1, yPercent: 0, rotate: 0, duration: 0.85, stagger: 0.026, transformOrigin: "0% 100%" },
            0.08,
          )
          .fromTo(q('[data-m="tagline"]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.6)
          .fromTo(q('[data-m="ctas"]'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.72)
          .fromTo(q('[data-m="tags"]'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.84)
          .fromTo(q('[data-m="slab2"]'), { clipPath: SLAB_FROM_MOBILE }, { clipPath: slab2End, duration: 1, ease: "power4.inOut" }, 0.45)
          .fromTo(q('[data-m="slab"]'), { clipPath: SLAB_FROM_MOBILE }, { clipPath: slabEnd, duration: 1.05, ease: "power4.inOut" }, 0.55)
          .fromTo(
            q('[data-m="portrait"]'),
            { clipPath: "inset(100% 0% 0% 0%)", yPercent: 7, scale: 1.06, transformOrigin: "50% 100%" },
            { clipPath: "inset(0% 0% 0% 0%)", yPercent: 0, scale: 1, duration: 1.3, ease: "power3.out", clearProps: "clipPath" },
            0.6,
          )
          .set(q('[data-m="portrait"]'), { autoAlpha: 1 }, 0.6)
          .fromTo(q('[data-m="cloud"]'), { autoAlpha: 0, xPercent: -20 }, { autoAlpha: 1, xPercent: 0, duration: 1.1 }, 1.05)
          .call(() => {
            ambientReady = true;
            syncAmbient();
          }, [], 0.95);
        tl.timeScale(1.25);
        el.dataset.motion = "running";

        // Ambient drift only, at roughly half the desktop amplitude, on the layers that exist on mobile.
        drift = createDrift([
          { els: q('[data-m="slab"]'), ax: 8, ay: 6, tx: 21, ty: 25, phase: 0 },
          { els: q('[data-m="slab2"]'), ax: -7, ay: 5, tx: 23, ty: 19, phase: 0.35 },
          { els: q('[data-m="cloud"]'), ax: 11, ay: 8, tx: 18, ty: 22, phase: 0.6 },
        ]);
        syncAmbient();
        return () => {
          drift?.kill();
          drift = null;
        };
      });

      return () => {
        window.clearTimeout(failsafe);
        io.disconnect();
        document.removeEventListener("visibilitychange", syncAmbient);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section id="hero" ref={root} className={styles.hero} data-motion="pending" data-ambient="off" aria-labelledby="v2-name">
      <noscript>
        <style>{`[data-motion="pending"] [data-m]{visibility:visible!important}`}</style>
      </noscript>
      <div className={styles.copy}>
        <p className={styles.eyebrow} data-m="eyebrow">
          <span className={styles.alias}>Alvin Nguyen</span>
          <span className={styles.role}>Backend &amp; Cloud Developer</span>
        </p>
        <h1 id="v2-name" className={styles.name} aria-label="Nguyen Pham Nhat Anh" data-par="title">
          <span className={`${styles.nameLine} ${styles.nameInk}`}>
            <span className={styles.nameInner} data-line>
              <V2Chars text="Nguyen Pham" motion="ch" />
            </span>
          </span>
          <span className={`${styles.nameLine} ${styles.nameRed}`}>
            <span className={styles.nameInner} data-line>
              <V2Chars text="Nhat Anh." motion="ch" />
            </span>
          </span>
        </h1>
        <p className={styles.tagline} data-m="tagline">
          Building reliable systems{" "}
          <br className={styles.brDesk} />
          that solve real-world problems.
        </p>
        <p className={styles.tags} data-m="tags">
          <span>.NET</span>
          <span>Cloud</span>
          <span>Real-time</span>
          <span>System Design</span>
        </p>
        <div className={styles.ctas} data-m="ctas">
          <a href="#works" className={styles.btnSolid} data-cta>
            <span>Explore My Work</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a href="#about" className={styles.btnGhost} data-cta>
            <span>About Me</span>
          </a>
        </div>
      </div>

      <div className={styles.stage}>
        <span className={styles.arc} data-m="arc" aria-hidden="true">
          <span className={styles.orbit}>
            <span className={styles.orbitTrail} />
            <span className={styles.orbitDot} />
          </span>
        </span>
        <div className={styles.shapeShadow} data-m="slab2" aria-hidden="true" />
        <div className={styles.shape} data-m="slab" aria-hidden="true">
          <span className={styles.glow} />
          <HeroCloud />
          <HeroContainers />
          <HeroContainers className={styles.cratesLeft} />
        </div>
        <ul className={styles.stackList} data-m="stacklist" aria-label="Core stack">
          {stack.map((s) => (
            <li key={s} data-m="stack">
              {s}
            </li>
          ))}
        </ul>
        {/* Pre-optimized WebP with real alpha; plain img keeps the 800w/1148w srcset and avoids the image optimizer. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.portrait}
          data-m="portrait"
          src="/v2/portraits/hero-aws-cutout.webp"
          srcSet="/v2/portraits/hero-aws-cutout-800.webp 800w, /v2/portraits/hero-aws-cutout.webp 1148w"
          sizes="(min-width: 1024px) 36vw, 92vw"
          width={1148}
          height={1736}
          alt="Nguyen Pham Nhat Anh, arms crossed, wearing an AWS First Cloud Journey polo"
          fetchPriority="high"
        />
        <div className={styles.lip} aria-hidden="true" />
        <a href="#about" className={styles.scrollCue} data-m="cue">
          <span>
            Scroll
            <br />
            to explore
          </span>
          <ArrowDown size={34} strokeWidth={1.25} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
