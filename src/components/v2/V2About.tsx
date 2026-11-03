import { CalendarDays, Code2, GraduationCap } from "lucide-react";
import styles from "@/app/v2-preview/v2.module.css";

export default function V2About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="v2-about">
      <figure className={styles.aboutPhoto}>
        <span className={styles.photoSlab} aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/v2/portraits/working-laptop.webp"
          width={960}
          height={1441}
          sizes="(min-width: 1024px) 52vw, 92vw"
          alt="Nhat Anh working on a laptop at an FPT University event"
          loading="lazy"
        />
      </figure>

      <div className={styles.aboutContent}>
        <div className={styles.aboutHead}>
          <span className={styles.index}>
            02<i>/</i>
          </span>
          <h2 id="v2-about" className={styles.sectionTitle}>
            About Me.
          </h2>
        </div>
        <p className={styles.lede}>
          A software engineer who enjoys building reliable and scalable systems.
        </p>
        <p className={styles.aboutText}>
          I&apos;m a Software Engineering student at FPT University, focused on backend development and
          cloud infrastructure. I enjoy solving real-world problems, understanding how systems work, and
          turning technical ideas into practical and impactful products.
        </p>
        <ul className={styles.facts}>
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
