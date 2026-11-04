import type { MetadataRoute } from "next";
import { published } from "@/components/v2/projects";
import { projectPath, siteUrl, v2IsHome } from "@/lib/site";

/**
 * Lists only canonical, indexable URLs. Until V2 is the homepage (NEXT_PUBLIC_V2_HOME=1) that is just the existing homepage; afterwards
 * it is the homepage plus every published case study. Drafts are never in `published`, so they can never be listed. No dates are
 * emitted: nothing here tracks a real modification time and none is invented.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return v2IsHome ? [{ url: `${siteUrl}/` }, ...published.map((p) => ({ url: `${siteUrl}${projectPath(p.slug)}` }))] : [{ url: `${siteUrl}/` }];
}
