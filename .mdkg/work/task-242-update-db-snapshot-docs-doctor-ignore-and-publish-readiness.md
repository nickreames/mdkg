---
id: task-242
type: task
title: update db snapshot docs doctor ignore and publish readiness
status: done
priority: 1
epic: epic-31
parent: goal-2
tags: [project-db, snapshot, docs, doctor, release]
owners: []
links: []
artifacts: []
relates: [goal-2, epic-31, edd-13, task-236, task-240, task-241]
blocked_by: [task-236, task-240, task-241]
blocks: [task-243]
refs: [edd-13, rule-3, rule-4]
aliases: [db-snapshot-docs-closeout]
skills: []
created: 2026-06-03
updated: 2026-06-03
---

# Overview

Update user-facing docs, seeded init assets, doctor/ignore guidance, changelog,
and publish-readiness assertions for DB snapshots.

# Acceptance Criteria

- README, CLI command matrix, seeded init docs, help output, and changelog
  document `mdkg db snapshot ...`.
- Doctor and ignore guidance preserve active runtime/WAL safety and explain
  sealed snapshot opt-in behavior.
- Publish readiness assertions require compiled snapshot helper output and
  seeded docs for snapshot commands.

# Explicit Exclusions

- No real npm publish.
- No profile redaction docs beyond deferred roadmap language.

# Files Affected

- README, CLI matrix, seeded init docs, changelog, doctor/help tests, and
  `scripts/assert-publish-ready.js`.

# Implementation Notes

Document active runtime files as ignored local state and sealed snapshots as
explicit opt-in artifacts.

# Test Plan

- `npm run cli:check`
- Docs/help unit tests.
- `node scripts/assert-publish-ready.js`

# Closeout Evidence

- 2026-06-03: Updated README, CLI command matrix, seeded init README/command
  matrix/agent-start docs, `AGENT_START.md`, and changelog for
  `mdkg db snapshot ...`.
- 2026-06-03: Updated `scripts/cli_help_snapshot.js`,
  `scripts/assert-publish-ready.js`, and package scripts for snapshot help and
  smoke coverage.
- 2026-06-03: `npm run cli:check`, `node scripts/assert-publish-ready.js`,
  `node dist/cli.js validate`, and `git diff --check` passed after docs and
  readiness updates.

# Links / Artifacts

- `goal-2`
- `epic-31`
- `edd-13`
