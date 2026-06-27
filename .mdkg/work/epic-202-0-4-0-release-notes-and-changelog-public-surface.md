---
id: epic-202
type: epic
title: 0.4.0 release notes and changelog public surface
status: todo
priority: 2
tags: [0.4.0, release-notes, changelog, docs]
owners: []
links: []
artifacts: [CHANGELOG.md, docs, mdkg-dev]
relates: []
blocked_by: []
blocks: [spike-22, task-601, test-307]
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-26
updated: 2026-06-26
---
# Goal

Expose release notes and changelog history as a public docs/site surface with
per-release cards and details.

# Scope

- Release-notes IA research.
- Changelog-derived public page implementation.
- Drift contract tying public release notes back to `CHANGELOG.md`.

# Milestones

- `spike-22`: release notes IA and article support research.
- `task-601`: public page implementation.
- `test-307`: changelog consistency contract.

# Out of Scope

- CLI behavior changes.

# Risks

- Public release cards can diverge from `CHANGELOG.md`.
- Release claims can overstate unpublished or unverified behavior.

# Links / Artifacts

- `goal-42`
- `edd-57`
