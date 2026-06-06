---
id: epic-52
type: epic
title: SPEC release root sync and downstream adoption handoff
status: todo
priority: 1
tags: [release, sync, adoption, handoff]
owners: []
links: []
artifacts: []
relates: [goal-8, task-278, task-279, test-105]
blocked_by: [epic-46, epic-47, epic-48, epic-49, epic-50, epic-51]
blocks: [task-278, task-279, test-105]
refs: [edd-14]
aliases: [spec-release-handoff, downstream-spec-adoption]
skills: [verify-close-and-checkpoint]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define how a completed SPEC design foundation moves from mdkg into parent/root
repos and downstream consumers.

# Goal

Define the release and adoption handoff after SPEC design work is complete.

# Scope

- Local SHA acceptance.
- Package publish path.
- Root subgraph refresh path.
- Downstream adoption sequencing.

# Milestones

- Complete `task-278`, `task-279`, and `test-105`.

# Acceptance Criteria

- Local SHA, package publish, and subgraph refresh paths are distinct.
- Downstream adoption remains a separate goal.
- Closeout evidence names validation gates and adoption blockers.

# Out of Scope

- Publishing or syncing downstream repos in this planning pass.

# Risks

- Root or downstream repos adopt partial SPEC assets before mdkg is accepted.

# Links / Artifacts

- `goal-8`
- `task-278`
- `task-279`
