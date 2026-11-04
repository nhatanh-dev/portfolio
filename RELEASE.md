# Release guide: Portfolio V2 as the homepage

Phase E1 (staging) is deployed; Phase E2 (production cutover) has NOT been executed. Nothing here has touched the production domain.

## How the two modes work

| | Preview mode (flag off) | Release mode (flag on) |
|---|---|---|
| `/` | legacy homepage | V2 (internal rewrite of `/v2-preview`) |
| Case studies | `/v2-preview/projects/[slug]` | `/projects/[slug]` |
| `/v2-preview...` | served, `noindex`, canonical = itself | 307 redirect to the final URL |
| Sitemap | `/` only | `/` and every published case study |
| Indexing | legacy only | V2 pages `index, follow` |

`NEXT_PUBLIC_V2_HOME` is read **at build time** by `next.config.ts` (rewrites/redirects) and inlined into the bundle (`src/lib/site.ts`:
canonicals, sitemap, links). Changing it means a new build. Each Vercel environment builds separately and evaluates it on its own:

| Build | Result |
|---|---|
| Production, variable unset | legacy `/` (flag off) |
| Production, `NEXT_PUBLIC_V2_HOME=1` | V2 at `/` |
| Preview of any branch except `redesign/v2-prototype`, variable unset | legacy `/` |
| Preview of `redesign/v2-prototype`, variable unset | V2 at `/` (staging default, only when `VERCEL_ENV=preview`) |
| Preview of `redesign/v2-prototype` with `NEXT_PUBLIC_V2_HOME=0` | legacy `/` |

All five rows were built and checked locally with the matching `VERCEL_ENV` / `VERCEL_GIT_COMMIT_REF` values. The staging default can never
apply to Production: Production only goes to V2 when the variable is set to `1` in the Production environment.

## Staging (E1) deployment

* Branch `redesign/v2-prototype`, commit `fa36a84`, Vercel environment **Preview** (GitHub deployment id 7541969719).
* Preview URL: `https://portfolio-ieo7svao9-nhatanh-devs-projects.vercel.app`
* Preview deployments are behind Vercel Authentication (HTTP 302 to the Vercel SSO), with `X-Robots-Tag: noindex`. To test them from outside a Vercel login, use a
  Shareable Link (Deployment page, Share) or a Protection Bypass for Automation secret.
* The production domain was not touched: `https://anhnpn.vercel.app` still serves the legacy build (same cache age and content, `robots.txt`/`sitemap.xml` 404).

## Production cutover checklist (E2, requires explicit approval)

Identity before you start
* Current production deployment (rollback target): `https://portfolio-4uh36lsff-nhatanh-devs-projects.vercel.app`, from commit `7652a5e` on `main`
  (GitHub deployment 6050742577). Confirm in Vercel > Deployments that it is listed as "Current" and still available.
* Production branch: `main` (every earlier Production deployment came from `main`). Confirm in Settings > Git.
* Release candidate: the commit that will be merged. It must equal the staged commit (`fa36a84` or a later commit that was re-staged).

Steps
1. Owner confirms: email, GitHub and LinkedIn URLs (`src/components/v2/contactData.ts`), avatar `public/avt.jpg` (structured data), and that no private
   project information is exposed.
2. Staging sign-off: the full browser checklist below passes on the Preview URL (E1), including OG/canonical/sitemap/robots/header checks.
3. Vercel > Settings > Environment Variables: add `NEXT_PUBLIC_V2_HOME` = `1`, scope **Production only**. Verify Preview and Development are unchecked.
   Do not rely on Preview and Production sharing values.
4. Open a PR `redesign/v2-prototype` into `main`; the PR's Preview build must be green.
5. Merge (this starts the Production build with the flag on). While it builds, current production keeps serving.
6. Open the new deployment's own URL first (Deployments > the new one > Visit) and run the checks below. The domain switches to it automatically when the
   build is ready; if you want a manual gate, turn off "Auto-assign Custom Production Domains" (Settings > Domains) before merging and promote by hand.
7. On `https://anhnpn.vercel.app`:
   * `/` is V2 (title "Nguyen Pham Nhat Anh (Alvin Nguyen) | Backend & Cloud Developer"), canonical `https://anhnpn.vercel.app`, `robots` meta `index, follow`
     and **no** `X-Robots-Tag: noindex` header (that header must only exist on Preview URLs).
   * `/projects/ev-station-management-system` and `/projects/smartinvoice-shield` return 200; `/projects/flood-route` returns 404.
   * `/v2-preview` and `/v2-preview/projects/...` return 307 to the final URLs.
   * `/sitemap.xml` lists exactly 3 URLs; `/robots.txt` points to it; `/og` returns a 1200x630 PNG; `/opengraph-image` still 200.
   * Deep links `/#works`, `/#credentials`, `/#contact`; nav, dock, mobile menu; Back/Forward through a case study; contact links.
   * Browser console clean; no missing images; certificate verify links open.
8. Search Console: submit the sitemap; URL-inspect `/` and one case study. Re-check social previews (LinkedIn Post Inspector, X, opengraph.xyz); they cache, so use the debuggers' re-scrape.

## Rollback

* Instant (no build): Vercel > Deployments > `portfolio-4uh36lsff` (commit `7652a5e`) > "Instant Rollback" / "Promote to Production". The legacy homepage is back immediately.
* Source rollback: remove `NEXT_PUBLIC_V2_HOME` from Production and redeploy (or revert the merge commit). `/` is the legacy homepage again; V2 returns to noindex `/v2-preview`.
* The redirects are temporary (307), so browsers do not cache them. No legacy file was deleted by any release step.
* If the sitemap was submitted, resubmit after a rollback so Search Console re-reads it.

## Known limits

* Editing only the `#hash` in the address bar of an open page and then using Back after visiting a case study can show the wrong page until reload (Next router
  limitation for browser-created history entries). In-page links are not affected.
* Not verified on Safari/iOS or physical devices.
* Mobile LCP under emulated 4x CPU and fast 4G is about 3.4s (the hero text animates in); about 0.9-1.3s unthrottled.
