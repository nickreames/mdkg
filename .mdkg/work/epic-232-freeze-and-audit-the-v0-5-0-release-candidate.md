---
id: epic-232
type: epic
title: Freeze and audit the v0.5.0 release candidate
status: todo
priority: 1
tags: [release, audit, package, prepublish]
owners: []
links: []
artifacts: []
relates: [goal-64]
blocked_by: []
blocks: []
refs: [task-716, task-717, test-388]
context_refs: [goal-61, goal-63, goal-64, edd-72, dec-69]
evidence_refs: []
aliases: [v0-5-0-release-candidate-freeze]
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Goal

Prepare a clean, fully audited v0.5.0 release commit and dormant public release
preview before requesting any external mutation approval.

# Scope

- Version/lockfile/changelog/release-note finalization.
- Publish-bound diff-to-release-note reconciliation.
- Full package, graph, docs, site, tarball, upgrade, and local browser gates.
- Dormant and local-active release-state preview proof.

# Milestones

- `task-716`: release metadata freeze.
- `task-717` / `test-388`: complete local preflight.

# Out of Scope

Network security checks, push, npm publish, global replacement, and deployment.

# Risks

- Empty or stale changelog coverage can pass structural checks.
- Public activation can accidentally be enabled in the first commit.

# Links / Artifacts

- `edd-72`
- `dec-69`
- external links
