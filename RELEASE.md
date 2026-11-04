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

## Production cutover (E2): staged release, then manual promote

Facts this plan relies on (Vercel docs, "Promoting Deployments" and "Instant Rollback"):
* Merging to the production branch (`main`) normally deploys AND assigns the domain automatically.
* With Settings > Environments > Production > Branch Tracking > **Auto-assign Custom Production Domains** turned off, a merge builds a *Staged* production
  deployment that does not serve traffic until you **Promote** it (no rebuild).
* **Hobby Instant Rollback only reaches the immediately previous Production deployment.** After any Instant Rollback Vercel turns auto-assign off; "Undo Rollback" restores it.

Identity
* Production branch: `main`. Merge base is the current `main` tip `7652a5e`, so the PR is a clean fast-forward-able stack of 18 commits.
* Currently serving (rollback target): `portfolio-4uh36lsff-nhatanh-devs-projects.vercel.app`, commit `7652a5e` (GitHub deployment 6050742577).
* Published projects: exactly two (`ev-station-management-system`, `smartinvoice-shield`). Drafts: `flood-route`, `fcaj-workshop` (404, not built).

Steps
1. **Before anything else, merge nothing else to `main`.** The rollback target must stay the legacy deployment, so no other Production deployment may be created between now and promotion.
2. Settings > Environments > Production > Branch Tracking: turn **Auto-assign Custom Production Domains OFF** and save. If the toggle is not there, stop: the flow becomes
   "merge = live"; decide explicitly before continuing.
3. Settings > Environment Variables: add `NEXT_PUBLIC_V2_HOME` = `1`, environment **Production only** (Preview and Development unchecked).
4. Merge the PR (merge commit or squash). Vercel builds a **Staged** production deployment; the live domain still serves the legacy site.
5. Open the staged deployment (Deployments > the new Production row > Visit; it is protected, so use your Vercel login or a Share link) and verify: `/` V2 title,
   `robots` meta `index, follow`, **no** `X-Robots-Tag: noindex`, canonical `https://anhnpn.vercel.app`; `/projects/ev-station-management-system` and
   `/projects/smartinvoice-shield` 200; `/projects/flood-route` 404; `/v2-preview` 307; `/sitemap.xml` 3 URLs; `/robots.txt`; `/og` PNG; console clean.
6. Promote: row menu (...) > **Promote** > confirm. The deployment becomes **Current**. Domain switches instantly.
7. On `https://anhnpn.vercel.app` (hard refresh): repeat step 5 on the live domain, then deep links (`/#works`, `/#credentials`, `/#contact`), nav and dock, mobile menu,
   Back/Forward through a case study, contact links, one certificate verify link, reduced motion, 390px and 1440px layouts.
8. Settings: turn **Auto-assign Custom Production Domains back ON** (otherwise future merges stay staged).
9. Search Console: submit `https://anhnpn.vercel.app/sitemap.xml`; inspect `/` and one case study. Re-scrape social previews (LinkedIn Post Inspector, X, opengraph.xyz).

## Rollback

* Any release-blocking problem: project Overview > Production tile > **Instant Rollback** > the previous deployment (`portfolio-4uh36lsff`, `7652a5e`) > Confirm. Instant, no build.
  Then **Undo Rollback** only when a fixed deployment is ready (auto-assign stays off until then).
* If step 6 has not happened yet, there is nothing to roll back: just do not promote; delete or ignore the staged deployment.
* Source rollback afterwards: `git revert` the merge commit on `main` (or remove `NEXT_PUBLIC_V2_HOME` from Production) and redeploy.
* The redirects are 307, so browsers do not cache them. No legacy file was deleted by any step. After a rollback, resubmit the sitemap.

## Known limits

* Editing only the `#hash` in the address bar of an open page and then using Back after visiting a case study can show the wrong page until reload (Next router
  limitation for browser-created history entries). In-page links are not affected.
* Not verified on Safari/iOS or physical devices.
* Mobile LCP under emulated 4x CPU and fast 4G is about 3.4s (the hero text animates in); about 0.9-1.3s unthrottled.
