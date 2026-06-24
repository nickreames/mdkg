---
id: test-258
type: test
title: goal-34 routing archive provenance and mdkg-only creation contract
status: done
priority: 1
epic: epic-172
parent: goal-34
tags: [mdkg-dev, graph-only]
owners: []
links: []
artifacts: []
relates: [goal-34, task-534]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [archive-verify, goal-routing, no-functional-mutation, graph-validation]
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Validate that goal-34 was created as a graph-only mdkg roadmap with archived provenance and no functional changes.

# Target / Scope

`goal-34`, `task-534`, new pass-4 design/work/test nodes, and the archive sidecar.

# Preconditions / Environment

Clean local repo with no selected goal before creation.

# Test Cases

- Archive verifies.
- `goal show goal-34 --json` returns the expected goal.
- `goal next goal-34 --json` routes to `task-534` before closeout and `task-535` after claim.
- `validate --summary --json --limit 20` has zero warnings/errors.
- `git diff --check` passes and no source/site/docs implementation files changed.

# Results / Evidence

- Passed for the mdkg-only creation pass.
- Archive `archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24` verifies.
- `goal-34` exists, is selected/current, and now routes to `task-535` after `task-534` closeout.
- `node dist/cli.js validate --summary --json --limit 20` returned ok with 0 warnings and 0 errors.
- `node dist/cli.js doctor --strict --json` returned ok with only the expected local DB runtime warning.
- No functional source/site/docs/deploy changes were made.

# Notes / Follow-ups

- None.
