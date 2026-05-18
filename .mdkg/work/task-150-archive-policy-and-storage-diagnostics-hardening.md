---
id: task-150
type: task
title: archive policy and storage diagnostics hardening
status: done
priority: 1
epic: epic-24
tags: [archive, diagnostics, storage, policy, compression]
owners: []
links: []
artifacts: []
relates: [epic-24, task-149, task-151]
blocked_by: [task-149]
blocks: [task-151]
refs: [edd-3, edd-8, rule-4]
aliases: [archive-storage-diagnostics]
skills: []
created: 2026-05-18
updated: 2026-05-18
---

# Overview

Harden archive storage diagnostics so mdkg users understand which archive files
are committed, ignored, missing, stale, or unsafe to export.

# Acceptance Criteria

- `doctor` and `validate` guidance distinguishes committed sidecars and ZIP
  caches from ignored raw source copies under `.mdkg/archive/**/source/`.
- Missing ZIP caches, hash mismatches, malformed sidecars, and raw source drift
  produce actionable diagnostics.
- Stray uncompressed files under `.mdkg/archive` continue to warn with clear
  `mdkg archive add` or relocation guidance.
- Large archive cache guidance is documented without adding a built-in office,
  PDF, or conversion engine.
- Temp-repo proof covers raw source deletion, ZIP-only verification, hash drift,
  and stray raw file diagnostics.

# Files Affected

- `src/commands/archive.ts`
- `src/commands/doctor.ts`
- `src/graph/archive_file.ts`
- `tests/commands/archive_work.test.ts`
- `README.md`
- `CLI_COMMAND_MATRIX.md`

# Implementation Notes

Keep the model conservative: the sidecar plus deterministic ZIP cache are the
portable committed record; the full raw source copy is local or policy-managed.
Do not introduce secret scanning or automatic body redaction in this task.

Implemented closeout:
- Archive validation requires `source_path` and rejects absolute or parent-dir
  source labels.
- `archive add` records in-repo sources as repo-relative paths and outside-repo
  sources as `external:<basename>`.
- Shared archive integrity logic powers both `mdkg validate` and
  `mdkg archive verify`, including missing ZIP cache, corrupt ZIP cache, payload
  hash mismatch, payload byte-size mismatch, and raw source drift when the raw
  copy exists.
- `mdkg archive verify --json` emits a structured receipt for corrupt archive
  caches instead of being blocked by strict index validation.
- Added `archive.large_cache_warning_bytes` config with default `26214400` and
  `0` disabling warnings.
- `mdkg doctor` warns, without failing validation, when committed archive ZIP
  caches exceed the configured threshold.

# Test Plan

- Add unit or command tests for missing ZIP cache, compressed hash mismatch, raw
  source hash drift, raw source absence, and stray raw files.
- Run `npm run test`.
- Run `npm run smoke:archive-work`.
- Run `node dist/cli.js validate`.
- Run `git diff --check`.

# Links / Artifacts

- `epic-24`
- `task-149`
- `task-151`
- `npm run test` passed with missing ZIP, corrupt ZIP, raw drift, external
  source redaction, and large-cache warning coverage.
- `npm run smoke:archive-work` passed.
- `node dist/cli.js validate` passed.
