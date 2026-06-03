---
id: task-225
type: task
title: define and validate mdkg db layout ignore policy
status: done
priority: 1
epic: epic-30
parent: goal-1
tags: [project-db, filesystem, gitignore, wal]
owners: []
links: []
artifacts: [src/core/project_db.ts, src/commands/init.ts, src/commands/upgrade.ts, src/commands/doctor.ts, src/cli.ts, tests/commands/init.test.ts, tests/commands/upgrade.test.ts, tests/commands/doctor.test.ts, tests/graph/indexer.test.ts, scripts/smoke-init.js, scripts/smoke-command-matrix.js, README.md, AGENT_START.md, CLI_COMMAND_MATRIX.md, assets/init/README.md, assets/init/AGENT_START.md, assets/init/CLI_COMMAND_MATRIX.md, .mdkg/core/rule-4-repo-safety-and-ignores.md]
relates: [goal-1, epic-30, edd-12, task-182, epic-31]
blocked_by: [task-223]
blocks: [task-227, task-228, task-229, task-230, task-231]
refs: [edd-12, rule-4]
aliases: [db-layout-ignore-policy]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Implement the generic `.mdkg/db/{schema,runtime,state,receipts}` layout and
ignore policy for project application databases.

# Acceptance Criteria

- Fresh init/upgrade guidance includes `.mdkg/db` directory policy.
- Runtime DB files, WAL, SHM, journal, lock, and temp files are ignored by
  default.
- Schema files, manifests, receipt artifacts, and opt-in sealed snapshots are
  commit-eligible by explicit policy.
- The layout remains separate from `.mdkg/index` and does not affect graph index
  scanning.
- `doctor` or validation guidance catches obviously unsafe active runtime files
  when practical.

# Explicit Exclusions

- No default commit of active runtime DBs.
- No sealed snapshot implementation beyond policy needed for this phase.

# Files Affected

- Init/upgrade ignore generation.
- Project DB layout helpers.
- Doctor/validation diagnostics.

# Implementation Notes

Keep `.mdkg/db` files distinct from `.mdkg/index` caches and from mdkg graph
Markdown scanning.

# Test Plan

- Unit tests cover ignore entries and contained paths.
- Temp repo smoke proves fresh init and upgrade-managed ignore policy. Actual
  `mdkg db init` layout creation is scoped to `task-227`.
- Validation confirms `.mdkg/db/runtime` is not treated as mdkg graph content.

# Closeout Evidence

- Added `src/core/project_db.ts` with the canonical `.mdkg/db` layout constants
  and project DB runtime/transient file policy helpers.
- Updated init and upgrade ignore generation to ignore `.mdkg/db/runtime/` plus
  `.mdkg/db` WAL, SHM, journal, lock, and temp files while keeping schema,
  manifests, receipts, and sealed state snapshots commit-eligible by explicit
  policy.
- Added `doctor` warning diagnostics for active project DB runtime/transient
  files.
- Updated root and seeded docs: `README.md`, `AGENT_START.md`,
  `CLI_COMMAND_MATRIX.md`, seeded init README/start/matrix, and `rule-4`.
- Added tests for ignore entries, upgrade repair, doctor warnings, and graph
  index exclusion for `.mdkg/db` markdown-like files.
- Verification passed: `npm run test` with 393 passing tests, `npm run
  cli:check`, `npm run smoke:init`, `npm run smoke:matrix`, `node dist/cli.js
  db index verify --json`, `node dist/cli.js validate`, and `git diff --check`.

# Links / Artifacts

- `goal-1`
- `epic-30`
- `edd-12`
- `rule-4`
