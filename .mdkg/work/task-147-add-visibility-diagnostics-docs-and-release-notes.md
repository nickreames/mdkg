---
id: task-147
type: task
title: add visibility diagnostics docs and release notes
status: done
priority: 1
epic: epic-27
tags: [visibility, validate, doctor, docs, release]
owners: []
links: []
artifacts: [README.md, CLI_COMMAND_MATRIX.md, CHANGELOG.md, npm publish --dry-run]
relates: [task-144, task-145, task-146]
blocked_by: []
blocks: [test-84, chk-25]
refs: []
aliases: [visibility-diagnostics-docs]
skills: []
created: 2026-05-18
updated: 2026-05-18
---
# Overview

Surface visibility risks in validation, doctor output, bootstrap docs, command
references, and the unreleased 0.1.4 changelog.

# Acceptance Criteria

- `mdkg validate` fails public/internal references to less-visible local,
  archive, or imported records.
- `mdkg doctor` reports visibility policy violations with repair guidance.
- README, command matrix, agent startup docs, init assets, core rules, and
  changelog document the explicit visibility filter behavior.

# Files Affected

- `src/commands/validate.ts`
- `src/commands/doctor.ts`
- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `AGENT_START.md`
- `assets/init/**`
- `.mdkg/core/**`
- `CHANGELOG.md`

# Implementation Notes

Docs must be clear that mdkg visibility prevents accidental export through mdkg
commands but does not erase secrets from git history or Markdown bodies.

# Results

`mdkg validate` now fails public/internal deterministic refs to less-visible
records, and `mdkg doctor` reports visibility policy risks with repair guidance.
Updated README, command matrix, agent startup docs, init docs, core rules,
release skills, publish assertions, and the unreleased 0.1.4 changelog.

# Test Plan

- Command help snapshots, docs assertions, `mdkg validate`, and `mdkg doctor`
  cover visibility output and guidance.

# Verification

- `npm run cli:check`
- `node dist/cli.js validate`
- `npm publish --dry-run`

# Links / Artifacts

- `mdkg validate`
- `mdkg doctor`
