---
id: task-20
type: task
title: add short flags with repo-wide audit
status: done
priority: 2
epic: epic-2
tags: [cli, flags, pack]
owners: []
links: [cmd:cli, cmd:pack]
artifacts: [short-flags]
relates: [rule-3]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-13
updated: 2026-01-14
---

# Overview

Add single-letter CLI flags (global where possible) after auditing for collisions across all commands.

# Acceptance Criteria

- short flags supported for common options (e.g., `-o`, `-f`, `-v`, `-d`, `-e`, `-w`, `-r`)
- no collisions with existing flags (`-h`) or future defaults
- `--help` output lists short forms alongside long flags
- tests cover parsing of short flags

# Files Affected

- src/util/argparse.ts
- src/cli.ts
- tests/**

# Implementation Notes

- include a short-flag matrix in this task before implementing
- keep normalization rules consistent with existing long flags

# Test Plan

- run `npm run test`

# Links / Artifacts

- rule-3
