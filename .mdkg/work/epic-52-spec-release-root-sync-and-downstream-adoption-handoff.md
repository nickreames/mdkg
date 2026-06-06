---
id: epic-52
type: epic
title: SPEC release root sync and downstream adoption handoff
status: done
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

# Closeout Evidence

- `task-278` is done and defines separate local SHA, package publish, root
  subgraph refresh, and downstream adoption paths.
- `test-105` is done and records release/adoption readiness validation.
- `task-279` is the active closeout task for final goal evidence.
- `chk-55` and `chk-56` record backcompat and adoption handoff evidence.
- `node dist/cli.js capability search "downstream SPEC adoption" --json`
  resolves `edd-14`.
- No package publish, root sync, downstream sync, or all-repo sync happened in
  this mdkg-only planning pass.

# Links / Artifacts

- `goal-8`
- `task-278`
- `task-279`
