/**
 * Credentials content. Titles, issuers, dates and credential types are taken from the original Coursera certificate PDFs
 * (assets/credentials/originals/); verification URLs are the share links supplied by the portfolio owner. The PDF's own verify ID
 * matches the ID each share link resolves to. Nothing here is a degree or an academic award.
 */
export type CredentialKind = "specialization" | "course" | "professional-certificate";
export type CredentialTier = "featured" | "supporting" | "archive";

export type Credential = {
  id: string;
  /** 1-based number in the portfolio's own ordering. */
  n: number;
  title: string;
  kind: CredentialKind;
  tier: CredentialTier;
  issuer: string;
  /** Date exactly as printed on the certificate (ISO date for machine use, label for display). */
  date: { iso: string; label: string };
  /** Number of courses printed on the certificate, when it is a multi-course credential. */
  courses?: number;
  /** Local WebP renders of the PDF's first page: `preview` ~900w, `full` ~1800w. */
  preview: { src: string; w: number; h: number };
  full: { src: string; w: number; h: number };
  /** Official Coursera share link supplied by the owner. */
  verifyUrl: string;
  /** Short factual line shown with the credential. Only content printed on the certificate. */
  note?: string;
};

export const kindLabel: Record<CredentialKind, string> = {
  specialization: "Specialization",
  course: "Course certificate",
  "professional-certificate": "Professional Certificate",
};

const img = (slug: string) => ({
  preview: { src: `/v2/credentials/${slug}-preview.webp`, w: 900, h: 695 },
  full: { src: `/v2/credentials/${slug}-full.webp`, w: 1800, h: 1391 },
});

export const credentials: Credential[] = [
  {
    id: "sdlc",
    n: 1,
    title: "Software Development Lifecycle",
    kind: "specialization",
    tier: "featured",
    issuer: "University of Minnesota",
    date: { iso: "2025-08-10", label: "August 2025" },
    courses: 4,
    ...img("sdlc"),
    verifyUrl: "https://coursera.org/share/dd473e4ee46e54711e932c4e0ea4a42e",
    note: "Four courses: development processes and methodologies, Agile, Lean, and engineering practices for building quality software.",
  },
  {
    id: "web-applications",
    n: 2,
    title: "Web Applications for Everybody",
    kind: "specialization",
    tier: "featured",
    issuer: "University of Michigan",
    date: { iso: "2025-06-09", label: "June 2025" },
    courses: 4,
    ...img("web-applications"),
    verifyUrl: "https://coursera.org/share/f370caa4c439339119b002996ff01a84",
    note: "Four courses: PHP web applications, SQL, database applications in PHP, and JavaScript, jQuery and JSON.",
  },
  {
    id: "project-management",
    n: 3,
    title: "Project Management Principles and Practices",
    kind: "specialization",
    tier: "featured",
    issuer: "University of California, Irvine",
    date: { iso: "2026-08-11", label: "August 2026" },
    courses: 4,
    ...img("project-management"),
    verifyUrl: "https://coursera.org/share/130e3de49500063b96df47c18e1d61a4",
    note: "Four courses: initiating and planning, budgeting and scheduling, managing risks and changes, and a project.",
  },
  {
    id: "sql",
    n: 4,
    title: "Introduction to Structured Query Language (SQL)",
    kind: "course",
    tier: "supporting",
    issuer: "University of Michigan",
    date: { iso: "2025-06-06", label: "June 2025" },
    ...img("sql"),
    verifyUrl: "https://coursera.org/share/a654e81c4b5d8710c14e39e98280fc38",
  },
  {
    id: "engineering-practices",
    n: 5,
    title: "Engineering Practices for Building Quality Software",
    kind: "course",
    tier: "supporting",
    issuer: "University of Minnesota",
    date: { iso: "2025-08-10", label: "August 2025" },
    ...img("engineering-practices"),
    verifyUrl: "https://coursera.org/share/5061fc238efc6b3037f1c77224dc2145",
  },
  {
    id: "ux-research",
    n: 6,
    title: "User Experience Research and Design",
    kind: "specialization",
    tier: "archive",
    issuer: "University of Michigan",
    date: { iso: "2025-11-24", label: "November 2025" },
    courses: 6,
    ...img("ux-research"),
    verifyUrl: "https://coursera.org/share/6f46758553ea46b9caebf1bca958ba7b",
  },
  {
    id: "certnexus",
    n: 7,
    title: "CertNexus Certified Ethical Emerging Technologist",
    kind: "professional-certificate",
    tier: "archive",
    issuer: "CertNexus",
    date: { iso: "2026-10-01", label: "October 2026" },
    courses: 6,
    ...img("certnexus"),
    verifyUrl: "https://coursera.org/share/aaef7e3baa5520c91525565cfca6ecda",
    // Printed on the certificate itself.
    note: "A Coursera Professional Certificate. It is not the industry certification (CET-110), which requires passing the CET-110 exam.",
  },
];

export const byTier = (t: CredentialTier) => credentials.filter((c) => c.tier === t);

/** Education facts from the existing portfolio's Education section. The legacy "High Distinction" phrase is deliberately not carried over: it is not backed by a source in the repo. */
export const education = {
  school: "FPT University HCM",
  degree: "Bachelor of Software Engineering",
  graduation: "Expected graduation: June 2027",
  stats: [
    { label: "Cumulative GPA", value: "8.6", of: "/10" },
    { label: "DSA score", value: "9.3", of: "/10" },
  ],
};
