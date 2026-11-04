import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Everything canonical is crawlable. The /v2-preview URLs are kept out of the index with a noindex meta tag (preview build) or a redirect
 * (release build), not with Disallow: a disallowed URL cannot show its noindex tag, and a blocked page can still be listed from links.
 */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${siteUrl}/sitemap.xml`, host: siteUrl };
}
