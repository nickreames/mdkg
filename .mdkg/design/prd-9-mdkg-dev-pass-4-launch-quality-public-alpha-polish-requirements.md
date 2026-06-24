---
id: prd-9
type: prd
title: mdkg.dev pass 4 launch-quality public-alpha polish requirements
tags: [mdkg-dev, public-alpha, launch-quality]
owners: []
links: []
artifacts: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
relates: [goal-34]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
aliases: []
created: 2026-06-24
updated: 2026-06-24
---
# Problem

The mdkg.dev previews are credible but not yet launch-quality for cold traffic. The latest audit rates the combined marketing/docs experience around 7.3/10 and identifies remaining trust gaps in presentation quality, command precision, docs ergonomics, accessibility, performance proof, and deterministic first-success paths.

# Goals

- Make the homepage skimmable, less repetitive, and centered on the thesis that project memory is different from larger chat context.
- Make docs user-first, route humans and agents clearly, and remove maintainer-facing scaffolding from beginner paths.
- Validate public command examples and make code blocks copy-safe.
- Provide a deterministic demo/first-success path with expected outputs.
- Add measured accessibility, responsive, reduced-motion, high-contrast, and performance gates.
- Validate local and hosted previews through Browser, Chrome, Product Design, Creative Production, and Vercel evidence.

# Non-goals

- DNS cutover, production promotion, analytics activation, npm publish, git tag, GitHub settings mutation, and public launch announcement.
- Generated image/video production as a required deliverable.
- Replacing Starlight or changing hosting architecture.

# Requirements

## Functional

- Fix `llms.txt` line wrapping and add the canonical agent path.
- Remove duplicated docs TOC output and improve heading structure.
- Add command-example validation against help/command-contract data.
- Add a deterministic demo graph or documented fixture with expected command outputs.
- Expand generated CLI reference into a user-facing docs surface while keeping command contract maintainer-facing.
- Add common-mistakes and valid frontmatter examples to core docs.

## Non-functional

- Mobile first fold must communicate mdkg, value prop, and next action without horizontal overflow.
- Key pages must have no critical a11y issues, logical focus order, visible focus rings, and reduced-motion handling.
- Performance checks must record LCP/TBT-or-INP proxy/CLS and bundle-weight budgets where feasible.
- Preview deployments remain noindex; production indexing remains a later explicit launch action.

# Acceptance Criteria

- All scoped goal-34 tasks/tests are complete with checkpoint evidence.
- Browser/Chrome local QA covers desktop, tablet, and mobile.
- Product Design audit records screenshot-backed UX/a11y findings and remediation evidence.
- Creative Production records visual hierarchy, diagram, and copy-direction evidence without requiring generated assets.
- Vercel preview deployments are live, logs are reviewed, and hosted pages match local proof.

# Metrics / Success

- Combined preview quality is ready for another external audit with expected score above 8/10.
- New docs/site smokes catch command drift, broken formatting, duplicated TOC, metadata/noindex drift, and major a11y/performance regressions.
- A new user can complete a deterministic first-success path in under 10 minutes.

# Risks

- Scope creep into production launch chores.
- Over-optimizing for audit language instead of real first-user comprehension.
- Adding brittle checks that make docs iteration painful.

# Open Questions

- Whether generated visual/image assets should become a separate post-pass-4 goal after the CSS/HTML diagram is proven.
