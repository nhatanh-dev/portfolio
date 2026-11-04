import type { NextConfig } from "next";

/**
 * Route mode. By default the legacy homepage serves "/" and V2 lives at /v2-preview. With NEXT_PUBLIC_V2_HOME=1 V2 serves "/" and
 * "/projects/[slug]" (internal rewrites; the page files stay where they are) and the /v2-preview URLs redirect to the final ones, so
 * there is one canonical URL per page. Redirects are temporary (307) until the release is final, so a rollback is not cached by browsers.
 * See src/lib/site.ts and RELEASE.md.
 */
const v2Home = process.env.NEXT_PUBLIC_V2_HOME === "1";

const nextConfig: NextConfig = {
  async rewrites() {
    return v2Home
      ? {
          beforeFiles: [
            { source: "/", destination: "/v2-preview" },
            { source: "/projects/:slug", destination: "/v2-preview/projects/:slug" },
          ],
          afterFiles: [],
          fallback: [],
        }
      : { beforeFiles: [], afterFiles: [], fallback: [] };
  },
  async redirects() {
    return v2Home
      ? [
          { source: "/v2-preview", destination: "/", permanent: false },
          { source: "/v2-preview/projects/:slug", destination: "/projects/:slug", permanent: false },
        ]
      : [];
  },
};

export default nextConfig;
