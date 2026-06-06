---
id: chk-56
type: checkpoint
title: SPEC adoption handoff
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/work/task-278-define-root-and-downstream-spec-sync-after-mdkg-publication.md]
relates: [task-278]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-278]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

`task-278` defined the root/downstream SPEC adoption handoff. Local accepted
SHA, package publish, and root subgraph refresh are separate paths, and
downstream repo adoption remains a separate per-repo or all-repo goal.

# Scope Covered

- Local accepted SHA adoption path.
- Package publish adoption path.
- Root subgraph refresh adoption path.
- Per-repo downstream adoption policy.
- Handoff checklist for future consumers.
- Adoption blockers and stop conditions.

# Decisions Captured

- A local accepted SHA is not a public package release.
- Package publish requires a separate release goal and package/registry gates.
- Root subgraph refresh must be previewed in the root repo before mutation.
- Downstream repos must preserve local extensions and run repo-local gates.
- All-repo sync is explicitly deferred to a separate umbrella goal.

# Implementation Summary

Only mdkg graph/design state changed. `task-278` now carries the adoption
handoff and stop conditions for root and downstream consumers.

# Verification / Testing

- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `node dist/cli.js capability search "downstream SPEC adoption" --json`
- `node dist/cli.js goal next goal-8 --json`
- Product-name grep over `task-278`
- `git diff --check`

# Known Issues / Follow-ups

- `test-105` must validate release/adoption readiness.
- `task-279` must close goal-8 only after all validation nodes are done.
- No publish, root sync, downstream sync, or all-repo sync happened in this
  task.

# Links / Artifacts

- `goal-8`
- `task-278`
- `epic-52`
- `test-105`
