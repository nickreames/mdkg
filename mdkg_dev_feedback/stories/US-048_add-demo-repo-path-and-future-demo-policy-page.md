# US-048: Add demo repo path and future demo-policy page


**Priority:** P1
**Theme:** Demos / Launch separation
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-docs.vercel.app/project/roadmap/

### Description
Demo deployment is deferred, but the site/docs should define where demo code lives and how future demo-N.mdkg.dev promotion will work so previews do not get mixed into canonical launch.

### Acceptance criteria
- [ ] Docs include a demo deployment/indexing policy page or roadmap entry.
- [ ] Policy states canonical site is mdkg.dev and docs are docs.mdkg.dev.
- [ ] Unpromoted Vercel preview/demo URLs are noindex and not canonical.
- [ ] Future durable demos likely use demo-N.mdkg.dev after review.
- [ ] Demo repo/folder path is identified if available.
