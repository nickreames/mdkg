---
id: task-230
type: task
title: update db docs help init upgrade and changelog
status: done
priority: 1
epic: epic-30
parent: goal-1
tags: [project-db, docs, help, changelog]
owners: []
links: []
artifacts: [README.md, CLI_COMMAND_MATRIX.md, CHANGELOG.md, AGENT_START.md, assets/init/README.md, assets/init/CLI_COMMAND_MATRIX.md, assets/init/AGENT_START.md, src/cli.ts]
relates: [goal-1, epic-30, edd-12, task-223, task-224, task-225, task-226, task-227, task-228, task-229]
blocked_by: [task-223, task-224, task-225, task-226, task-227, task-228, task-229]
blocks: [task-231]
refs: [edd-12, rule-3]
aliases: [db-docs-closeout]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Align public docs, generated init docs, CLI help snapshots, upgrade guidance,
and changelog with the implemented DB foundation.

# Acceptance Criteria

- README and command matrix describe `mdkg db ...` and the `mdkg index`
  compatibility shortcut.
- Init assets explain `.mdkg/db` layout and ignore policy.
- Changelog records the release-slice changes and no-publish status.
- Help snapshots include DB commands and usage errors.
- Docs preserve pre-v1 churn language and source-of-truth boundaries.

# Explicit Exclusions

- No public docs for full project DB profiles beyond deferred roadmap notes.
- No publish instructions beyond dry-run readiness.

# Files Affected

- README, command matrix, changelog, init assets, help snapshots.
- Core rules if needed for DB state boundaries.

# Implementation Notes

Keep docs generic and pre-v1. Mention profiles only as deferred follow-up work.

# Test Plan

- `npm run cli:check` passes.
- Docs mention active runtime/WAL ignore policy and no arbitrary SQL write path.
- Generated init docs match CLI behavior.

# Closeout Evidence

- README now documents `.mdkg/index` as rebuildable graph cache state and
  `.mdkg/db` as project application database state.
- README documents `mdkg db init`, `mdkg db migrate`, `mdkg db verify`, and
  `mdkg db stats`, including the active runtime/WAL ignore policy.
- `CLI_COMMAND_MATRIX.md` and seeded `assets/init/CLI_COMMAND_MATRIX.md` list
  the complete `mdkg db` command surface and behavior.
- Root and seeded `AGENT_START.md` explain the init/migrate/verify/stats flow
  for agents.
- Seeded `assets/init/README.md` matches the current DB layout, runtime ignore,
  and policy boundaries.
- `CHANGELOG.md` records the DB foundation release slice under
  `0.1.7 - Unreleased`.
- Help output for `mdkg help db` documents the implemented command family.
- Verification passed:
  - `npm run test` (403 tests)
  - `npm run cli:check`
  - `npm run smoke:init`
  - `npm run smoke:upgrade`

# Links / Artifacts

- `goal-1`
- `epic-30`
- `edd-12`
