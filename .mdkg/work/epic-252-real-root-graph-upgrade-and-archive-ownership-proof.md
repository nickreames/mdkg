---
id: epic-252
type: epic
title: Real root graph upgrade and archive ownership proof
status: done
priority: 1
tags: [release, upgrade, root-graph, archive]
owners: []
links: []
artifacts: []
relates: [goal-71, edd-77, dec-83]
blocked_by: [epic-251]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-15
---
# Goal

Prove the published global binary safely compresses only locally owned archives
in the real mixed root graph.

# Scope

Operator classification, before/after hashes and Git state, global replacement,
real `--all --json`, graph validation, and explicit no-touch assertions.

# Milestones

- `task-785` captures an approved baseline.
- `task-786` and `test-447` prove the corrected mutation boundary.

# Out of Scope

Deleting/staging unrelated state, syncing bundles, or mutating child repos.

# Risks

- Existing unrelated untracked directories require explicit classification.
- Stale subgraph warnings must not be confused with mutation.

# Links / Artifacts

- `task-785`
- `task-786`
- `test-446`
- `test-447`
- external links
