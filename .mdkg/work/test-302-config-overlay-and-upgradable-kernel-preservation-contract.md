---
id: test-302
type: test
title: config overlay and upgradable kernel preservation contract
status: todo
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
updated: 2026-06-26
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

Pending implementation.

# Notes / Follow-ups

- This contract must fail if upgrade overwrites organization-owned policy
  silently.
