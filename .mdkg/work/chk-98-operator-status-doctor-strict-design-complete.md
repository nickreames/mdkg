---
id: chk-98
type: checkpoint
title: operator status doctor strict design complete
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-324]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-324]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

Completed the `0.3.2` operator-health design pass for `task-324`.
`edd-17` now defines the read-only `mdkg status --json` and `mdkg doctor
--strict --json` contracts, typed check rows, stdout/stderr behavior, failure
modes, privacy boundaries, rollout order, and temp-repo test expectations.

# Scope Covered

- `task-324`
- `edd-17`
- `task-331`
- `task-332`
- `task-333`
- `test-132`
- `test-133`
- `test-134`

# Decisions Captured

- `status` and `doctor --strict` are read-only operator-health projections.
- `status --json` is the fast summary command.
- `doctor --strict --json` is the full typed-check command.
- Repair/apply behavior remains deferred to `epic-70`.
- JSON stdout must remain a single parseable object; human diagnostics belong
  on stderr.

# Implementation Summary

Added `edd-17` and future implementation/test nodes under `epic-74`. Wired
`goal-13` scope so the next actionable node is `task-331`.

# Verification / Testing

- Reviewed current `doctor` implementation and help surface.
- Ran `node dist/cli.js validate --json` successfully before closeout.
- Ran `node dist/cli.js goal next goal-13 --json` successfully before closeout.
- Ran `git diff --check` successfully before closeout.

# Known Issues / Follow-ups

- Implement `task-331` next: `mdkg status --json`.
- Implement `task-332` after status: strict typed doctor checks.
- Add packed/temp-repo smoke and docs under `task-333`.

# Links / Artifacts

- `edd-17`
- `task-331`
- `task-332`
- `task-333`
- `test-132`
- `test-133`
- `test-134`
