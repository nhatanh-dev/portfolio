import type { StaticImageData } from "next/image";
import evoltDashboard from "../../../public/projects/evolt-dashboard.png";
import evoltLanding from "../../../public/projects/evolt-landing.png";
import smartInvoice from "../../../public/projects/smartinvoice-aws-architecture.png";

/**
 * Single typed source for every project: Featured Works cards, the Project Index and the case-study pages are all derived from it.
 *
 * Publication has two independent conditions, and BOTH are required before a project appears anywhere publicly:
 *   1. `status: "published"`: an explicit decision by the owner. Filling in fields never publishes anything.
 *   2. `missingForPublication(p)` is empty: the data is complete enough that no page renders a gap or placeholder.
 * A project marked "published" that is incomplete fails the build with a list of what is missing (it is never silently hidden or shown).
 *
 * A project appears in Featured Works (`featured: true`) OR the Project Index (`featured: false`), never both.
 */
export type ProjectImage = { image: StaticImageData; alt: string; caption: string };

export type ProjectVideo = {
  /** Self-hosted file (webm or mp4). Never autoplays. */
  src: string;
  poster: StaticImageData;
  /** WebVTT captions track. Required: a video without captions cannot be published. */
  captions: string;
  title: string;
};

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  /** Explicit owner decision. "draft" projects are inert: they are not rendered, linked or built. */
  status: "published" | "draft";
  /** Featured: large Works card. Otherwise: row in the Project Index. Exclusive. */
  featured: boolean;
  /** Ascending. Orders Works cards and Index rows. */
  order: number;
  kind: "project" | "coursework";
  title: string;
  /** One sentence: what the project is. */
  summary: string;

  /** The owner's own role and period. */
  role: string;
  period: string;
  /** Team context, only when the owner states it (size, who else). Shown separately from personal contributions. */
  team?: string;

  stack: string[];
  /** Short tags for the featured card (a subset or summary of `stack`). Falls back to the first three stack items. */
  cardTags?: string[];

  /** PERSONAL: what the owner built, in the owner's words. Never project-wide claims. */
  contributions: string[];
  /** PROJECT-WIDE: what the project as a whole achieved. Not attributed to the owner. */
  projectOutcome?: string;

  /**
   * "public": source is public and `repository` is required (a Source button is shown).
   * "private": a repository exists but is deliberately not shown.
   * "none": there is no repository at all. Nothing about source is shown or implied.
   */
  visibility: "public" | "private" | "none";
  repository?: string;
  links?: ProjectLink[];

  screens?: ProjectImage[];
  diagram?: ProjectImage & { label?: string };
  video?: ProjectVideo;
  docs?: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "ev-station-management-system",
    status: "published",
    featured: true,
    order: 1,
    kind: "project",
    title: "EV Station Management System",
    summary: "A real-time platform for charging sessions, reservations, payments, and day-to-day station operations.",
    role: "Backend Developer",
    period: "Sep 2025 – Nov 2025",
    stack: [".NET 9", "EF Core", "SQL Server", "SignalR", "VNPay"],
    cardTags: [".NET", "AWS", "Real-time"],
    contributions: [
      "Built SignalR channels for battery percentage, remaining time, and charging-state updates.",
      "Handled session timeouts and penalty calculations across concurrent station flows.",
      "Integrated payment and notification events across the booking and charging lifecycle.",
    ],
    projectOutcome: "Kept customer and operator views synchronized across charging events, timeouts, faults, and penalty handling.",
    visibility: "public",
    repository: "https://github.com/nhatanh-dev/EVoltStation_BE",
    screens: [
      { image: evoltLanding, alt: "EVoltStation public landing page", caption: "Public landing page" },
      { image: evoltDashboard, alt: "EVoltStation dashboard showing a station map and charging information", caption: "Station dashboard" },
    ],
  },
  {
    slug: "smartinvoice-shield",
    status: "published",
    featured: true,
    order: 2,
    kind: "project",
    title: "SmartInvoice Shield",
    summary: "A multi-tenant invoice platform combining OCR, tax-risk checks, approval workflows, and AWS deployment.",
    role: "Cloud and Backend Developer",
    period: "Jan 2026 – Apr 2026",
    stack: [".NET 9", "PostgreSQL", "AWS", "Docker", "ECS", "SQS"],
    cardTags: [".NET", "AWS", "OCR"],
    contributions: [
      "Built a .NET API with tenant isolation, audit logging, and role-based access control.",
      "Designed S3, SQS, ECS Fargate, ALB, and CloudFront infrastructure for asynchronous processing.",
      "Applied retry, circuit breaker, and timeout policies to external validation calls.",
    ],
    projectOutcome: "Designed a resilient processing path from upload to OCR, validation, review, and final approval.",
    visibility: "public",
    repository: "https://github.com/nhatanh-dev/SmartInvoice",
    diagram: {
      image: smartInvoice,
      alt: "SmartInvoice Shield AWS architecture diagram",
      caption: "Event-driven cloud design covering delivery, processing, storage, queues, and CI/CD.",
      label: "AWS architecture",
    },
  },
  /*
   * Drafts. Name, one-line description and language come from the public GitHub profile only. They are NOT published: the owner has not
   * approved them and has not stated his role or contributions. They are inert until `status` is changed by the owner.
   */
  {
    slug: "flood-route",
    status: "draft",
    featured: false,
    order: 3,
    kind: "project",
    title: "flood-route",
    summary: "Turn-based flood rescue puzzle game built with Unity.",
    role: "",
    period: "",
    stack: ["C#", "Unity"],
    contributions: [],
    visibility: "public",
    repository: "https://github.com/nhatanh-dev/flood-route",
  },
  {
    slug: "fcaj-workshop",
    status: "draft",
    featured: false,
    order: 4,
    kind: "project",
    title: "FCAJ Workshop site",
    summary: "A website summarizing knowledge gained from the AWS FCAJ Program.",
    role: "",
    period: "",
    stack: ["JavaScript", "HTML", "CSS"],
    contributions: [],
    visibility: "public",
    repository: "https://github.com/nhatanh-dev/FCAJ_Workshop",
  },
];

/** What is still missing before a project's pages can render without a gap. Empty means complete (it does NOT mean approved). */
export function missingForPublication(p: Project): string[] {
  const m: string[] = [];
  if (!p.slug) m.push("slug");
  if (!p.title) m.push("title");
  if (!p.summary) m.push("summary");
  if (!p.role) m.push("role");
  if (!p.period) m.push("period");
  if (!p.stack.length) m.push("stack");
  if (!p.contributions.length) m.push("contributions (personal)");
  if (p.visibility === "public" && !p.repository) m.push("repository (visibility is public)");
  if (p.visibility !== "public" && p.repository) m.push("repository must be omitted unless visibility is public");
  if (p.video && !(p.video.src && p.video.captions && p.video.title)) m.push("video src, title and captions");
  if (p.featured && !(p.screens?.length || p.diagram || p.video)) m.push("featured card image (screens, diagram or video poster)");
  return m;
}

/**
 * Publication gate. A project is public only if the owner set `status: "published"` AND it is complete. Completeness alone never
 * publishes. A published-but-incomplete entry throws, so the problem surfaces at build time instead of shipping a gap.
 */
function gate(all: Project[]): Project[] {
  const slugs = new Set<string>();
  return all
    .filter((p) => p.status === "published")
    .map((p) => {
      const miss = missingForPublication(p);
      if (miss.length) throw new Error(`Project "${p.slug}" is marked published but is incomplete: ${miss.join(", ")}`);
      if (slugs.has(p.slug)) throw new Error(`Duplicate project slug "${p.slug}"`);
      slugs.add(p.slug);
      return p;
    })
    .sort((a, b) => a.order - b.order);
}

export const published = gate(projects);
/** Exclusive by construction: the `featured` flag splits the published list. */
export const featuredProjects = published.filter((p) => p.featured);
export const indexProjects = published.filter((p) => !p.featured);
export const bySlug = (slug: string) => published.find((p) => p.slug === slug);

/** The image a featured card shows when the project has no screenshots: the architecture diagram, else the video poster. */
export function cardDiagram(p: Project): { image: StaticImageData; alt: string; label?: string } | undefined {
  if (p.diagram) return p.diagram;
  if (p.video) return { image: p.video.poster, alt: `${p.title} demo video poster`, label: "Demo video" };
  return undefined;
}

/** The owner's GitHub profile, shown as a secondary link in Selected Works. */
export const githubProfile = "https://github.com/nhatanh-dev";
