# US-040: Add link checker and fix external/internal broken links


**Priority:** P1
**Theme:** Quality / Navigation
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-docs.vercel.app/

### Description
The site has several external CTAs and future-domain links. A link checker should prevent bad review experiences and failed launch traffic.

### Acceptance criteria
- [ ] Automated link check runs for product site and docs site.
- [ ] Preview docs links point to preview docs or clearly indicate future production domain.
- [ ] GitHub, npm, docs, llms.txt, quickstart, trust, alpha, and edit-page links resolve correctly.
- [ ] Broken external links are either fixed or documented as launch blockers.
- [ ] Future-domain links do not appear as live until DNS is configured.
