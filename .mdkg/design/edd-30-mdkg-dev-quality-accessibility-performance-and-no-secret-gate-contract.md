---
tags: [mdkg-dev, quality, accessibility, performance, no-secret]
owners: []
links: [https://web.dev/articles/vitals]
artifacts: [mdkg_planning_docs.zip]
relates: [prd-5, edd-24, edd-25]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
aliases: [mdkg-dev-quality-gate-contract]
created: 2026-06-22
updated: 2026-06-22
id: edd-30
type: edd
title: mdkg.dev quality accessibility performance and no-secret gate contract
---
# Overview

Goal-25 must prove mdkg.dev is usable, readable, safe to inspect, and launch-ready before any public deployment or launch step is requested.

# Architecture

- Quality gates run as local smokes where possible.
- Manual launch checks are documented when local automation is not practical.
- No-secret checks cover site, docs, examples, and generated outputs.

# Data model

- Route inventory records path, title, indexability, metadata status, and static render status.
- Quality receipts record accessibility, performance, link, metadata, and no-secret results.
- Manual follow-up records identify launch checks that require hosted preview or production context.

# APIs / interfaces

- `smoke:mdkg-dev` verifies static site readiness.
- `smoke:mdkg-dev-docs` verifies docs source and generated-reference readiness.
- `smoke:mdkg-dev-seo` verifies SEO and metadata readiness.
- `smoke:demo-graph` verifies example graph readiness.

# Accessibility Contract

- One H1 per page.
- Semantic headings and landmarks.
- Keyboard navigable navigation and controls.
- Visible focus states.
- Accessible names for buttons and links.
- Useful alt text for content images or empty alt text for decorative images.
- Code blocks are readable and do not overflow common mobile widths.
- Color contrast is acceptable.
- Reduced-motion is respected when motion exists.
- No information is conveyed only by color.

# Performance Contract

- Public content renders as static HTML.
- JavaScript is minimal and limited to useful islands.
- No heavy animation, broad client-only rendering, or blocking third-party scripts.
- Images and social assets are optimized.
- Layout shift is avoided.
- Core Web Vitals targets: LCP at or under 2.5 seconds, INP at or under 200 ms, CLS at or under 0.1 where measurable.

# Safety Contract

- No raw secrets, tokens, private keys, provider payloads, raw prompts, private graph dumps, local absolute path leaks, or unpublished internal notes in site/docs/examples/generated outputs.
- Public pages state that mdkg is not a secret scanner, hosted memory service, autonomous runtime, vector database, or guarantee of agent correctness.
- Visibility filtering and handoff raw-marker warnings are documented as safety aids, not comprehensive data-loss prevention.

# Failure modes

- Static site builds but public pages are not accessible or indexable.
- Generated docs include stale command output.
- No-secret scans miss generated outputs or example graphs.
- Launch closeout implies deployment even though only local readiness was proven.

# Observability

- Smokes should emit bounded summaries with route counts, docs counts, warning counts, and failing paths.
- Final checkpoint should include exact commands, pass/fail status, known warnings, and manual launch follow-ups.

# Security / privacy

- No raw secrets, provider payloads, raw prompts, private graph dumps, or local absolute paths in public output.
- No production analytics, deployment, DNS, or GitBook configuration without explicit launch approval.

# Smoke Contract

Goal-25 must add or wire smokes that cover:

- Site build/static render.
- Link checks.
- Metadata/sitemap/robots checks.
- No-secret scan across site, docs, examples, and generated outputs.
- Mobile/code-block layout proof.
- Accessibility baseline checks practical for local CI.

# Failure Modes

- Launch copy passes content review but fails basic accessibility or mobile usability.
- Generated docs leak private local paths or repo-only evidence.
- Site can build but no smoke proves sitemap, metadata, or no-secret policy.

# Testing Strategy

- `smoke:mdkg-dev` for static build and route inventory.
- `smoke:mdkg-dev-docs` for GitBook docs source and generated reference drift.
- `smoke:mdkg-dev-seo` for metadata, sitemap, robots, and canonical/noindex policy.
- `smoke:demo-graph` for examples and subgraph proof.

# Rollout plan

- Add local deterministic smokes before closeout.
- Document manual hosted checks separately.
- Keep public launch blocked until a later explicit request.

# Links / references

- goal-25
- task-452
- test-200
- test-202
- test-205
- archive://archive.mdkg-dev-planning-docs-2026-06-22
