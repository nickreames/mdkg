---
tags: [mdkg-dev, public-alpha, prelaunch, polish]
owners: []
links: []
artifacts: [mdkg_planning_docs.zip]
relates: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
aliases: []
created: 2026-06-22
updated: 2026-06-22
id: prd-5
type: prd
title: mdkg public alpha polish and prelaunch requirements
---
# Problem

Before public alpha, mdkg needs launch polish that protects trust: docs must be accurate, examples executable, safety boundaries explicit, generated command references current, and no-secret checks credible.

# Goals

- Define the minimum prelaunch bar for public docs and demos.
- Make launch readiness measurable with smoke tests, generated docs checks, no-secret scans, and link/version checks.
- Keep public alpha scoped to shipped local CLI capabilities.

# Non-goals

- Do not require full downstream repo migration automation.
- Do not require public worker execution or full public DB event/reducer/lease/materializer CLI.
- Do not require production deployment during pre-release proof.

# Requirements

- Every public guide example is either executable in a temp repo or marked conceptual.
- Generated command docs are derived from command contract and checked for drift.
- No-secret scans cover site/docs/examples and generated outputs.
- Sitemap, metadata, version labels, and link checks pass before launch.

# Acceptance Criteria

- Goal 2 has tests for static rendering, docs drift, no-secret content, demo graph import, subgraph registration, and full launch-readiness smoke.
- Public alpha launch is blocked until those tests pass.

# Metrics / Success

- Zero known private tokens, raw prompts, or provider payloads in public output.
- Generated command docs match the package being documented.
- Demo/template graphs validate and import.

# Risks

- No-secret scanning is not comprehensive secret management and must not be marketed as such.
- Docs generation could drift if command metadata changes without smoke coverage.

# Open Questions

- What exact deploy provider and preview workflow should be used after pre-release readiness?
