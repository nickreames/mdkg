---
id: epic-236
type: epic
title: Shared v0.5.0 release-state foundation
status: todo
priority: 1
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: []
blocks: []
refs: [task-730, task-731, task-732, test-401, test-402, edd-71, dec-68, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-61, goal-62, goal-63, goal-64, edd-71, dec-73, dec-74, prd-11, prop-8]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-11
updated: 2026-07-11
---
# Goal

Give both Astro sites one strict, source-controlled projection of the v0.5.0
release state so Goal 63 can implement and preview the release without exposing
it before Goal 64 verifies npm.

# Scope

- Root `release/public-release.json` schema and `draft` default.
- Shared validation and visibility helpers for mdkg.dev and docs.mdkg.dev.
- Fail-closed production override and published/package-version parity.
- Marketing and docs gates for routes, navigation, search, metadata, sitemap,
  Pagefind, LLM output, robots, and structured version claims.

# Milestones

- `task-730` / `test-401`: strict manifest and immutable projection.
- `task-731`, `task-732` / `test-402`: no dormant public output from either
  site.

# Out of Scope

General release-management frameworks, package version changes, publication,
deployment, and changing the manifest to `published`.

# Risks

- Separate site flags can drift; both sites must consume one root contract.
- A hidden route can still leak through metadata, search, sitemap, or LLM files.

# Links / Artifacts

- `dec-74`
- `prop-8`
- `goal-64`
