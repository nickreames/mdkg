---
id: task-354
type: task
title: design mdkg.dev IA from generated command contract and spike findings
status: todo
priority: 2
epic: epic-78
parent: goal-15
tags: [mdkg-dev, information-architecture, command-contract, spike-dogfood]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-351]
blocks: [task-355, task-356, task-357, task-358, task-359, task-370]
refs: [spike-1, spike-2, spike-3, spike-4, spike-5]
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Design the mdkg.dev information architecture from generated command metadata and
first-class spike findings. This is the first launch-planning task after spike
support exists, and it must keep the site grounded in verified CLI behavior
rather than marketing-only copy.

# Acceptance Criteria

- Inventory the generated command contract, command matrix, README, and spike
  findings that should shape mdkg.dev.
- Propose a page map for command reference, outcome guides, examples, security
  posture, and downstream adoption narratives.
- Identify which pages are generated, which are hand-authored, and which require
  temp-repo proof before publication.
- Preserve release boundaries: no worker execution docs, no public internal DB
  event/reducer/lease/materializer CLI docs, and no unverified automation claims.

# Files Affected

- Future docs planning nodes and mdkg.dev design notes.
- Generated command contract and docs-readiness references, once implementation
  begins.

# Implementation Notes

- Start from a spike, not from a static sitemap.
- Treat generated command metadata as canonical for flags, mutation policy,
  dry-run support, JSON support, receipts, and danger level.
- Capture unresolved questions as follow-up mdkg tasks or spikes instead of
  hiding uncertainty in prose.

# Test Plan

- Run `npm run cli:contract` and `npm run smoke:command-docs`.
- Create or reference spike evidence explaining why each top-level section
  exists.
- Validate mdkg graph state with `node dist/cli.js validate --json`.

# Links / Artifacts

- Blocks `task-355`, `task-356`, `task-357`, `task-358`, and `task-359`.
- Spike evidence: `spike-1`, `spike-2`, `spike-3`, `spike-4`, `spike-5`.
- Evidence-matrix follow-up: `task-370`.
