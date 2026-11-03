/**
 * Technical Expertise content. Every technology, example and claim here is taken from what the existing portfolio already states
 * (Tech Stack section, project highlights/tech lists, FCAJ experience). Nothing is added beyond that.
 */
export type TechId = "backend" | "data" | "cloud" | "realtime" | "surfaces" | "delivery";

export type TechExample = { source: string; text: string };

export type TechCategory = {
  id: TechId;
  /** Short label shown inside the map node. */
  short: string;
  name: string;
  blurb: string;
  /** Every technology listed for the category (panel). */
  tools: string[];
  /** Subset shown as satellites around the node (kept small so the map stays legible). */
  core: string[];
  examples: TechExample[];
  /** Shown instead of examples when the existing portfolio attaches no project evidence to the category. */
  note?: string;
  /** Map position in percent of the map box, and the arc (degrees, 0 = right, 90 = down) satellites are spread over. */
  pos: { x: number; y: number };
  arc: { start: number; span: number };
};

export const techCategories: TechCategory[] = [
  {
    id: "backend",
    short: "Backend",
    name: "Backend & API Development",
    blurb: "APIs and services built in C# on .NET 9, with Java listed as additional backend experience.",
    tools: ["C#", ".NET 9", "REST APIs", "Java"],
    core: ["C#", ".NET 9", "REST APIs", "Java"],
    examples: [
      { source: "SmartInvoice Shield", text: "Built a .NET API with tenant isolation, audit logging, and role-based access control." },
      { source: "SmartInvoice Shield", text: "Applied retry, circuit breaker, and timeout policies to external validation calls." },
      { source: "EV Station Management System", text: "Backend Developer on a platform built with .NET 9." },
    ],
    pos: { x: 48, y: 42 },
    arc: { start: 200, span: 140 },
  },
  {
    id: "data",
    short: "Data",
    name: "Databases & Data Access",
    blurb: "Relational databases and data access, from EF Core on SQL Server to PostgreSQL.",
    tools: ["PostgreSQL", "SQL Server", "EF Core"],
    core: ["PostgreSQL", "SQL Server", "EF Core"],
    examples: [
      { source: "EV Station Management System", text: "Built with EF Core and SQL Server." },
      { source: "SmartInvoice Shield", text: "Built with PostgreSQL." },
    ],
    pos: { x: 74, y: 14 },
    arc: { start: 245, span: 110 },
  },
  {
    id: "cloud",
    short: "Cloud",
    name: "Cloud & Infrastructure",
    blurb: "Containerization and deployment foundations on AWS.",
    tools: ["AWS", "Docker", "ECS", "S3", "SQS", "ALB", "CloudFront", "EC2", "CloudWatch"],
    core: ["AWS", "Docker", "ECS", "S3", "SQS", "ALB"],
    examples: [
      { source: "SmartInvoice Shield", text: "Designed S3, SQS, ECS Fargate, ALB, and CloudFront infrastructure for asynchronous processing." },
      { source: "AWS First Cloud AI Journey", text: "Applied EC2, S3, ECS, ALB, and CloudWatch in collaborative, project-based infrastructure work." },
    ],
    pos: { x: 76, y: 66 },
    arc: { start: 20, span: 170 },
  },
  {
    id: "realtime",
    short: "Real-time",
    name: "Real-time & Integrations",
    blurb: "Real-time application flows, with SignalR for live updates and VNPay for payments.",
    tools: ["SignalR", "VNPay"],
    core: ["SignalR", "VNPay"],
    examples: [
      { source: "EV Station Management System", text: "Built SignalR channels for battery percentage, remaining time, and charging-state updates." },
      { source: "EV Station Management System", text: "Handled session timeouts and penalty calculations across concurrent station flows." },
      { source: "EV Station Management System", text: "Integrated payment and notification events across the booking and charging lifecycle." },
    ],
    pos: { x: 36, y: 76 },
    arc: { start: 40, span: 100 },
  },
  {
    id: "surfaces",
    short: "Surfaces",
    name: "Product Surfaces",
    blurb: "Enough frontend fluency to ship complete product features.",
    tools: ["React", "TypeScript", "Angular", "Flutter", "Tailwind CSS"],
    core: ["React", "TypeScript", "Angular", "Flutter", "Tailwind CSS"],
    examples: [],
    note: "These are listed as working fluency. The existing portfolio does not attach a specific project example to this area.",
    pos: { x: 18, y: 16 },
    arc: { start: 150, span: 180 },
  },
  {
    id: "delivery",
    short: "Delivery",
    name: "Delivery & Dev Tools",
    blurb: "Practical tools for collaboration, testing, and release work.",
    tools: ["Git", "GitHub Actions", "Postman", "Jira"],
    core: ["Git", "GitHub Actions", "Postman", "Jira"],
    examples: [{ source: "SmartInvoice Shield", text: "The architecture diagram covers delivery, processing, storage, queues, and CI/CD." }],
    pos: { x: 14, y: 52 },
    arc: { start: 80, span: 150 },
  },
];

/**
 * General relationships between areas, as in many systems. Illustrative only: this is not any single project's architecture.
 */
export const techLinks: [TechId, TechId, string][] = [
  ["surfaces", "backend", "call"],
  ["backend", "data", "read & write"],
  ["backend", "cloud", "run on"],
  ["backend", "realtime", "push"],
  ["realtime", "surfaces", "live updates"],
  ["data", "cloud", "hosted on"],
  ["delivery", "backend", "ship"],
  ["delivery", "cloud", "deploy"],
];

export const neighbours = (id: TechId): TechId[] =>
  techLinks.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : []));
