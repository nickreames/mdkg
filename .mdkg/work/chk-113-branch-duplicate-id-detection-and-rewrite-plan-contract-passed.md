---
id: chk-113
type: checkpoint
title: Branch duplicate id detection and rewrite plan contract passed
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [test-138]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [test-138]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

`test-138` passed for branch duplicate-id detection and deterministic rewrite
planning. The contract now covers a real Git two-branch merge state where both
branches add different files with the same local `task-2` id.

# Scope Covered

- `test-138`
- Branch-merge duplicate local id validation diagnostics.
- Read-only duplicate-id fix-plan grouping and deterministic candidate ids.

# Decisions Captured

- Keep duplicate-id repair as `fix plan` only; no apply mode was added.
- Use the lexicographically first file path as the canonical survivor and
  propose `<id>-dup-<n>` for later duplicate paths.
- Emit branch-conflict evidence in the repair receipt without trying to infer
  actual Git branch ownership for each file.

# Implementation Summary

- `validate --json` now reports duplicate-id file paths relative to the repo
  root, making diagnostics stable enough for scripts and receipts.
- `fix plan --family ids --json` now includes duplicate-group evidence:
  workspace, duplicate id, canonical path, duplicate paths, deterministic rule,
  candidate qid, and collision-free status.

# Verification / Testing

- `npm run build`
- `npm run build:test`
- `node --test dist/tests/commands/fix.test.js dist/tests/commands/validate.test.js`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `node dist/cli.js goal next goal-13 --json`
- `git diff --check`

# Known Issues / Follow-ups

- `task-342` still needs reference rewrite receipt planning and stale selected
  goal repair planning.
- `task-344` remains the future packed/temp two-branch smoke and prepublish
  gate.

# Links / Artifacts

- `tests/commands/fix.test.ts`
- `src/commands/fix.ts`
- `src/commands/validate.ts`
