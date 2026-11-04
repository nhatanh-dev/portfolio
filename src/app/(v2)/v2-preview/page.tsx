import V2Nav from "@/components/v2/V2Nav";
import V2Anchors from "@/components/v2/V2Anchors";
import V2Dock from "@/components/v2/V2Dock";
import type { Metadata } from "next";
import styles from "./v2.module.css";
import JsonLd from "@/components/v2/JsonLd";
import { homeDescription, homePath, homeTitle, person, siteUrl } from "@/lib/site";
import { v2Sections } from "@/components/v2/registry";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  alternates: { canonical: homePath },
  openGraph: { title: homeTitle, description: homeDescription, url: homePath, images: [{ url: "/og", width: 1200, height: 630, alt: `${person.name}, ${person.jobTitle}` }] },
  twitter: { title: homeTitle, description: homeDescription, images: ["/og"] },
};

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: person.name,
      alternateName: person.alias,
      url: siteUrl,
      image: person.image,
      jobTitle: person.jobTitle,
      alumniOf: { "@type": "CollegeOrUniversity", name: person.university },
      sameAs: [person.github, person.linkedin],
    },
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: person.name, inLanguage: "en", author: { "@id": `${siteUrl}/#person` } },
  ],
};

export default function V2Page() {
  return (
    <>
      <JsonLd data={graph} />
      <V2Nav />
      <V2Anchors />
      <V2Dock />
      {/* id matches the root layout's skip link (#main-content); tabIndex lets the skip link move keyboard focus here. */}
      <main id="main-content" tabIndex={-1} className={styles.main}>
        {v2Sections.map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </main>
    </>
  );
}
