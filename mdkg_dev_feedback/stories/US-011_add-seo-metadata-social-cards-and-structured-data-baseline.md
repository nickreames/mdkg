# US-011: Add SEO metadata, social cards, and structured data baseline


**Priority:** P0
**Theme:** SEO / Sharing
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-dev.vercel.app/quickstart/
- https://mdkg-dev.vercel.app/trust/
- https://mdkg-dev.vercel.app/alpha/

### Description
The content is strong enough to share soon, but launch pages need page-specific metadata, Open Graph/X cards, canonical URLs, and basic structured data so links render professionally and search engines understand the product.

### Acceptance criteria
- [ ] Every public page has title, description, canonical URL, Open Graph title/description/image, and X card metadata.
- [ ] Default OG image exists and matches the mdkg design system.
- [ ] Homepage includes SoftwareApplication JSON-LD if accurate and not overclaimed.
- [ ] Docs/quickstart pages include page-specific descriptions rather than duplicated generic metadata.
- [ ] Metadata respects preview noindex vs production index policy.

### Suggested copy / implementation notes
Homepage meta description draft:

> Markdown Knowledge Graph is git-native project memory for AI-native software engineering. Turn structured Markdown in your repo into deterministic context packs, goals, checkpoints, skills, and handoffs for humans and AI agents.
