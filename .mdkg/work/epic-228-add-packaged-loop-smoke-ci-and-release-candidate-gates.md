---
id: epic-228
type: epic
title: Add packaged loop smoke CI and release candidate gates
status: todo
priority: 1
tags: [loop, package, ci, release]
owners: []
links: []
artifacts: []
relates: [goal-61]
blocked_by: []
blocks: []
refs: [task-708, task-709, test-381, test-382]
context_refs: [goal-61, edd-70, dec-67, goal-58, goal-59, loop-1, loop-3, loop-4]
evidence_refs: []
aliases: [loop-release-candidate-verification]
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Goal

Prove loop behavior from the packaged consumer surface and produce honest
release-candidate evidence through CI, regression checks, and corrected dogfood.

# Scope

- Installed-tarball smoke for all seven seeds and SQLite.
- Supported-Node CI and publish-readiness integration.
- Historical goal/test/checkpoint evidence repair without erasure.
- Corrected security and backend/API/CLI audit loop execution.
- Final v0.5.0 release-candidate checkpoint.

# Milestones

- `task-708` / `test-381`: package and CI proof.
- `task-709` / `test-382`: graph repair, dogfood, regression, closeout.

# Out of Scope

Version bump, changelog finalization, npm publish, public-site work, and deploy.

# Risks

- Source tests can pass while packaged SQLite behavior fails.
- Historical evidence repair can accidentally rewrite failed dogfood history.

# Links / Artifacts

- `goal-61`
- `edd-70`
- external links
