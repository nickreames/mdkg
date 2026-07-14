---
id: task-764
type: task
title: Migrate destructive mirror workspace snapshot and SQLite sinks
status: done
priority: 0
epic: epic-241
tags: [security, remediation, v0.5.0]
owners: []
links: []
artifacts: [src/commands/skill_mirror.ts, src/commands/workspace.ts, src/commands/new.ts, src/graph/workspace_files.ts, src/graph/sqlite_index.ts, src/core/project_db_migrations.ts, src/core/project_db_snapshot.ts, tests/commands/skill_mirrors.test.ts, tests/commands/workspace.test.ts, tests/commands/new.test.ts, tests/commands/sqlite_dal.test.ts, tests/commands/db_index.test.ts]
relates: [goal-69]
blocked_by: [task-763]
blocks: []
refs: [edd-75, dec-80, test-425, test-426]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-12
updated: 2026-07-12
---
# Overview

Migrate the most consequential containment sinks to `task-763`'s safe-path
authority. This task owns all five high findings and the project-DB migration
path finding.

# Acceptance Criteria

- Close exactly: `cand-review-004-003`, `cand-review-004-004`,
  `cand-review-004-005`, `cand-review-008-001`, `cand-review-008-002`, and
  `cand-review-006-001`.
- Mirror cleanup/replacement cannot recurse through a linked manifest slug/root.
- Workspace aliases cannot route persistent reads or writes outside the selected
  repository.
- Snapshot dump/diff, SQLite rebuild/reservation, DB migrations, and runtime DB
  paths reject linked ancestry before opening or replacing files.
- Every instance has a targeted regression and outside sentinel proof.

# Files Affected

List files/directories expected to change.

- Skill mirror and workspace command/core modules
- Project DB migration/runtime and snapshot modules
- SQLite index rebuild/reservation modules
- Focused command and integration tests

# Implementation Notes

- Validate complete destructive plans before deleting any path.
- Preserve explicit snapshot output semantics only when the destination is an
  operator-selected target, not repository-controlled metadata.
- Test source and destination links independently.

# Test Plan

Exercise each six finding IDs through its real CLI or exported API in disposable
repositories, assert external sentinels and SQLite files remain unchanged, and run
`test-425`, `test-426`, DB/snapshot/SQLite smokes, and existing mirror/workspace
tests.

# Links / Artifacts

- `task-763`, `epic-241`
- `test-425`, `test-426`
- Finding IDs listed in Acceptance Criteria
