---
id: epic-128
type: epic
title: mdkg.dev local Browser E2E and visual QA
status: todo
priority: 1
tags: [mdkg-dev, browser-e2e, visual-qa]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [edd-28, edd-29, edd-30]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Goal

Validate mdkg-dev through real local Browser E2E at desktop and mobile viewport sizes, including visual QA, route navigation, crawlability, metadata, and LLM-doc surfaces.

# Scope

- Build mdkg-dev.
- Serve the local static preview on loopback only.
- Visit `/`, `/quickstart/`, `/trust/`, `/alpha/`, `/docs/`, `/llms.txt`, `/llms-full.txt`, `/robots.txt`, and `/sitemap.xml`.
- Test at least `1440x900` and `390x844`.
- Capture screenshots for homepage, quickstart, trust, docs, and one mobile view.
- Assert no console errors, broken local navigation, obvious overflow, incoherent overlaps, unreadable code blocks, or missing first-viewport product signal.

# Milestones

- `task-458` records Browser E2E execution.
- `task-459` records route, metadata, no-secret, and demo-discoverability proof.
- `test-208` and `test-209` capture the visual/navigation and SEO/LLM contracts.

# Out of Scope

- Clicking external links.
- Transmitting data.
- Public launch or hosted preview deploy.

# Risks

- Static source smokes may pass while the rendered local page has visual or metadata regressions.
- Browser screenshots must be reviewed before archive to avoid storing accidental raw marker content.

# Links / Artifacts

- goal-25
- edd-28
- edd-29
- edd-30
