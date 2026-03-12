---
id: task-108
type: task
title: add init agent seeded skills and events tests
status: done
priority: 1
epic: epic-16
tags: [0_0_6, tests, init, events, skills]
owners: []
links: []
artifacts: [tests/commands/init.test.ts, tests/commands/skill_mirrors.test.ts, tests/commands/validate_events.test.ts, tests/commands/task_event.test.ts, npm-run-test, node-dist-cli-skill-sync, node-dist-cli-validate, npm-run-cli-check]
relates: [dec-19, epic-16]
blocked_by: []
blocks: [test-58, test-59, test-60, test-61, test-62]
refs: [test-58, test-59, test-60, test-61]
aliases: []
skills: []
created: 2026-03-11
updated: 2026-03-11
---
# Overview

Expand the automated checks so the new bootstrap defaults and framing changes are locked in before release.

# Acceptance Criteria

- tests cover seeded canonical skills and non-empty mirrors
- tests cover committed-by-default event behavior and manual event-file deletion tolerance
- tests cover startup/help/doc parity for the seeded bootstrap and hybrid task/manual-edit model

# Files Affected

- `tests/commands/init.test.ts`
- `tests/commands/skill_mirrors.test.ts`
- `tests/commands/validate_events.test.ts`
- `tests/commands/task_event.test.ts`

# Implementation Notes

- keep tests aligned to the installed-package behavior, not just repo-local assumptions
- use existing smoke and CLI parity checks as part of `test-62`

# Test Plan

- `test-58`
- `test-59`
- `test-60`
- `test-61`
- `test-62`

# Links / Artifacts

- `dec-19`
