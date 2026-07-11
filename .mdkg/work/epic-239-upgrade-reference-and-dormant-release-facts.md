---
id: epic-239
type: epic
title: Upgrade reference and dormant release facts
status: done
priority: 1
tags: [release, implementation, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: []
blocks: []
refs: [task-738, task-739, test-406, edd-71, dec-68, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-61, goal-62, goal-63, goal-64, dec-73, dec-74, prd-11, prop-8]
evidence_refs: [chk-449, chk-450, chk-488]
aliases: []
skills: []
created: 2026-07-11
updated: 2026-07-11
---
# Goal

Prepare accurate upgrade, release-note, and command-reference content while all
public package/version claims remain truthful and dormant.

# Scope

- Source-backed upgrade guidance in existing install surfaces.
- Dormant v0.5.0 changelog/release-note content.
- Generated loop CLI reference and validation of every public example.
- Package/public version facts remain 0.4.2 during Goal 63.

# Milestones

- `task-738`: install, upgrade, and release facts.
- `task-739` / `test-406`: generated command and version truth.

# Out of Scope

Package version bump, npm availability language, tag, publish, push, deployment,
and activation; Goal 64 owns those mutations.

# Risks

- Draft release copy can accidentally advertise availability.
- Hand-authored syntax can diverge from descriptors and generated docs.

# Links / Artifacts

- `goal-64`
- `dec-74`
- `CLI_COMMAND_MATRIX.md`
