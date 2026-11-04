import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import styles from "../../project.module.css";
import { bySlug, published, githubProfile } from "@/components/v2/projects";
import { contact } from "@/components/v2/contactData";

type Props = { params: Promise<{ slug: string }> };

// Only published projects are built; anything else (drafts, unknown slugs) is a 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return published.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = bySlug((await params).slug);
  return p ? { title: `${p.title} · Case study`, description: p.summary } : {};
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} <ArrowUpRight size={15} aria-hidden="true" />
      <span className={styles.srOnly}> (opens in a new tab)</span>
    </a>
  );
}

export default async function CaseStudy({ params }: Props) {
  const p = bySlug((await params).slug);
  if (!p) notFound();
  const i = published.findIndex((x) => x.slug === p.slug);
  const next = published[(i + 1) % published.length];
  const hasMedia = !!(p.screens?.length || p.diagram || p.video);
  const hasLinks = (p.visibility === "public" && !!p.repository) || !!p.links?.length;

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <Link href="/v2-preview#works" className={styles.back}>
          <ArrowLeft size={18} aria-hidden="true" /> Selected Works
        </Link>
        <a href={`mailto:${contact.email}`} className={styles.mail}>
          Email <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </header>

      <main id="main-content" tabIndex={-1} className={styles.main}>
        <div className={styles.hero}>
          <div>
            <p className={styles.kicker}>
              Case study · {p.role} · {p.period}
            </p>
            <h1 className={styles.title}>{p.title}</h1>
          </div>
          <p className={styles.sum}>{p.summary}</p>
        </div>

        <dl className={styles.facts}>
          <div>
            <dt>Role</dt>
            <dd>{p.role}</dd>
          </div>
          <div>
            <dt>Period</dt>
            <dd>{p.period}</dd>
          </div>
          {p.team && (
            <div>
              <dt>Team</dt>
              <dd>{p.team}</dd>
            </div>
          )}
          <div>
            <dt>Stack</dt>
            <dd>{p.stack.join(" · ")}</dd>
          </div>
          {hasLinks && (
            <div>
              <dt>Links</dt>
              <dd className={styles.links}>
                {p.visibility === "public" && p.repository && <Ext href={p.repository}>Source on GitHub</Ext>}
                {p.links?.map((l) => (
                  <Ext key={l.href} href={l.href}>
                    {l.label}
                  </Ext>
                ))}
              </dd>
            </div>
          )}
        </dl>

        <article className={styles.body}>
          <section className={styles.sec} aria-labelledby="cs-built">
            <h2 id="cs-built">What I built</h2>
            <ul>
              {p.contributions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          {p.projectOutcome && (
            <section className={styles.sec} aria-labelledby="cs-outcome">
              <h2 id="cs-outcome">Project outcome</h2>
              <p>{p.projectOutcome}</p>
            </section>
          )}

          {hasMedia && (
            <section className={styles.sec} aria-labelledby="cs-media">
              <h2 id="cs-media">{p.screens?.length ? "Screens" : p.diagram ? "Architecture" : "Demo"}</h2>
              {p.video && (
                <figure className={styles.fig}>
                  <video controls preload="none" poster={p.video.poster.src} aria-label={p.video.title}>
                    <source src={p.video.src} />
                    <track kind="captions" src={p.video.captions} srcLang="en" label="English" default />
                  </video>
                  <figcaption>{p.video.title}</figcaption>
                </figure>
              )}
              {p.screens && (
                <div className={styles.gal}>
                  {p.screens.map((m) => (
                    <figure key={m.caption} className={styles.fig}>
                      <Image src={m.image} alt={m.alt} sizes="(min-width: 1024px) 40vw, 92vw" placeholder="blur" />
                      <figcaption>{m.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              )}
              {p.diagram && (
                <figure className={styles.fig}>
                  <Image src={p.diagram.image} alt={p.diagram.alt} sizes="(min-width: 1024px) 60vw, 92vw" placeholder="blur" />
                  <figcaption>{p.diagram.caption}</figcaption>
                </figure>
              )}
            </section>
          )}

          {p.docs && p.docs.length > 0 && (
            <section className={styles.sec} aria-labelledby="cs-docs">
              <h2 id="cs-docs">Documentation</h2>
              <ul className={styles.docs}>
                {p.docs.map((d) => (
                  <li key={d.href}>
                    <Ext href={d.href}>{d.label}</Ext>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        <nav className={styles.next} aria-label="More">
          {published.length > 1 ? (
            <Link href={`/v2-preview/projects/${next.slug}`} className={styles.nextLink}>
              <span>Next case study</span>
              <b>
                {next.title} <ArrowRight size={28} aria-hidden="true" />
              </b>
            </Link>
          ) : (
            <span />
          )}
          <a href={githubProfile} target="_blank" rel="noopener noreferrer" className={styles.gh}>
            All repositories on GitHub <ArrowUpRight size={16} aria-hidden="true" />
            <span className={styles.srOnly}> (opens in a new tab)</span>
          </a>
        </nav>
      </main>
    </div>
  );
}
