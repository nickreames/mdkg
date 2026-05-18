---
id: task-143
type: task
title: add import health visibility and docs
status: done
priority: 1
epic: epic-23
tags: [bundle-import, doctor, validate, docs]
owners: []
links: []
artifacts: []
relates: [task-139, task-140, task-141, task-142]
blocked_by: []
blocks: [test-83]
refs: []
aliases: [bundle-import-health-docs]
skills: []
created: 2026-05-17
updated: 2026-05-17
---
# Overview

Surface import health consistently in validation, doctor, public bundle safety,
docs, help, and release notes.

# Acceptance Criteria

- `mdkg validate` fails on corrupt/missing enabled imports and imported qid
  collisions, but warns for stale imports.
- `mdkg doctor` reports enabled, disabled, stale, and invalid imports with
  repair guidance.
- Public bundle creation fails when public local nodes reference private or
  internal imported graph records.
- README, command matrix, help snapshots, init docs, and changelog document
  read-only imports and stale behavior.

# Files Affected

- `src/commands/validate.ts`
- `src/commands/doctor.ts`
- `src/commands/bundle.ts`
- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `AGENT_START.md`
- `assets/init/**`
- `CHANGELOG.md`

# Implementation Notes

- Stale imports warn for planning commands but fail `bundle import verify`.
- Public bundle creation remains fail-closed and does not re-export imported
  child graph content.

# Test Plan

- Tests cover validate/doctor diagnostics, public bundle fail-closed behavior,
  help snapshot parity, docs assertions, and release readiness assertions.

# Results / Evidence

- `npm run cli:check`
- `node dist/cli.js validate`
- `npm pack --dry-run --json`
- `npm publish --dry-run`

# Links / Artifacts

- `mdkg doctor`
- `mdkg validate`
- `mdkg bundle create --profile public`
