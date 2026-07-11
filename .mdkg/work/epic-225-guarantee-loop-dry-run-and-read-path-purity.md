---
id: epic-225
type: epic
title: Guarantee loop dry run and read path purity
status: todo
priority: 1
tags: [loop, hardening, dry-run, persistence]
owners: []
links: []
artifacts: []
relates: [goal-61]
blocked_by: []
blocks: []
refs: [task-702, task-703, test-375, test-376]
context_refs: [goal-61, edd-70, dec-67]
evidence_refs: []
aliases: [loop-observational-command-purity]
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Goal

Make every loop dry-run and descriptor-declared read command observational
across SQLite, JSON compatibility indexes, event logs, and repository files.

# Scope

- Non-reserving preview allocation for `loop fork --dry-run`.
- Non-persisting index projection for loop list/show/plan/runs/next.
- State-snapshot tests across SQLite and JSON backends.

# Milestones

- `task-702` / `test-375`: fork dry-run purity.
- `task-703` / `test-376`: read-path purity.

# Out of Scope

Generic read-path redesign beyond the minimum reusable core needed by the loop
descriptor pilot.

# Risks

- Preview IDs can race; they must be documented as tentative.
- In-memory rebuilds can diverge from persisted index behavior without parity tests.

# Links / Artifacts

- `edd-70`
- `dec-67`
- external links
