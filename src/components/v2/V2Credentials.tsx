"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, ChevronDown, Maximize2 } from "lucide-react";
import styles from "@/app/v2-preview/credentials.module.css";
import V2Chars from "./V2Chars";
import V2Lightbox from "./V2Lightbox";
import { curtainReveal } from "./motion";
import { byTier, credentials, education, kindLabel, type Credential } from "./credentialsData";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const idx = (c: Credential) => credentials.findIndex((x) => x.id === c.id);
const pad = (n: number) => String(n).padStart(2, "0");
const featured = byTier("featured");
const supporting = byTier("supporting");
const archive = byTier("archive");

function Verify({ c, dark }: { c: Credential; dark?: boolean }) {
  return (
    <a href={c.verifyUrl} className={dark ? styles.verifyLight : styles.verify} target="_blank" rel="noopener noreferrer">
      Verify on Coursera <ArrowUpRight size={18} aria-hidden="true" />
      <span className={styles.srOnly}> {c.title} (opens Coursera in a new tab)</span>
    </a>
  );
}

type OpenFn = (i: number, el: HTMLElement) => void;

/** The certificate image itself is the trigger for the enlarged view. */
function Cert({ c, onOpen, sizes, priority }: { c: Credential; onOpen: OpenFn; sizes: string; priority?: boolean }) {
  return (
    <button
      type="button"
      className={styles.certBtn}
      aria-haspopup="dialog"
      aria-label={`View enlarged certificate: ${c.title}, ${c.issuer}, ${c.date.label}`}
      onClick={(e) => onOpen(idx(c), e.currentTarget)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={c.preview.src}
        width={c.preview.w}
        height={c.preview.h}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        alt={`${kindLabel[c.kind]} certificate: ${c.title}, issued by ${c.issuer}, ${c.date.label}.`}
      />
      <span className={styles.certHint} aria-hidden="true">
        <Maximize2 size={14} /> View certificate
      </span>
    </button>
  );
}

function Meta({ c }: { c: Credential }) {
  return (
    <p className={styles.meta}>
      <span>{kindLabel[c.kind]}</span>
      <time dateTime={c.date.iso}>{c.date.label}</time>
    </p>
  );
}

export default function V2Credentials() {
  const root = useRef<HTMLElement>(null);
  const [lb, setLb] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [more, setMore] = useState(false);

  const open: OpenFn = (i, el) => {
    opener.current = el;
    setLb(i);
  };

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        el.classList.add(styles.live);

        // Warm Paper rises out of the Ink section through the shared slanted edge.
        curtainReveal(el, { start: "top 96%", end: "top 48%" });
        gsap.fromTo(
          q('[data-c="thread"]'),
          { scaleY: 0, autoAlpha: 1 },
          { scaleY: 1, transformOrigin: "50% 0", ease: "none", scrollTrigger: { trigger: el, start: "top 94%", end: "top 30%", scrub: 0.6 } },
        );

        gsap
          .timeline({ defaults: { ease: "expo.out" }, scrollTrigger: { trigger: el, start: "top 52%", toggleActions: "play none none reverse" } })
          .fromTo(q('[data-c="ch"]'), { yPercent: 118, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 1, stagger: 0.035, transformOrigin: "0% 100%" }, 0)
          .fromTo(q('[data-c="intro"]'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.3);

        // Primary certificate: scrubbed perspective. It starts turned away and settles flat as it reaches reading position.
        const prim = q('[data-c="prim"]')[0];
        if (prim) {
          gsap.fromTo(
            q('[data-c="prim-tilt"]'),
            { rotateY: -16, rotateX: 7, y: 60, transformPerspective: 1400, transformOrigin: "50% 50%" },
            { rotateY: 0, rotateX: 0, y: 0, ease: "none", scrollTrigger: { trigger: prim, start: "top 92%", end: "top 38%", scrub: 0.6 } },
          );
          gsap.fromTo(q('[data-c="prim-slab"]'), { yPercent: 14, xPercent: -6 }, { yPercent: -10, xPercent: 0, ease: "none", scrollTrigger: { trigger: prim, start: "top bottom", end: "bottom top", scrub: true } });
          gsap
            .timeline({ defaults: { ease: "expo.out" }, scrollTrigger: { trigger: prim, start: "top 68%", toggleActions: "play none none reverse" } })
            .fromTo(q('[data-c="prim-copy"]'), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09 }, 0);
        }

        // Secondary featured pair: clipped wipe plus a depth drift at different rates.
        q('[data-c="sec"]').forEach((s, i) => {
          gsap
            .timeline({ defaults: { ease: "expo.out" }, scrollTrigger: { trigger: s, start: "top 80%", toggleActions: "play none none reverse" } })
            .fromTo(s.querySelector('[data-c="sec-img"]'), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, clearProps: "clipPath" }, 0)
            .fromTo(s.querySelectorAll('[data-c="sec-copy"]'), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.25);
          gsap.fromTo(s.querySelector('[data-c="sec-drift"]'), { yPercent: i ? 7 : 4 }, { yPercent: i ? -7 : -4, ease: "none", scrollTrigger: { trigger: s, start: "top bottom", end: "bottom top", scrub: true } });
        });

        // Supporting block, education ledger.
        q('[data-c="rv"]').forEach((t) =>
          gsap.fromTo(t, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, ease: "none", scrollTrigger: { trigger: t, start: "top 92%", end: "top 70%", scrub: 0.6 } }),
        );

        // Gentle pointer tilt on the primary certificate (fine pointers only). Lives on its own wrapper, separate from the scrub above.
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && prim) {
          const tilt = q('[data-c="prim-pointer"]')[0];
          const rx = gsap.quickTo(tilt, "rotateY", { duration: 0.7, ease: "power3.out" });
          const ry = gsap.quickTo(tilt, "rotateX", { duration: 0.7, ease: "power3.out" });
          gsap.set(tilt, { transformPerspective: 1400 });
          const move = (e: PointerEvent) => {
            const r = tilt.getBoundingClientRect();
            rx(((e.clientX - r.left) / r.width - 0.5) * 7);
            ry(((e.clientY - r.top) / r.height - 0.5) * -5);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          tilt.addEventListener("pointermove", move as EventListener);
          tilt.addEventListener("pointerleave", leave);
          return () => {
            tilt.removeEventListener("pointermove", move as EventListener);
            tilt.removeEventListener("pointerleave", leave);
            el.classList.remove(styles.live);
          };
        }
        return () => el.classList.remove(styles.live);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const first = featured[0];

  return (
    <section id="credentials" ref={root} className={styles.cred} aria-labelledby="v2-cred">
      <span className={styles.thread} data-c="thread" aria-hidden="true" />

      <header className={styles.head}>
        <p className={styles.kicker} data-c="intro">
          <b>06</b> Credentials · Proof of progress
        </p>
        <h2 id="v2-cred" className={styles.title} aria-label="Credentials">
          <span className={styles.mask}>
            <V2Chars text="Credentials" motion="ch" attr="data-c" />
            <span className={styles.dot} aria-hidden="true">
              .
            </span>
          </span>
        </h2>
        <div className={styles.headText}>
          <p className={styles.lede} data-c="intro">
            Seven selected credentials. Verified learning, documented progress.
          </p>
        </div>
      </header>

      {/* ---------- Featured ---------- */}
      <div className={styles.featured}>
        <article className={styles.prim} data-c="prim" aria-labelledby={`c-${first.id}`}>
          <div className={styles.primMedia}>
            <span className={styles.primSlab} data-c="prim-slab" aria-hidden="true" />
            <div data-c="prim-tilt" className={styles.primTilt}>
              <div data-c="prim-pointer" className={styles.primPointer}>
                <Cert c={first} onOpen={open} sizes="(min-width: 1024px) 52vw, 92vw" />
              </div>
            </div>
          </div>
          <div className={styles.primCopy}>
            <p className={styles.no} data-c="prim-copy">
              <b>{pad(first.n)}</b> Featured
            </p>
            <h3 id={`c-${first.id}`} className={styles.primTitle} data-c="prim-copy">
              {first.title}
            </h3>
            <div data-c="prim-copy">
              <Meta c={first} />
            </div>
            <p className={styles.issuer} data-c="prim-copy">
              {first.issuer}
            </p>
            <p className={styles.note} data-c="prim-copy">
              {first.note}
            </p>
            <div className={styles.actions} data-c="prim-copy">
              <Verify c={first} />
            </div>
          </div>
        </article>

        <div className={styles.pair}>
          {featured.slice(1).map((c, i) => (
            <article key={c.id} className={`${styles.sec} ${i ? styles.secB : styles.secA}`} data-c="sec" aria-labelledby={`c-${c.id}`}>
              <div data-c="sec-drift">
                <div className={styles.secImg} data-c="sec-img">
                  <Cert c={c} onOpen={open} sizes="(min-width: 1024px) 38vw, 92vw" />
                </div>
              </div>
              <div className={styles.secCopy}>
                <p className={styles.no} data-c="sec-copy">
                  <b>{pad(c.n)}</b> Featured
                </p>
                <h3 id={`c-${c.id}`} className={styles.secTitle} data-c="sec-copy">
                  {c.title}
                </h3>
                <div data-c="sec-copy">
                  <Meta c={c} />
                </div>
                <p className={styles.issuer} data-c="sec-copy">
                  {c.issuer}
                </p>
                <div className={styles.actions} data-c="sec-copy">
                  <Verify c={c} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ---------- Supporting learning & archive ---------- */}
      <div className={styles.archive} data-c="rv">
        <div className={styles.archHead}>
          <div>
            <h3 className={styles.archTitle}>Supporting learning &amp; archive</h3>
            <p className={styles.archSub}>
              {supporting.length} course certificates and {archive.length} further credentials.
            </p>
          </div>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={more}
            aria-controls="cred-archive"
            onClick={() => setMore((v) => !v)}
          >
            <span>{more ? "Hide" : "Browse"} {supporting.length + archive.length} more certificates</span>
            <ChevronDown size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Peek list stays visible so the content is discoverable without opening the drawer. */}
        {!more && (
          <ul className={styles.peek} aria-label="Included in the archive">
            {[...supporting, ...archive].map((c) => (
              <li key={c.id}>
                <span>{pad(c.n)}</span> {c.title}
              </li>
            ))}
          </ul>
        )}

        <div id="cred-archive" className={styles.drawer} data-open={more}>
          <div className={styles.drawerInner}>
            <div className={styles.group}>
              <p className={styles.groupLabel}>Supporting course certificates</p>
              <div className={styles.supGrid}>
                {supporting.map((c, i) => (
                  <article key={c.id} className={styles.sup} style={{ "--i": i } as React.CSSProperties} aria-labelledby={`c-${c.id}`}>
                    <Cert c={c} onOpen={open} sizes="(min-width: 1024px) 30vw, 92vw" />
                    <div className={styles.supCopy}>
                      <Meta c={c} />
                      <h4 id={`c-${c.id}`}>{c.title}</h4>
                      <p className={styles.issuer}>{c.issuer}</p>
                      <Verify c={c} />
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className={styles.group}>
              <p className={styles.groupLabel}>Archive</p>
              <div className={styles.arcGrid}>
                {archive.map((c, i) => (
                  <article key={c.id} className={styles.arc} style={{ "--i": i + 2 } as React.CSSProperties} aria-labelledby={`c-${c.id}`}>
                    <Cert c={c} onOpen={open} sizes="(min-width: 1024px) 22vw, 92vw" />
                    <div className={styles.supCopy}>
                      <Meta c={c} />
                      <h4 id={`c-${c.id}`}>{c.title}</h4>
                      <p className={styles.issuer}>{c.issuer}</p>
                      {c.note && <p className={styles.caveat}>{c.note}</p>}
                      <Verify c={c} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Education & achievements ---------- */}
      <div className={styles.edu} data-c="rv" aria-labelledby="edu-title">
        <div className={styles.eduHead}>
          <p className={styles.eduKicker}>Education &amp; achievements</p>
          <h3 id="edu-title" className={styles.eduSchool}>
            {education.school}
          </h3>
          <p className={styles.eduDegree}>{education.degree}</p>
          <p className={styles.eduGrad}>{education.graduation}</p>
        </div>
        <dl className={styles.eduStats}>
          {education.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>
                {s.value}
                <span>{s.of}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className={styles.eduNote}>
          The Coursera certificates are online learning credentials, separate from the degree.
        </p>
      </div>

      <V2Lightbox index={lb} onIndex={setLb} onClose={() => setLb(null)} getOpener={() => opener.current} />
    </section>
  );
}
