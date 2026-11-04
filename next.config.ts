import type { NextConfig } from "next";

/**
 * Route mode. By default the legacy homepage serves "/" and V2 lives at /v2-preview. With NEXT_PUBLIC_V2_HOME=1 V2 serves "/" and
 * "/projects/[slug]" (internal rewrites; the page files stay where they are) and the /v2-preview URLs redirect to the final ones, so
 * there is one canonical URL per page. Redirects are temporary (307) until the release is final, so a rollback is not cached by browsers.
 * See src/lib/site.ts and RELEASE.md.
 *
 * The flag is read at BUILD time (NEXT_PUBLIC_* is inlined into the bundle), so every Vercel environment evaluates it separately:
 *  - Production: only an explicit NEXT_PUBLIC_V2_HOME=1 in the Production environment turns it on. Nothing else can.
 *  - Preview:    the variable can be set per environment in Vercel; as a staging convenience it also defaults to "1" for Preview builds of
 *                the redesign/v2-prototype branch only (VERCEL_ENV=preview), so that branch can be verified without touching project
 *                settings. This default can never apply to Production (VERCEL_ENV=production) or to any other branch.
 */
const stagingDefault = process.env.VERCEL_ENV === "preview" && process.env.VERCEL_GIT_COMMIT_REF === "redesign/v2-prototype" ? "1" : "";
const flag = process.env.NEXT_PUBLIC_V2_HOME ?? stagingDefault;
const v2Home = flag === "1";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_V2_HOME: flag },
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
