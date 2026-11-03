import { ArrowDown, ArrowUpRight } from "lucide-react";
import styles from "@/app/v2-preview/v2.module.css";
import { HeroCloud, HeroContainers } from "./V2HeroArt";

const stack = [".NET", "AWS", "DOCKER", "DATABASE", "API"];

export default function V2Hero() {
  return (
    <section id="hero" className={styles.hero} aria-labelledby="v2-name">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Backend &amp; Cloud Developer</p>
        <h1 id="v2-name" className={styles.name}>
          <span className={styles.nameInk}>Nguyen Pham</span>
          <span className={styles.nameRed}>Nhat Anh.</span>
        </h1>
        <p className={styles.tagline}>
          Building reliable systems{" "}
          <br className={styles.brDesk} />
          that solve real-world problems.
        </p>
        <p className={styles.tags}>
          <span>.NET</span>
          <span>Cloud</span>
          <span>Real-time</span>
          <span>System Design</span>
        </p>
        <div className={styles.ctas}>
          <a href="#works" className={styles.btnSolid}>
            Explore My Work <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a href="#about" className={styles.btnGhost}>
            About Me
          </a>
        </div>
      </div>

      <div className={styles.stage}>
        <span className={styles.arc} aria-hidden="true" />
        <div className={styles.shape} aria-hidden="true">
          <HeroCloud />
          <HeroContainers />
          <HeroContainers className={styles.cratesLeft} />
        </div>
        <ul className={styles.stackList} aria-label="Core stack">
          {stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        {/* Pre-optimized WebP with real alpha; plain img keeps the 800w/1148w srcset and avoids the image optimizer. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.portrait}
          src="/v2/portraits/hero-aws-cutout.webp"
          srcSet="/v2/portraits/hero-aws-cutout-800.webp 800w, /v2/portraits/hero-aws-cutout.webp 1148w"
          sizes="(min-width: 1024px) 36vw, 92vw"
          width={1148}
          height={1736}
          alt="Nguyen Pham Nhat Anh, arms crossed, wearing an AWS First Cloud Journey polo"
          fetchPriority="high"
        />
        <div className={styles.lip} aria-hidden="true" />
        <a href="#about" className={styles.scrollCue}>
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
