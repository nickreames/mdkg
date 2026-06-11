---
id: task-331
type: task
title: implement mdkg status json operator summary
status: done
priority: 1
epic: epic-74
parent: goal-13
tags: [status, json, operator, 0-3-2]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-324]
blocks: [task-332, test-132]
refs: [edd-17]
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Implement the read-only `mdkg status [--json]` operator summary described by
`edd-17`.

# Acceptance Criteria

- Top-level help lists `status` as an operator command.
- `status --json` emits a single parseable JSON object on stdout.
- JSON includes release, git, graph validation, selected-goal, DB, and
  generated-cache summary fields.
- Dirty Git state is reported, not hidden.
- Missing Git upstream or missing DB config is represented without crashing.

# Files Affected

- Future `src/commands/status.ts`
- Future `src/cli.ts`
- Future tests and help snapshots

# Implementation Notes

- Reuse the shared operator-health collector from `edd-17`.
- Do not mutate indexes, selected goal state, project DB state, or graph files.

# Test Plan

- Unit tests for JSON envelope shape.
- CLI dispatch/help tests.
- Temp-repo smoke under `task-333`.

# Links / Artifacts

- `edd-17`
- `test-132`
