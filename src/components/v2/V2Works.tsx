import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import styles from "@/app/v2-preview/v2.module.css";
import evoltDashboard from "../../../public/projects/evolt-dashboard.png";
import evoltLanding from "../../../public/projects/evolt-landing.png";
import smartInvoice from "../../../public/projects/smartinvoice-aws-architecture.png";

function Pills({ items }: { items: string[] }) {
  return (
    <p className={styles.pills}>
      {items.map((t) => (
        <span key={t}>{t}</span>
      ))}
    </p>
  );
}

function RepoLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className={styles.repoLink} target="_blank" rel="noopener noreferrer">
      {label} <ArrowUpRight size={18} aria-hidden="true" />
      <span className={styles.srOnly}> (opens in a new tab)</span>
    </a>
  );
}

export default function V2Works() {
  return (
    <section id="works" className={styles.works} aria-labelledby="v2-works">
      <div className={styles.worksIntro}>
        <span className={styles.index}>
          03<i>/</i>
        </span>
        <h2 id="v2-works" className={`${styles.sectionTitle} ${styles.onDark}`}>
          Selected
          <br />
          Works
        </h2>
        <p>
          A collection of real projects where I design, build, and deploy backend systems, with a focus on
          reliability, scalability, and real-world impact.
        </p>
      </div>

      <div className={styles.projects}>
        <article className={styles.featured}>
          <div className={styles.featuredCopy}>
            <p className={styles.kicker}>01 — Backend Developer · Sep 2025 – Nov 2025</p>
            <Pills items={[".NET", "AWS", "Real-time"]} />
            <h3>EV Station Management System</h3>
            <p>
              A real-time platform for charging sessions, reservations, payments, and day-to-day station
              operations.
            </p>
            <RepoLink href="https://github.com/nhatanh-dev/EVoltStation_BE" label="View source" />
          </div>
          <div className={styles.shots}>
            <div className={styles.shotBack}>
              <Image
                src={evoltLanding}
                alt="EVoltStation public landing page"
                sizes="(min-width: 1024px) 40vw, 80vw"
              />
            </div>
            <div className={styles.shotFront}>
              <Image
                src={evoltDashboard}
                alt="EVoltStation dashboard showing a station map and charging information"
                sizes="(min-width: 1024px) 44vw, 90vw"
              />
            </div>
          </div>
        </article>

        <article className={styles.secondary}>
          <div className={styles.diagram}>
            <Image
              src={smartInvoice}
              alt="SmartInvoice Shield AWS architecture diagram"
              sizes="(min-width: 1024px) 30vw, 90vw"
            />
            <span>AWS architecture</span>
          </div>
          <div className={styles.secondaryCopy}>
            <p className={styles.kicker}>02 — Cloud &amp; Backend Developer · Jan 2026 – Apr 2026</p>
            <Pills items={[".NET", "AWS", "OCR"]} />
            <h3>SmartInvoice Shield</h3>
            <p>
              A multi-tenant invoice platform combining OCR, tax-risk checks, approval workflows, and AWS
              deployment.
            </p>
            <RepoLink href="https://github.com/nhatanh-dev/SmartInvoice" label="View source" />
          </div>
        </article>
      </div>
    </section>
  );
}
