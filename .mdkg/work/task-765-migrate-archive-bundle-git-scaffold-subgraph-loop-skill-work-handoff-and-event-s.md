---
id: task-765
type: task
title: Migrate archive bundle Git scaffold subgraph loop skill work handoff and event sinks
status: done
priority: 1
epic: epic-241
tags: [security, remediation, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: [task-763]
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Migrate every remaining repository-controlled filesystem sink to the shared
safe-path authority, preserving each independently reachable command instance.

# Acceptance Criteria

- Close exactly: `cand-review-002-003`, `cand-review-002-004`,
  `cand-review-002-005`, `cand-review-002-006`, `cand-review-005-003`,
  `cand-review-005-004`, `cand-review-005-006`, `cand-review-004-001`,
  `review-003-cand-003`, `review-003-cand-004`, `review-003-cand-005`,
  `review-003-cand-006`, `review-003-cand-008`, `cand-review-010-004`,
  `cand-review-012-001`, `cand-review-012-002`, `cand-review-012-003`,
  `cand-review-012-004`, `cand-review-011-001`, and `cand-review-011-002`.
- Validate imported IDs before path construction and recheck destinations at
  apply time.
- Archive/bundle/Git/scaffold/subgraph/loop/skill/work/handoff/event operations
  reject linked ancestors and outside canonical targets before side effects.
- Read-path findings do not expose external template, skill, event, or node body
  content.
- Each of the 20 IDs has its own regression assertion.

# Files Affected

List files/directories expected to change.

- Archive, bundle, graph import, subgraph, init, upgrade, and fix commands
- Git clone/closeout, handoff, loop, skill, work/task/new/event commands
- Template loader, archive cache, atomic write, and mutation helpers
- Focused command/smoke fixtures

# Implementation Notes

- Keep intentional user-selected `--out` behavior separate from repository-
  derived destinations.
- Validate full multi-file plans before the first write and preserve fail-closed
  cleanup behavior.
- Do not merge sibling IDs in `task-774` merely because the shared fix is common.

# Test Plan

Run each real command against fresh linked-source, linked-destination, and missing-
target fixtures. Assert no external reads/writes/events, then run archive, bundle,
subgraph, upgrade, Git, loop, visibility, and work-invocation smokes plus
`test-425` and `test-426`.

# Links / Artifacts

- `task-763`, `epic-241`
- `test-425`, `test-426`
- Finding IDs listed in Acceptance Criteria
