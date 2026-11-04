/**
 * Site-wide constants and the route mode.
 *
 * V2 is built at /v2-preview (the legacy homepage stays at /). Building with NEXT_PUBLIC_V2_HOME=1 serves V2 at "/" and its case studies at
 * "/projects/[slug]" instead (see next.config.ts), indexes it, and redirects the /v2-preview URLs to the final ones. Unsetting the variable
 * and rebuilding is the rollback: the legacy homepage is untouched and is what "/" serves again.
 */
export const siteUrl = "https://anhnpn.vercel.app";

export const v2IsHome = process.env.NEXT_PUBLIC_V2_HOME === "1";

export const homePath = v2IsHome ? "/" : "/v2-preview";
export const homeHref = (hash?: string) => `${homePath}${hash ? `#${hash}` : ""}`;
export const projectPath = (slug: string) => (v2IsHome ? `/projects/${slug}` : `/v2-preview/projects/${slug}`);

/** Verified facts only, all taken from the existing portfolio (legacy metadata, structured data and Education section). */
export const person = {
  name: "Nguyen Pham Nhat Anh",
  alias: "Alvin Nguyen",
  jobTitle: "Backend and Cloud Developer",
  university: "FPT University HCM",
  github: "https://github.com/nhatanh-dev",
  linkedin: "https://www.linkedin.com/in/annguyex/",
  image: `${siteUrl}/avt.jpg`,
} as const;

export const homeTitle = `${person.name} (${person.alias}) | Backend & Cloud Developer`;
export const homeDescription = `Portfolio of ${person.name} (${person.alias}), a Software Engineering student focused on .NET, AWS, real-time systems, and cloud infrastructure.`;
