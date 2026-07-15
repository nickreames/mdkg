---
id: epic-249
type: epic
title: Disposable regression coverage and prepublish closeout
status: done
priority: 1
tags: [archive, testing, fixture, prepublish]
owners: []
links: []
artifacts: []
relates: [goal-70, goal-71, edd-76, dec-82]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-14
---
# Goal

Prove the defect and corrected semantics entirely in disposable fixtures, then
qualify one local implementation commit for v0.5.1 release.

# Scope

No-touch hashes, filesystem instrumentation, workspace/qid/error coverage,
existing compatibility suites, package dry-runs, checkpoint, and local commit.

# Milestones

- `bug-1` locks the failure before implementation.
- Tests `test-435` through `test-443` and full prepublish gates pass.
- `task-782` records the Goal 71 handoff.

# Out of Scope

The real root graph, version bump, push, publish, global install, or deployment.

# Risks

- A fixture that omits merged-index projections would miss the defect.
- Package readiness must not accidentally change release metadata.

# Links / Artifacts

- `bug-1`
- `task-781`
- `task-782`
- external links
