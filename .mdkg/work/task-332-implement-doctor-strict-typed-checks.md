---
id: task-332
type: task
title: implement doctor strict typed checks
status: done
priority: 1
epic: epic-74
parent: goal-13
tags: [doctor, strict, typed-checks, 0-3-2]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-331]
blocks: [task-333, test-133]
refs: [edd-17]
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Refactor `mdkg doctor` into a typed health-check surface and add strict mode.

# Acceptance Criteria

- Existing `mdkg doctor --json` remains supported.
- Check rows include stable `id`, `status`, `severity`, `message`, and
  `remediation` fields.
- `doctor --strict --json` fails on invalid graph, stale achieved selected
  goal, DB verify failure, and generated-state failures.
- Warnings remain non-fatal in non-strict mode unless the existing command would
  already fail.

# Files Affected

- Future `src/commands/doctor.ts`
- Future shared operator health helper
- Future doctor tests and command matrix entries

# Implementation Notes

- Preserve backwards-compatible `checks` output enough for existing consumers.
- Add new fields rather than removing existing `name`, `ok`, `level`, and
  `detail` immediately.

# Test Plan

- Unit tests for strict and non-strict behavior.
- Invalid graph and stale selected-goal fixtures.
- stdout/stderr contract checks.

# Links / Artifacts

- `edd-17`
- `test-133`
