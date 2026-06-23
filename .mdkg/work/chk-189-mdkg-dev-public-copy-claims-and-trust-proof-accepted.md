---
id: chk-189
type: checkpoint
title: mdkg.dev public copy claims and trust proof accepted
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-449]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [goal-25, task-449, prd-4, prd-5, edd-25, edd-27, edd-29, edd-30, dec-30]
evidence_refs: []
aliases: []
skills: []
scope: [task-449]
created: 2026-06-22
updated: 2026-06-22
---
# Summary

The mdkg.dev public-alpha copy and trust surface are now scaffolded as static repo-owned content. The site has a homepage, quickstart, trust, alpha, docs entrypoint, social metadata, structured data, sitemap, robots file, `llms.txt`, and `llms-full.txt`. The public claims are backed by a local claims matrix and softened where implementation evidence is still pending.

# Scope Covered

- task-449: public-alpha homepage, quickstart, safety/origin framing, and LLM-oriented content.

## Changed Surfaces

- `mdkg-dev/src/pages/index.astro`
- `mdkg-dev/src/pages/quickstart.astro`
- `mdkg-dev/src/pages/trust.astro`
- `mdkg-dev/src/pages/alpha.astro`
- `mdkg-dev/src/pages/docs.astro`
- `mdkg-dev/src/pages/llms.txt.ts`
- `mdkg-dev/src/pages/llms-full.txt.ts`
- `mdkg-dev/src/pages/robots.txt.ts`
- `mdkg-dev/src/pages/sitemap.xml.ts`
- `mdkg-dev/src/layouts/BaseLayout.astro`
- `mdkg-dev/public/social-card.svg`
- `mdkg-dev/CLAIMS.md`
- `docs/project/claims-evidence-matrix.md`
- `docs/SUMMARY.md`
- `.mdkg/work/task-449-*`
- `.mdkg/work/chk-189-*`

## Boundaries

- in scope: static public copy, claims evidence, alpha/safety boundaries, SEO/LLM metadata scaffolding.
- out of scope: final visual polish, analytics activation, deploy, DNS, public launch, website subgraph registration, examples, and full launch-smoke automation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- dec-30: the canonical mdkg.dev source lives in this repo with split `/mdkg-dev`, `/docs`, and `/examples` layout.
- edd-29: public claims and SEO metadata must be evidence-backed and conservative.
- edd-30: quality gates must check safety, accessibility, performance, links, and metadata before launch.

# Implementation Summary

The site copy now presents mdkg as Git-native project memory for AI-native software engineering. It emphasizes durable graph state, agent handoffs, validation before closeout, and alpha boundaries. The site includes a static social card, Open Graph/Twitter metadata, JSON-LD on the homepage, robots/sitemap routes, and LLM-oriented summaries. The claims matrix records which public claims are backed by shipped CLI capabilities and which claims remain alpha or aspirational.

# Implementation Details

- Code or graph surfaces changed: Astro static pages, generated text endpoints, public claim docs, graph task/checkpoint evidence.
- Architecture or data-shape notes: metadata is supplied through `BaseLayout.astro`; homepage structured data uses a `SoftwareApplication` JSON-LD object; `llms-full.txt` is generated from curated static content, not raw graph dumps.
- Compatibility notes: no root package publish contents changed beyond existing `.npmignore` exclusions; `mdkg-dev` remains an isolated private site package.

# Verification / Testing

## Command Evidence

- command: `npm --prefix mdkg-dev run build`
  result: passed; static routes generated for `/`, `/quickstart`, `/trust`, `/alpha`, `/docs`, `/llms.txt`, `/llms-full.txt`, `/robots.txt`, and `/sitemap.xml`.
- command: `find mdkg-dev/dist -maxdepth 3 -type f -print | sort`
  result: confirmed built files include static pages, `favicon.svg`, `social-card.svg`, robots, sitemap, and LLM text files.
- command: `rg -n "/Users/nick|PRIVATE KEY|AKIA|BEGIN RSA|npm_[A-Za-z0-9]" docs mdkg-dev/src mdkg-dev/DESIGN.md mdkg-dev/public mdkg-dev/CLAIMS.md scripts/generate-docs-reference.js`
  result: no matches.

## Pass / Fail Status

- status: pass for public-alpha copy and trust proof.

## Known Warnings

- warning: task-452 still owns full launch-smoke automation, including formal link, metadata, accessibility, sitemap, and no-secret checks.

# Known Issues / Follow-ups

- task-450 and task-451 must create demo/template graphs and root subgraph registration.
- task-452 must convert these manual checks into reusable smokes.
- Public origin/founder material remains intentionally minimal until the user supplies final copy/assets.

## Follow-up Refs

- task-450
- task-451
- task-452
- test-202

# Links / Artifacts

- site package: `mdkg-dev/`
- built route output: `mdkg-dev/dist/`
- claims matrix: `docs/project/claims-evidence-matrix.md`
- static claim evidence: `mdkg-dev/CLAIMS.md`

# Raw Content Safety

- Evidence is summarized with command receipts and artifact paths. No raw secrets, raw prompts, provider payloads, private graph dumps, local absolute paths, or bulky execution traces were stored.
