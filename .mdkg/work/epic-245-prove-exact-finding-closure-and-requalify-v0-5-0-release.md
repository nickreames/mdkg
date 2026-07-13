---
id: epic-245
type: epic
title: Prove exact finding closure and requalify v0.5.0 release
status: todo
priority: 1
tags: [security, remediation, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: []
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-12
updated: 2026-07-12
---
# Goal

Prove that all 51 findings are closed without regressions and hand a clean,
immutable, fully tested release candidate back to Goal 64.

# Scope

- Exact finding-to-task-to-test matrix with no missing or duplicate IDs.
- Full local, packaged, docs, site, graph, DB, loop, and compatibility ladder.
- Fresh immutable-revision repository scan with zero release blockers.
- Goal 64/test-389 blocker-clear handoff receipt.

# Milestones

- `task-774`: exact matrix and targeted regression suite.
- `task-775`: complete local/package verification.
- `task-776`: clean rescan and release requalification.
- `test-433` and `test-434`: compatibility and clean security proof.

# Out of Scope

- Push, npm publish, global replacement, release activation, deployment, and tag
  creation; Goal 64 owns those effects after this epic closes.

# Risks

- Aggregate green tests can hide an unmapped independent sink.
- A clean worktree at a different revision is not valid rescan evidence.
- Classifier/reporting limitations must not be mistaken for finding suppression.

# Links / Artifacts

- `goal-69`, `goal-64`, `test-389`
- `task-774` through `task-776`
- `test-433`, `test-434`
