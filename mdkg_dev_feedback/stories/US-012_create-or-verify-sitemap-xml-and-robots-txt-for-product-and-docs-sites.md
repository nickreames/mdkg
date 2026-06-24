# US-012: Create or verify sitemap.xml and robots.txt for product and docs sites


**Priority:** P0
**Theme:** Technical SEO
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/sitemap.xml
- https://mdkg-dev.vercel.app/robots.txt
- https://mdkg-docs.vercel.app/sitemap.xml
- https://mdkg-docs.vercel.app/robots.txt

### Description
The llms.txt references sitemap.xml, but sitemap/robots need explicit verification for production and preview behavior.

### Acceptance criteria
- [ ] Product site has a sitemap for canonical production pages.
- [ ] Docs site has a sitemap or Starlight-generated sitemap for canonical docs pages.
- [ ] robots.txt points to sitemap location on production.
- [ ] Preview robots/noindex policy is implemented and tested.
- [ ] Broken or missing sitemap references fail a launch-readiness check.
