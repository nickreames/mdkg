---
id: epic-250
type: epic
title: v0.5.1 release candidate finalization and CI
status: done
priority: 1
tags: [release, v0.5.1, ci, versioning]
owners: []
links: []
artifacts: []
relates: [goal-71, goal-70, edd-77, dec-83]
blocked_by: [goal-70]
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

Produce the approved v0.5.1 release commit and exact-SHA green CI proof.

# Scope

Version/lockfile/changelog finalization, package inspection, full gates, explicit
release approval, push, and CI verification.

# Milestones

- Goal 70 evidence is accepted.
- `task-783` and `test-444` close on the release commit SHA.

# Out of Scope

Npm publication before CI and any Git tag.

# Risks

- Version or changelog drift can invalidate package proof.
- Approval must enumerate every external mutation.

# Links / Artifacts

- `edd-77`
- `dec-83`
- `task-783`
- external links
