---
id: epic-67
type: epic
title: downstream migration automation roadmap
status: todo
priority: 2
tags: [deferred, downstream, migration, automation, roadmap]
owners: []
links: []
artifacts: []
relates: [goal-11]
blocked_by: []
blocks: [task-314, task-315, test-124]
refs: []
aliases: []
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Goal

Design and eventually implement downstream migration automation after the 0.3.0
release is published and verified.

# Scope

- Dry-run-first downstream migration contract.
- No-cross-repo-mutation safety model.
- Post-publish automation implementation.

# Milestones

- `task-314`
- `task-315`
- `test-124`

# Out of Scope

- No downstream repo mutation in 0.3.0 polish.
- No automation before the public package release is verified.

# Risks

- Automation can mutate child repos unexpectedly.
- Pre-publish downstream sync can create version drift.

# Links / Artifacts

- `goal-11`

# Roadmap Alignment

This downstream automation epic is consolidated under the `goal-13` hardening
umbrella by narrative roadmap alignment only. It is intentionally not related
to `goal-13` in frontmatter so active hardening goal routing does not select
paused `goal-11` implementation work.
