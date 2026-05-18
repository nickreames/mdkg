---
id: task-149
type: task
title: archive sidecar contract closeout audit
status: done
priority: 1
epic: epic-24
tags: [archive, sidecars, audit, closeout, contract]
owners: []
links: []
artifacts: []
relates: [epic-24, epic-22, epic-27, task-150, task-151]
blocked_by: []
blocks: [task-150, task-151]
refs: [edd-3, edd-8, rule-4]
aliases: [archive-contract-closeout-audit]
skills: []
created: 2026-05-18
updated: 2026-05-18
---

# Overview

Audit the current archive sidecar implementation against `epic-24` and decide
what remains before the epic can close.

# Acceptance Criteria

- Confirm current `mdkg archive add/list/show/verify/compress` behavior against
  the sidecar contract in `epic-24`.
- Confirm archive schema validation covers required metadata, hashes,
  compressed cache presence, and raw-source drift when the raw source exists.
- Confirm `doctor`, `init`, `upgrade`, `bundle`, and visibility behavior align
  with the private-default archive posture.
- Record remaining gaps as concrete follow-up tasks instead of broad notes.
- State whether `epic-24` can close after `task-150` and `task-151`, or list the
  exact additional blocker tasks.

# Files Affected

- `.mdkg/work/task-149-archive-sidecar-contract-closeout-audit.md`
- `src/commands/archive.ts`
- `src/graph/archive_file.ts`
- `src/commands/doctor.ts`
- `src/commands/bundle.ts`
- `README.md`
- `CLI_COMMAND_MATRIX.md`

# Implementation Notes

Closeout audit completed in the 0.1.4 line.

Findings:
- `mdkg archive add/list/show/verify/compress` now cover the intended sidecar
  lifecycle, including explicit archive visibility, deterministic ZIP caches,
  direct verification receipts, and `archive://...` references.
- Archive schema validation now requires the full sidecar contract, including
  `source_path`, hashes, size metadata, provenance, visibility, and ingest
  status.
- `mdkg validate` and `mdkg archive verify` share ZIP integrity checks for cache
  presence, compressed hash, ZIP readability, payload hash, and payload byte
  size.
- Init/upgrade ignore policy keeps `.mdkg/archive/**/source/` raw copies out of
  git while leaving sidecar `.md` files and ZIP caches commit-eligible.
- Bundle and visibility behavior are covered by `task-151`; diagnostic/storage
  hardening is covered by `task-150`.

No additional epic-24 blocker remained after `task-150` and `task-151` passed.

# Test Plan

- Run `npm run test -- --test-name-pattern archive` if supported by the local
  runner, otherwise run the relevant archive test file directly.
- Run `npm run smoke:archive-work`.
- Run `node dist/cli.js validate`.
- Run `git diff --check`.

# Links / Artifacts

- `epic-24`
- `task-150`
- `task-151`
- `epic-22`
- `epic-27`
- `npm run test` passed with 360 tests.
- `node dist/cli.js validate` passed.
- `npm run smoke:archive-work` passed.
