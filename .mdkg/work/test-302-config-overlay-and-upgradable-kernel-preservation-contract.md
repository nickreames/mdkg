---
id: test-302
type: test
title: config overlay and upgradable kernel preservation contract
status: done
priority: 1
epic: epic-199
parent: goal-41
tags: [0.3.9, config-overlays, upgrade, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-595]
blocks: []
refs: [task-595]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Validate that config overlays can customize mdkg standards while preserving
kernel upgradeability.

# Target / Scope

`task-595`, `.mdkg/config.json`, init assets, and upgrade behavior.

# Preconditions / Environment

Use a temp repo under `/private/tmp` with local package or built CLI.

# Test Cases

- Fresh init validates with default config.
- Add custom standards/core-doc overlay and run `mdkg upgrade --dry-run`.
- Run `mdkg upgrade --apply` and verify local overlay content remains.
- Validate the temp repo after upgrade.

# Results / Evidence

- `node --test dist/tests/core/config.test.js` passed: 27 tests.
- `node --test dist/tests/commands/upgrade.test.js` passed: 13 tests.
- Coverage includes organization customization overlays, unsafe path rejection,
  customization defaults migration, operator customization overlay preservation,
  managed init asset upgrade behavior, customized core-doc preservation, and
  missing COLLABORATION creation during upgrade.
- `task-595` evidence also includes temp-repo upgrade smoke coverage proving
  custom overlay content is preserved while mdkg-managed kernel assets remain
  upgradable.

# Notes / Follow-ups

- This contract must fail if upgrade overwrites organization-owned policy
  silently.
