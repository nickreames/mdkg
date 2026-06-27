---
id: task-599
type: task
title: add docs and release notes maintenance automation for CLI growth
status: todo
priority: 1
epic: epic-201
parent: goal-41
tags: [0.3.9, docs, automation, release-notes, changelog]
owners: []
links: []
artifacts: [scripts, CLI_COMMAND_MATRIX.md, CHANGELOG.md, docs]
relates: []
blocked_by: [task-594]
blocks: [test-305, task-600]
refs: [task-594]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Add or extend checks that keep CLI command docs, first-party skills, changelog
release notes, and public release-note inputs current as mdkg capabilities grow.

# Acceptance Criteria

- Automation catches command examples that no longer match the CLI.
- Publish-readiness checks can detect stale public version/release-note drift.
- Changelog/release-note inputs are structured enough for the `0.4.0` public
  release notes page.
- Existing docs checks remain deterministic and runnable locally.

# Files Affected

- scripts and docs-checking helpers
- `CLI_COMMAND_MATRIX.md`
- generated docs inputs/outputs as required
- `CHANGELOG.md` checks, not release content unless implementation requires it

# Implementation Notes

- Prefer checks that fail with actionable diagnostics.
- Avoid duplicating release copy outside `CHANGELOG.md` unless generated or
  reconciled.

# Test Plan

- `npm run docs:check`
- `node scripts/assert-publish-ready.js`
- focused check fixtures for command and changelog drift
- `test-305`

# Links / Artifacts

- `edd-57`
