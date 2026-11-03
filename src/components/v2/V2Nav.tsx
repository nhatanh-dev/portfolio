import styles from "@/app/v2-preview/v2.module.css";

const links = [
  { n: "01", label: "Home", href: "#hero", active: true },
  { n: "02", label: "About", href: "#about" },
  { n: "03", label: "Works", href: "#works" },
];

export default function V2Nav() {
  return (
    <header className={styles.nav}>
      <a href="#hero" className={styles.logo} aria-label="NPA home">
        NPA<span>.</span>
      </a>
      <nav aria-label="Primary" className={styles.navLinks}>
        {links.map((l) => (
          <a key={l.href} href={l.href} aria-current={l.active ? "page" : undefined}>
            <sup>{l.n}</sup>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
