# Release guide: Portfolio V2 as the homepage

Nothing in this file has been executed. It is the checklist for the final step.

## How the two modes work

| | Preview build (default) | Release build |
|---|---|---|
| Env | `NEXT_PUBLIC_V2_HOME` unset | `NEXT_PUBLIC_V2_HOME=1` |
| `/` | legacy homepage | V2 (internal rewrite of `/v2-preview`) |
| Case studies | `/v2-preview/projects/[slug]` | `/projects/[slug]` |
| `/v2-preview...` | served, `noindex`, canonical = itself | 307 redirect to the final URL |
| Sitemap | `/` only | `/` and every published case study |
| Indexing | legacy only | V2 pages `index, follow` |

The flag is read at build time (`src/lib/site.ts`, `next.config.ts`), so changing it means a new build/deploy.
Legacy files (`src/app/(legacy)`, `src/components/*.tsx`) are not modified by the swap.

## Deploy checklist

1. Owner confirms the email, GitHub and LinkedIn URLs (`src/components/v2/contactData.ts`) and the avatar (`public/avt.jpg`) used in structured data.
2. On the release branch: `npm ci && npx eslint src && npx tsc --noEmit`.
3. Set `NEXT_PUBLIC_V2_HOME=1` for the Production environment only (Vercel: Settings, Environment Variables).
4. Deploy a **Preview** first with the flag on, and check: `/`, `/projects/ev-station-management-system`, `/projects/smartinvoice-shield`,
   `/v2-preview` (redirects), `/sitemap.xml`, `/robots.txt`, `/og`, view-source canonical and JSON-LD.
5. Promote to Production. Run the browser regression scripts against the production URL.
6. Submit `https://anhnpn.vercel.app/sitemap.xml` in Search Console and inspect `/` and one case study.
7. Re-check social previews (LinkedIn Post Inspector, X card validator, opengraph.xyz).

## Rollback

* Fast: in Vercel, "Promote" the previous deployment (instant, no build).
* Source: remove `NEXT_PUBLIC_V2_HOME` (or set it to anything but `1`) and redeploy: `/` is the legacy homepage again, V2 is back at `/v2-preview` (noindex).
* The redirects are temporary (307), so browsers do not cache them; nothing needs un-caching on rollback.
* Last resort: `git revert` the release commits. No legacy file was deleted.

## Known limits

* Editing only the `#hash` in the address bar of an open page and then using Back after visiting a case study can show the wrong page until reload (Next router limitation for browser-created history entries). In-page links are not affected.
* Not verified on Safari/iOS or physical devices.
