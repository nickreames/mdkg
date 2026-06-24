# US-010: Make production/preview indexing policy explicit


**Priority:** P0
**Theme:** SEO / Deployment safety
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-docs.vercel.app/

### Description
The Vercel preview URLs are review surfaces. The future production domains should be indexable; preview URLs and unpromoted demo URLs should be noindex. This prevents duplicate or stale preview content from polluting SEO before mdkg.dev is ready.

### Acceptance criteria
- [ ] Preview deployments include `noindex,nofollow` or equivalent unless intentionally promoted.
- [ ] Production `mdkg.dev` allows indexing for homepage, quickstart, trust, alpha, docs bridge, and llms.txt as appropriate.
- [ ] Production `docs.mdkg.dev` allows indexing for stable docs pages.
- [ ] Unpromoted demo/preview URLs are noindex by default.
- [ ] Sitemap includes only canonical production pages.
- [ ] Canonical URLs point to production domains only when those domains are live.
