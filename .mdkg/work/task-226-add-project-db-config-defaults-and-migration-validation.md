---
id: task-226
type: task
title: add project db config defaults and migration validation
status: done
priority: 1
epic: epic-30
parent: goal-1
tags: [project-db, config, migration, validation]
owners: []
links: []
artifacts: [src/core/config.ts, src/core/project_db.ts, src/commands/upgrade.ts, assets/init/config.json, tests/core/config.test.ts]
relates: [goal-1, epic-30, edd-12, task-183]
blocked_by: [task-223]
blocks: [task-227, task-228, task-229, task-230, task-231]
refs: [edd-12]
aliases: [project-db-config]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Add generic project DB configuration defaults and migration-compatible config
validation without changing `index.*` cache settings.

# Acceptance Criteria

- Config has a project DB section distinct from `index.*`.
- Defaults cover enabled state, layout roots, runtime path, state path, receipts
  path, schema version, and migration metadata.
- Config migration preserves existing repos and does not silently create active
  runtime state.
- Path validation keeps project DB paths contained in the repo.
- Future profile fields are absent or explicitly deferred.

# Explicit Exclusions

- No profile registry or profile-specific defaults.
- No external service configuration.

# Files Affected

- Config schema and migration.
- Init seed config.
- Config unit tests.

# Implementation Notes

Treat project DB config as a new namespace; do not overload existing `index.*`
cache settings.

# Test Plan

- Tests cover fresh config defaults, legacy migration, invalid paths, disabled
  DB mode, and separation from `index.backend`.
- `mdkg validate` passes for fresh and upgraded repos.

# Closeout Evidence

- Added a normalized `db` config namespace distinct from `index.*`:
  `enabled`, `schema_version`, `root_path`, `schema_path`,
  `migrations_path`, `runtime_path`, `state_path`, `receipts_path`, and
  `migration_table`.
- Default shape keeps project DB disabled and points to `.mdkg/db/**` without
  creating runtime state.
- Existing configs without `db` still load through defaults; `mdkg upgrade
  --apply` writes the default `db` section when missing.
- Project DB paths are repo-contained and internally constrained under
  `db.root_path`; omitted child paths derive from custom `db.root_path`.
- Future profile fields are rejected with a clear deferred-profile error.
- Verification passed:
  - `npm run test` (396 tests)
  - `npm run smoke:init`
  - `npm run smoke:upgrade`
  - `npm run cli:check`

# Links / Artifacts

- `goal-1`
- `epic-30`
- `edd-12`
