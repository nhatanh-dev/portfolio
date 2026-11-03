import styles from "@/app/v2-preview/v2.module.css";
import { v2Sections } from "./registry";

export default function V2Nav() {
  return (
    <header className={styles.nav}>
      <a href="#hero" className={styles.logo} aria-label="NPA home">
        NPA<span>.</span>
      </a>
      <nav aria-label="Primary" className={styles.navLinks}>
        {v2Sections.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} aria-current={i === 0 ? "page" : undefined}>
            <sup>{String(i + 1).padStart(2, "0")}</sup>
            {s.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
