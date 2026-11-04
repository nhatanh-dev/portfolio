import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projectPath } from "@/lib/site";
import styles from "@/app/(v2)/v2-preview/project.module.css";
import { indexProjects } from "./projects";

/**
 * Compact editorial index of the published, non-featured projects. It renders nothing until there is at least one such project, so an
 * unpublished or unfinished project can never leave an empty or placeholder block on the page.
 */
export default function V2ProjectIndex() {
  if (!indexProjects.length) return null;
  return (
    <section className={styles.index} aria-labelledby="v2-index">
      <div className={styles.indexHead}>
        <div>
          <span className={styles.indexK}>More work</span>
          <h3 id="v2-index" className={styles.indexTitle}>
            Project Index
          </h3>
        </div>
      </div>
      <ol className={styles.rows}>
        {indexProjects.map((p, i) => (
          <li key={p.slug}>
            <Link href={projectPath(p.slug)} className={styles.row}>
              <span className={styles.rowN} aria-hidden="true">
                {String(i + 3).padStart(2, "0")}
              </span>
              <div className={styles.rowT}>
                <h4>{p.title}</h4>
                <p>{p.summary}</p>
              </div>
              <div className={styles.rowChips} role="list" aria-label={`${p.title} technologies`}>
                {p.stack.map((s) => (
                  <span key={s} role="listitem">
                    {s}
                  </span>
                ))}
              </div>
              <span className={styles.rowGo} aria-hidden="true">
                <ArrowUpRight size={16} />
              </span>
              <span className={styles.srOnly}>View case study</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
