---
id: task-139
type: task
title: add bundle import config and registry commands
status: done
priority: 1
epic: epic-23
tags: [bundle-import, config, cli]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-140, task-141, task-142, task-143, test-83]
refs: []
aliases: [bundle-import-registry]
skills: []
created: 2026-05-17
updated: 2026-05-17
---
# Overview

Add the `bundle_imports` config surface and `mdkg bundle import ...` registry
commands for read-only child graph snapshots.

# Acceptance Criteria

- Config supports enabled read-only imports with alias, path, visibility,
  expected profile, optional source metadata, and optional staleness policy.
- Import aliases follow workspace alias rules and cannot collide with
  workspace aliases or `all`.
- `mdkg bundle import add/list/rm/enable/disable/verify` provide JSON receipts.
- Receipts expose alias, path, profile, visibility, source metadata, bundle
  hash, stale state, warnings, and errors.

# Files Affected

- `src/core/config.ts`
- `src/commands/bundle_import.ts`
- `src/cli.ts`
- `.mdkg/config.json`
- `assets/init/config.json`

# Implementation Notes

- Add import config as a dedicated top-level registry instead of overloading
  registered workspaces.
- Keep imports read-only and explicit; registry changes mutate only local
  `.mdkg/config.json`.

# Test Plan

- Unit and CLI tests cover config defaults, validation failures, command
  receipts, and idempotent enable/disable/list behavior.

# Results / Evidence

- `npm run test`
- `npm run smoke:bundle-import`
- `npm publish --dry-run`

# Links / Artifacts

- `mdkg bundle import add/list/rm/enable/disable/verify`
