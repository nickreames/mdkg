---
id: test-121
type: test
title: final 0.3.0 prepublish dry-run readiness contract
status: done
priority: 1
epic: epic-64
parent: goal-10
tags: [prepublish, dry-run, release]
owners: []
links: []
artifacts: [tests://prepublishOnly, npm://pack-dry-run, npm://publish-dry-run]
relates: [task-308, task-309]
blocked_by: [task-308]
blocks: []
refs: []
aliases: []
skills: []
cases: [prepublishOnly, pack-dry-run, publish-dry-run, not-published]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Validate final 0.3.0 package readiness after polish without publishing.

# Target / Scope

- `task-308`
- `task-309`
- `goal-10`

# Preconditions / Environment

- Local repo after all polish changes.
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache` for npm dry-run commands.

# Test Cases

- Full `npm run prepublishOnly` passes.
- `npm pack --dry-run --json` reports `mdkg@0.3.0`.
- `npm publish --dry-run` reports registry publication only as dry-run.
- No real `npm publish`, tag, or push is run.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- None yet.
