---
id: task-169
type: task
title: doctor validate docs and upgrade policy
status: done
priority: 1
epic: epic-20
tags: [0_1_3, docs, doctor, validate, upgrade]
owners: []
links: [README.md, CLI_COMMAND_MATRIX.md, assets/init/config.json]
artifacts: []
relates: [epic-20, task-165, task-167]
blocked_by: [task-165, task-167]
blocks: [task-170]
refs: [rule-1, rule-3, rule-4, rule-5]
aliases: [sqlite-docs-and-health]
skills: []
created: 2026-05-20
updated: 2026-05-20
---

# Overview

Align config, init, upgrade, doctor, validate, docs, and ignore policy around
SQLite being first-class for new workspaces and JSON staying compatible for old
workspaces.

# Acceptance Criteria

- Fresh init defaults to SQLite.
- Existing configs without SQLite fields migrate to JSON backend.
- `.mdkg/index/mdkg.sqlite` is commit-eligible while generated JSON/temp/lock
  and WAL/SHM/journal files stay ignored.
- `mdkg doctor` reports missing, stale, corrupt, schema-mismatched, and large
  SQLite cache conditions when SQLite mode is enabled.
- `mdkg validate` checks SQLite cache health without making SQLite source of
  truth.
- README, command matrix, seeded docs, core rules, and changelog describe the
  new runtime and cache policy.

# Files Affected

- `src/core/config.ts`
- `src/commands/init.ts`
- `src/commands/doctor.ts`
- `src/commands/validate.ts`
- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `assets/init/*`
- `.mdkg/core/*`
- `.gitignore`

# Implementation Notes

SQLite cache files may be committed by explicit repo policy, but cache growth
is a doctor warning rather than a validation failure.

# Test Plan

- Config migration unit tests.
- `node dist/cli.js doctor`
- `node dist/cli.js validate`
- `npm run smoke:init`
- `npm run smoke:sqlite`

# Links / Artifacts

- `epic-20`

# Verification Evidence

- `npm run test`
- `npm run cli:check`
- `node dist/cli.js doctor`
- `node dist/cli.js validate`
- `npm run smoke:init`
- `npm run smoke:sqlite`
