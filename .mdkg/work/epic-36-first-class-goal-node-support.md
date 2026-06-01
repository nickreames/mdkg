---
id: epic-36
type: epic
title: first class goal node support
status: done
priority: 1
tags: [goal, agent-harness, recursive-work, cli, prepublish]
owners: []
links: []
artifacts: []
relates: [prd-3, edd-10, epic-35]
blocked_by: []
blocks: [task-203, task-204, task-205, task-206, task-207]
refs: [rule-3, rule-4, rule-6]
aliases: [goal-node-support, recursive-goals, mdkg-goal]
skills: []
created: 2026-05-31
updated: 2026-05-31
---

# Goal

Implement first-class mdkg `goal` node support through full pre-publish
readiness without running a real npm publish.

# Scope

- Add `goal` as a durable, work-like mdkg node type distinct from epics,
  tasks, and skills.
- Support `mdkg new goal "..."`, validation, indexing, search, show, pack, and
  SQLite projection.
- Add a goal template and init/upgrade bundled schema coverage.
- Add report-only goal command behavior where it directly supports the design:
  goal inspection, evaluation, state updates, and goal-scoped next selection.
- Preserve normal `mdkg next` behavior as concrete work selection, not goal
  selection.
- Update docs, init assets, command matrix, changelog, tests, and smokes.

# Milestones

- Goal schema/template/new-node support.
- Goal CLI report-only and next-selection support.
- Docs, init assets, and skill guidance.
- Unit, CLI, temp-repo smoke, and publish dry-run readiness.

# Out of Scope

- No real npm publish.
- No autonomous command execution inside mdkg for goal checks.
- No opportunistic skill edits unless the active node is explicitly
  skill-maintenance.
- No replacement of epics, tasks, work orders, receipts, or checkpoints.

# Risks

- Goal nodes could become broad planning documents instead of executable
  recursive contracts.
- Normal `mdkg next` could accidentally select goals and disrupt existing task
  workflows.
- Evaluation could appear stronger than it is if report-only checks are not
  clearly labeled.

# Completion Evidence

- Implemented first-class `goal` type, template, parser attributes,
  `mdkg new goal`, pack ordering, and bundled init template coverage.
- Implemented `mdkg goal show/next/evaluate/pause/resume/done`.
- Updated README, command matrices, startup docs, changelog, and core rules.
- Added unit/CLI coverage and packed-package `smoke:goal`.
- Full prepublish dry-run gate passed for `mdkg@0.1.5` and no real npm publish
  was run.

# Known Follow-Ups

- Future goal work can add richer proposal generation for skill-improvement
  candidates.
- Future harness integrations can map external slash-command goal condition
  limits into `goal_condition` while storing longer context in the markdown
  body.

# Links / Artifacts

- `prd-3`
- `edd-10`
- `epic-35`
