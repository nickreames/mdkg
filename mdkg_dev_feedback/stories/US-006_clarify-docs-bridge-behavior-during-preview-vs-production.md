# US-006: Clarify docs bridge behavior during preview vs production


**Priority:** P0
**Theme:** Navigation / Docs integration
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/docs/

### Description
The product-site docs bridge says docs.mdkg.dev, but the live preview docs are currently at the Vercel preview URL. For preview review, the CTA should not mislead reviewers or send them to a domain that is not configured yet.

### Acceptance criteria
- [ ] In preview deployments, the docs CTA links to the live docs preview or clearly says docs.mdkg.dev is the intended production domain.
- [ ] In production, the docs CTA links to `docs.mdkg.dev`.
- [ ] No public page implies docs.mdkg.dev is live until DNS/custom domain is actually configured.
- [ ] The docs bridge explains repo-first docs ownership in one concise paragraph.
