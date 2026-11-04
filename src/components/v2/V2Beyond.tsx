"use client";

import { useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Maximize2 } from "lucide-react";
import styles from "@/app/(v2)/v2-preview/beyond.module.css";
import V2Chars from "./V2Chars";
import V2Viewer from "./V2Viewer";
import { curtainReveal } from "./motion";
import { chapters, copy, cutouts, doc, docs, type Doc } from "./beyondData";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TONES = ["light", "dark", "dark"] as const;

/** A documentary image as a button: the picture is never covered, the cue sits in a caption row below it. */
function DocBtn({ d, onOpen, className }: { d: Doc; onOpen: (i: number, el: HTMLElement) => void; className?: string }) {
  return (
    <button
      type="button"
      className={`${styles.docBtn} ${className ?? ""}`}
      aria-haspopup="dialog"
      aria-label={`View enlarged: ${d.title}. ${d.meta}`}
      onClick={(e) => onOpen(doc(d.id), e.currentTarget)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={d.thumb.src} width={d.thumb.w} height={d.thumb.h} loading="lazy" alt={d.alt} />
      <span className={styles.docHint} aria-hidden="true">
        <Maximize2 size={14} /> View enlarged
      </span>
    </button>
  );
}

export default function V2Beyond() {
  const root = useRef<HTMLElement>(null);
  const chRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [vw, setVw] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const open = (i: number, el: HTMLElement) => {
    opener.current = el;
    setVw(i);
  };

  const goto = (i: number) => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    chRefs.current[i]?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
  };

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);

      // Rail state follows the chapter in view (works with or without motion).
      chRefs.current.forEach((c, i) => {
        if (!c) return;
        ScrollTrigger.create({ trigger: c, start: "top 55%", end: "bottom 55%", onToggle: (s) => s.isActive && setActive(i) });
      });

      const mm = gsap.matchMedia();
      mm.add(
        { ok: "(prefers-reduced-motion: no-preference)", desk: "(min-width: 1024px)", fine: "(hover: hover) and (pointer: fine)" },
        (ctx) => {
          const { ok, desk, fine } = ctx.conditions as { ok: boolean; desk: boolean; fine: boolean };
          if (!ok) return;
          const [ch1, ch2] = chRefs.current as HTMLElement[];
          const reveal = (trigger: Element, start: string) =>
            gsap.timeline({ defaults: { ease: "expo.out" }, scrollTrigger: { trigger, start, toggleActions: "play none none reverse" } });
          const scrub = (trigger: Element, start = "top bottom", end = "bottom top") => ({ trigger, start, end, scrub: true });

          // The Ink section rises out of the Credentials paper through the shared slanted edge.
          curtainReveal(el, { start: "top 96%", end: "top 48%" });
          gsap.fromTo(
            q('[data-b="thread"]'),
            { scaleY: 0 },
            { scaleY: 1, transformOrigin: "50% 0", ease: "none", scrollTrigger: { trigger: el, start: "top 94%", end: "top 30%", scrub: 0.6 } },
          );
          gsap.fromTo(q('[data-b="head"]'), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 55%", toggleActions: "play none none reverse" } });

          /* ---------- 01 The Run: photographic reveal, then background and foreground move apart ---------- */
          const amp = desk ? 5 : 2;
          gsap.fromTo(q('[data-b="box1"]'), { clipPath: "inset(16% 0% 16% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: ch1, start: "top 88%", end: "top 28%", scrub: 0.6 } });
          gsap.fromTo(q('[data-b="bg1"]'), { yPercent: -amp }, { yPercent: amp, ease: "none", scrollTrigger: scrub(ch1) });
          gsap.fromTo(q('[data-b="fg1"]'), { yPercent: amp * 0.8 }, { yPercent: -amp * 0.8, ease: "none", scrollTrigger: scrub(ch1) });
          gsap.fromTo(q('[data-b="type1"]'), { xPercent: desk ? 7 : 4 }, { xPercent: desk ? -7 : -4, ease: "none", scrollTrigger: scrub(ch1) });
          reveal(ch1, "top 62%")
            .fromTo(q('[data-b="c1"]'), { yPercent: 118, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 1, stagger: 0.06, transformOrigin: "0% 100%" }, 0)
            .fromTo(q('[data-b="the1"]'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.2)
            .fromTo(q('[data-b="cut1"]'), { autoAlpha: 0, y: 46 }, { autoAlpha: 1, y: 0, duration: 1.3 }, 0.1);
          q('[data-b="rv1"]').forEach((t) =>
            gsap.fromTo(t, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, ease: "none", scrollTrigger: { trigger: t, start: "top 94%", end: "top 74%", scrub: 0.6 } }),
          );

          /* ---------- 02 The Court: a diagonal wipe travels across, slabs and lines follow its direction ---------- */
          gsap.fromTo(
            ch2,
            { clipPath: "polygon(0% 0%, 0% 0%, -14% 100%, 0% 100%)" },
            { clipPath: "polygon(0% 0%, 114% 0%, 100% 100%, 0% 100%)", ease: "none", scrollTrigger: { trigger: ch2, start: "top 94%", end: "top 30%", scrub: 0.6 } },
          );
          gsap.fromTo(q('[data-b="slabA"]'), { xPercent: -42, yPercent: 8 }, { xPercent: 0, yPercent: 0, ease: "none", scrollTrigger: { trigger: ch2, start: "top 80%", end: "top 12%", scrub: 0.8 } });
          gsap.fromTo(q('[data-b="slabB"]'), { xPercent: -80, yPercent: -6 }, { xPercent: 0, yPercent: 0, ease: "none", scrollTrigger: { trigger: ch2, start: "top 80%", end: "top 8%", scrub: 0.8 } });
          gsap.fromTo(q('[data-b="player-s"]'), { yPercent: 4 }, { yPercent: -4, ease: "none", scrollTrigger: scrub(ch2) });
          reveal(ch2, "top 55%")
            .fromTo(q('[data-b="c2"]'), { yPercent: 118, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 1, stagger: 0.05, transformOrigin: "0% 100%" }, 0)
            .fromTo(q('[data-b="the2"]'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.2)
            .fromTo(q('[data-b="line"]'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, stagger: 0.12, transformOrigin: "0% 50%" }, 0.1)
            .fromTo(q('[data-b="player-e"]'), { xPercent: -22, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 1.3 }, 0.15)
            .fromTo(q('[data-b="rec2"]'), { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, clearProps: "clipPath" }, 0.45)
            .fromTo(q('[data-b="copy2"]'), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.35);

          // Subtle pointer response on desktop: the geometry and the player drift a few px in opposite directions (own wrappers).
          if (desk && fine) {
            const geo = q('[data-b="geo-p"]')[0];
            const pl = q('[data-b="player-p"]')[0];
            const gx = gsap.quickTo(geo, "x", { duration: 0.9, ease: "power3.out" });
            const gy = gsap.quickTo(geo, "y", { duration: 0.9, ease: "power3.out" });
            const px = gsap.quickTo(pl, "x", { duration: 0.9, ease: "power3.out" });
            const py = gsap.quickTo(pl, "y", { duration: 0.9, ease: "power3.out" });
            const move = (e: PointerEvent) => {
              const r = ch2.getBoundingClientRect();
              const nx = (e.clientX - r.left) / r.width - 0.5;
              const ny = (e.clientY - r.top) / r.height - 0.5;
              gx(nx * -26);
              gy(ny * -14);
              px(nx * 12);
              py(ny * 7);
            };
            const leave = () => {
              gx(0);
              gy(0);
              px(0);
              py(0);
            };
            ch2.addEventListener("pointermove", move);
            ch2.addEventListener("pointerleave", leave);
            return () => {
              ch2.removeEventListener("pointermove", move);
              ch2.removeEventListener("pointerleave", leave);
            };
          }

        },
      );

      /* ---------- 03 The Voice: quiet contrast. Paper rises, letters mask in, the figure rises from the dark edge ---------- */
      mm.add({ ok: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
        if (!(ctx.conditions as { ok: boolean }).ok) return;
        const [, , ch3] = chRefs.current as HTMLElement[];
        curtainReveal(ch3, { start: "top 96%", end: "top 52%" });
        gsap
          .timeline({ defaults: { ease: "expo.out" }, scrollTrigger: { trigger: ch3, start: "top 50%", toggleActions: "play none none reverse" } })
          .fromTo(q('[data-b="c3"]'), { yPercent: 118, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.06, transformOrigin: "0% 100%" }, 0)
          .fromTo(q('[data-b="the3"]'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.2)
          .fromTo(q('[data-b="vslab"]'), { scaleY: 0 }, { scaleY: 1, transformOrigin: "50% 100%", duration: 1.3 }, 0.1)
          .fromTo(q('[data-b="speaker"]'), { yPercent: 24, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.5 }, 0.25)
          .fromTo(q('[data-b="copy3"]'), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.5);
        // Closing: the ink that will carry the next chapter rises across the bottom edge.
        curtainReveal(q('[data-b="end"]')[0] as HTMLElement, { start: "top 100%", end: "top 62%" });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const run = copy.run;
  const court = copy.court;
  const voice = copy.voice;
  const dRun = docs[doc("run-photo")];
  const dCert = docs[doc("run-certificate")];
  const dMedal = docs[doc("medal-card")];
  const at = cutouts.run.at;
  const atStyle: CSSProperties = { left: `${at.left}%`, top: `${at.top}%`, width: `${at.width}%`, height: `${at.height}%` };

  return (
    <section id="beyond" ref={root} className={styles.beyond} aria-labelledby="v2-beyond">
      <div className={styles.railWrap}>
        <nav className={styles.rail} aria-label="Beyond the Code chapters" data-tone={TONES[active]}>
          <ol>
            {chapters.map((c, i) => (
              <li key={c.id}>
                <button type="button" aria-current={active === i ? "true" : undefined} onClick={() => goto(i)}>
                  <span className={styles.railN}>{c.n}</span>
                  <span className={styles.railL}>{c.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* ================= 01 THE RUN ================= */}
      <div id="beyond-run" ref={(n) => void (chRefs.current[0] = n)} className={styles.ch1}>
        <div className={styles.stage}>
          <span className={styles.thread} data-b="thread" aria-hidden="true" />

          {/* First in DOM so the section heading (h2) precedes the chapter headings (h3); it is absolutely positioned above them. */}
          <header className={styles.head} data-b="head">
            <p className={styles.kicker}>
              <b>07</b> Beyond the Code · Three rounds
            </p>
            <h2 id="v2-beyond" className={styles.sectionTitle}>
              Beyond the Code
            </h2>
          </header>

          <div className={styles.box} data-b="box1" aria-hidden="true">
            <div className={styles.layer} data-b="bg1">
              <div className={styles.frame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img loading="lazy" className={styles.bgImg} src={dRun.full.src} width={dRun.full.w} height={dRun.full.h} alt="" />
                <span className={styles.spot} style={atStyle} />
              </div>
            </div>
          </div>

          <div className={styles.typeLayer} data-b="type1">
            <h3 className={styles.word} aria-label="The Run">
              <span className={styles.the} data-b="the1" aria-hidden="true">
                The
              </span>
              <span className={styles.mask} aria-hidden="true">
                <V2Chars text="Run" motion="c1" attr="data-b" />
              </span>
            </h3>
          </div>

          <div className={`${styles.box} ${styles.boxFg}`} data-b="box1">
            <div className={styles.layer} data-b="fg1">
              <div className={styles.frame}>
                <div className={styles.cut} style={atStyle} data-b="cut1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img loading="lazy" src={cutouts.run.img.src} width={cutouts.run.img.w} height={cutouts.run.img.h} alt={cutouts.run.alt} />
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className={styles.foot}>
          <div className={styles.cap} data-b="rv1">
            <p className={styles.lede}>{run.lede}</p>
            <p className={styles.capLine}>{run.caption}</p>
            <button
              type="button"
              className={styles.textBtn}
              aria-haspopup="dialog"
              onClick={(e) => open(doc("run-photo"), e.currentTarget)}
            >
              <Maximize2 size={14} aria-hidden="true" /> View the full photograph
            </button>
          </div>
          <div className={styles.rec} data-b="rv1">
            <DocBtn d={dCert} onOpen={open} className={styles.certThumb} />
            <div className={styles.recText}>
              <p className={styles.recLabel}>{run.record.label}</p>
              {run.record.lines.map((l) => (
                <p key={l} className={styles.recLine}>
                  {l}
                </p>
              ))}
              <p className={styles.recNote}>{run.record.note}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 02 THE COURT ================= */}
      <div id="beyond-court" ref={(n) => void (chRefs.current[1] = n)} className={styles.ch2}>
        <div className={styles.geo} aria-hidden="true">
          <div className={styles.geoP} data-b="geo-p">
            <span className={styles.slabA} data-b="slabA" />
            <span className={styles.slabB} data-b="slabB" />
            <span className={styles.lineA} data-b="line" />
            <span className={styles.lineB} data-b="line" />
            <span className={styles.lineC} data-b="line" />
          </div>
        </div>

        <div className={styles.courtWord}>
          <p className={styles.kick}>
            <b>02</b> Round two
          </p>
          <h3 className={styles.word} aria-label="The Court">
            <span className={styles.the} data-b="the2" aria-hidden="true">
              The
            </span>
            <span className={styles.mask} aria-hidden="true">
              <V2Chars text="Court" motion="c2" attr="data-b" />
            </span>
          </h3>
        </div>

        <div className={styles.player} data-b="player-s">
          <div data-b="player-e" className={styles.playerE}>
            <div data-b="player-p" className={styles.playerP}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" src={cutouts.court.img.src} width={cutouts.court.img.w} height={cutouts.court.img.h} alt={cutouts.court.alt} />
            </div>
          </div>
        </div>

        <p className={styles.courtLede} data-b="copy2">
          {court.lede}
        </p>

        <div className={styles.record} data-b="rec2">
          <DocBtn d={dMedal} onOpen={open} className={styles.medalThumb} />
          <div className={styles.recText}>
            <p className={styles.recLabel}>{court.record.label}</p>
            <p className={styles.printed} lang="vi">
              {court.record.printed}
            </p>
            <p className={styles.recLine}>{court.record.reading}</p>
            <p className={styles.recNote}>{court.record.note}</p>
          </div>
        </div>
      </div>

      {/* ================= 03 THE VOICE ================= */}
      <div id="beyond-voice" ref={(n) => void (chRefs.current[2] = n)} className={styles.ch3}>
        <span className={styles.vslab} data-b="vslab" aria-hidden="true" />
        <div className={styles.voiceWord}>
          <p className={styles.kick}>
            <b>03</b> Round three
          </p>
          <h3 className={styles.word} aria-label="The Voice">
            <span className={styles.the} data-b="the3" aria-hidden="true">
              The
            </span>
            <span className={styles.mask} aria-hidden="true">
              <V2Chars text="Voice" motion="c3" attr="data-b" />
            </span>
          </h3>
        </div>
        <div className={styles.voiceCopy}>
          <p className={styles.lede} data-b="copy3">
            {voice.lede}
          </p>
          <p className={styles.capLine} data-b="copy3">
            {voice.caption}
          </p>
        </div>
        <div className={styles.speaker} data-b="speaker">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy" src={cutouts.voice.img.src} width={cutouts.voice.img.w} height={cutouts.voice.img.h} alt={cutouts.voice.alt} />
        </div>
      </div>

      <div className={styles.end} data-b="end" aria-hidden="true" />

      <V2Viewer items={docs} index={vw} onIndex={setVw} onClose={() => setVw(null)} getOpener={() => opener.current} />
    </section>
  );
}
